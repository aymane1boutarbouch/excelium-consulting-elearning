'use client'

import React, { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-[#E7E2D6] shadow-sm text-center py-12 space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-xl font-bold text-[#0A1F44]">Message envoyé avec succès</h3>
        <p className="text-[#475569] text-sm max-w-sm mx-auto">
          Merci pour votre prise de contact. Notre équipe pédagogique vous répondra dans les plus brefs délais.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm font-semibold text-[#C9A24B] hover:underline pt-2"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-2xl border border-[#E7E2D6] shadow-sm space-y-5">
      <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
        Envoyez-nous un message
      </h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Nom complet
          </label>
          <input
            type="text"
            required
            placeholder="Ex: Youssef El Alami"
            className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] border border-[#E7E2D6] text-sm text-[#1E293B] focus:outline-none focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Adresse email
          </label>
          <input
            type="email"
            required
            placeholder="votre.email@exemple.ma"
            className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] border border-[#E7E2D6] text-sm text-[#1E293B] focus:outline-none focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5">
            Votre message ou demande de formation
          </label>
          <textarea
            rows={4}
            required
            placeholder="Précisez la formation souhaitée ou votre question..."
            className="w-full px-4 py-3 rounded-xl bg-[#FAF8F3] border border-[#E7E2D6] text-sm text-[#1E293B] focus:outline-none focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B] transition-all resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-[#0A1F44] hover:bg-[#081836] text-white font-semibold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 group"
        >
          {loading ? 'Envoi en cours...' : (
            <>
              Envoyer le message
              <Send className="w-4 h-4 text-[#C9A24B] group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
