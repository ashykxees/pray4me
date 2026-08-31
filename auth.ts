import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import { prisma } from "@/lib/prisma"
import { addGuildMemberRole, removeGuildMemberRole } from "@/lib/discord"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID ?? process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? process.env.AUTH_DISCORD_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtected =
        nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/profile") ||
        nextUrl.pathname.startsWith("/prayer") ||
        nextUrl.pathname.startsWith("/share-story") ||
        nextUrl.pathname.startsWith("/onboarding")
      if (isProtected && !isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl))
      }
      if (isLoggedIn && nextUrl.pathname === "/") {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }
      return true
    },
  },
  events: {
    async signIn({ account }) {
      if (account?.provider !== "discord" || !account.providerAccountId) return

      const guildId = process.env.DISCORD_GUILD_ID
      const verifiedRoleId = process.env.DISCORD_VERIFIED_ROLE_ID || "1541281396406878289"
      const unverifiedRoleId = process.env.DISCORD_UNVERIFIED_ROLE_ID || "1541282402582663208"
      if (!guildId) return

      const userId = account.providerAccountId
      try {
        await removeGuildMemberRole(guildId, userId, unverifiedRoleId)
        await addGuildMemberRole(guildId, userId, verifiedRoleId)
        console.log(`Verified Discord user ${userId} in guild ${guildId}`)
      } catch (err) {
        console.error("Failed to update verification roles:", err)
      }
    },
  },
})
