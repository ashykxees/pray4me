"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { postQuestion, postAnswer } from "./actions"
import { Send, MessageCircle } from "lucide-react"

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
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-4xl text-brand-brown-dark">{label}</h1>
          {category === "hard" && (
            <p className="text-brand-sand">View what others have on their mind</p>
          )}
        </div>
      </div>

      <form onSubmit={handlePostQuestion} className="card">
        <h2 className="mb-3 flex items-center gap-2 text-xl text-brand-brown-dark">
          <MessageCircle className="h-5 w-5" />
          Post a {category === "hard" ? "question" : "reflection"}
        </h2>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="input min-h-[100px]"
          rows={3}
          placeholder="What's on your heart?"
          required
        />
        {error && <p className="mt-2 text-sm text-brand-muted-brown">{error}</p>}
        <button type="submit" className="btn-primary mt-4">
          <Send className="h-4 w-4" />
          Post
        </button>
      </form>

      <div className="space-y-5">
        {questions.length === 0 ? (
          <div className="card text-center">
            <p className="text-brand-brown">No posts yet. Be the first to share.</p>
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="card">
              <p className="whitespace-pre-wrap text-lg text-brand-brown-dark">{q.content}</p>
              <p className="mt-2 text-xs text-brand-sand">{new Date(q.createdAt).toLocaleDateString()}</p>
              {q.answers.length > 0 && (
                <div className="mt-5 space-y-3 border-t border-brand-tan/30 pt-5">
                  {q.answers.map((a) => (
                    <div key={a.id} className="rounded-2xl bg-brand-beige/50 p-4">
                      <p className="text-brand-brown-dark">{a.content}</p>
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
                  className="mt-5 flex flex-col gap-2"
                >
                  <textarea
                    value={answerForms[q.id] || ""}
                    onChange={(e) =>
                      setAnswerForms((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                    className="input min-h-[80px]"
                    rows={2}
                    placeholder="Answer this question..."
                    required
                  />
                  <button type="submit" className="btn-secondary self-start">
                    <Send className="h-4 w-4" />
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
