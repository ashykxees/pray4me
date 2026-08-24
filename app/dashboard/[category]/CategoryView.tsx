"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { postQuestion, postAnswer } from "./actions"

export function CategoryView({
  category,
  label,
  questions,
}: {
  category: string
  label: string
  questions: {
    id: string
    content: string
    createdAt: Date
    answers: {
      id: string
      content: string
      createdAt: Date
      user: { firstName?: string | null; name?: string | null }
    }[]
  }[]
}) {
  const router = useRouter()
  const [question, setQuestion] = useState("")
  const [error, setError] = useState("")
  const [answerForms, setAnswerForms] = useState<Record<string, string>>({})

  async function handlePostQuestion(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    const data = new FormData()
    data.set("category", category.toUpperCase())
    data.set("content", question)
    try {
      await postQuestion(data)
      setQuestion("")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not post question.")
    }
  }

  async function handlePostAnswer(e: React.FormEvent, questionId: string) {
    e.preventDefault()
    const content = answerForms[questionId]
    if (!content) return
    const data = new FormData()
    data.set("questionId", questionId)
    data.set("content", content)
    try {
      await postAnswer(data)
      setAnswerForms((prev) => ({ ...prev, [questionId]: "" }))
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not post answer.")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-brown-dark">{label}</h1>
        {category === "hard" && (
          <span className="text-sm text-brand-sand">View what others have on their mind</span>
        )}
      </div>

      <form onSubmit={handlePostQuestion} className="rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-3 text-lg font-semibold text-brand-brown-dark">
          Post a {category === "hard" ? "question" : "reflection"}
        </h2>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full rounded-xl border border-brand-tan bg-brand-cream p-3 text-brand-brown-dark"
          rows={3}
          placeholder="What's on your heart?"
          required
        />
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          className="mt-3 rounded-full bg-brand-brown px-5 py-2 text-sm font-semibold text-brand-cream hover:bg-brand-brown-dark"
        >
          Post
        </button>
      </form>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <p className="text-brand-sand">No posts yet. Be the first to share.</p>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="rounded-2xl bg-white p-6 shadow-md">
              <p className="text-brand-brown-dark">{q.content}</p>
              {q.answers.length > 0 && (
                <div className="mt-4 space-y-2 border-t border-brand-beige pt-4">
                  {q.answers.map((a) => (
                    <div key={a.id} className="rounded-xl bg-brand-cream p-3">
                      <p className="text-sm text-brand-brown-dark">{a.content}</p>
                      <p className="mt-1 text-xs text-brand-sand">
                        — {a.user.firstName || a.user.name || "Anonymous"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {category === "hard" && (
                <form
                  onSubmit={(e) => handlePostAnswer(e, q.id)}
                  className="mt-4 flex flex-col gap-2"
                >
                  <textarea
                    value={answerForms[q.id] || ""}
                    onChange={(e) =>
                      setAnswerForms((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                    className="w-full rounded-xl border border-brand-tan bg-brand-cream p-3 text-sm text-brand-brown-dark"
                    rows={2}
                    placeholder="Answer this question..."
                    required
                  />
                  <button
                    type="submit"
                    className="self-start rounded-full bg-brand-sand px-4 py-1.5 text-sm font-semibold text-brand-brown-dark hover:bg-brand-tan"
                  >
                    Answer
                  </button>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
