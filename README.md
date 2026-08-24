# Pray4Me

A calm, welcoming Next.js app where people can share prayer requests, join devotionals, and offer support.

## Tech stack

- Next.js 16 (App Router)
- Auth.js v5 (NextAuth) with Google and Discord providers
- Prisma 6 + SQLite for local development
- Tailwind CSS v4
- Discord REST API for moderation embeds and interactions

## Local setup

1. Install dependencies

```bash
npm install
```

2. Set up the database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

3. Copy `.env.example` to `.env` and fill in the values.

```bash
cp .env.example .env
```

## Google Sign-In setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth client ID**.
5. If this is your first OAuth client, configure the OAuth consent screen:
   - Choose **External** user type.
   - Fill in the app name, user support email, and developer contact email.
   - Add the `.../auth/userinfo.email` and `.../auth/userinfo.profile` scopes.
   - Add your email as a test user if the app is in testing mode.
6. Create a **Web application** client ID.
   - Add `http://localhost:3000` to **Authorized JavaScript origins**.
   - Add `http://localhost:3000/api/auth/callback/google` to **Authorized redirect URIs**.
7. Copy the **Client ID** and **Client Secret** into your `.env`:

```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## Discord setup (optional but required for moderation)

1. Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications).
2. In **Bot**, copy the bot token into `DISCORD_BOT_TOKEN`.
3. In **General Information**, copy the **Public Key** into `DISCORD_PUBLIC_KEY`.
4. Add the bot to your server with permission to send messages in the moderation channels.
5. Paste the channel IDs in `.env`.
6. Point the **Interactions Endpoint URL** to `https://your-deployment-url.com/api/discord/interactions`.

## Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Set all `.env` variables for production, then build:

```bash
npm run build
npm start
```

## Environment variables

See `.env.example` for the full list.
