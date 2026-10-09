'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Video, Plus, Calendar, Clock, Users, ExternalLink, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { toast } from 'sonner'

const mockSessions = [
  {
    id: 's-1',
    title: 'Masterclass Direct — Décryptage de la Loi de Finances 2026 & Impact IS/TVA',
    instructorName: 'M. Abdellah El Amrani',
    scheduledAt: '2026-10-15T18:30:00Z',
    durationMinutes: 120,
    attendeesCount: 78,
    meetUrl: 'https://meet.google.com/exc-demo-live',
    status: 'programmee',
  },
  {
    id: 's-2',
    title: 'Atelier Pratique — Simulation d\'un Contrôle Fiscal sur SIMPL-IS',
    instructorName: 'M. Abdellah El Amrani',
    scheduledAt: '2026-10-22T19:00:00Z',
    durationMinutes: 90,
    attendeesCount: 52,
    meetUrl: 'https://meet.google.com/exc-demo-atelier',
    status: 'programmee',
  },
]

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState(mockSessions)

  const handleDelete = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    toast.success('Session live supprimée')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-navy text-2xl">
            Sessions Live &amp; Webinaires Directs
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Programmez des masterclasses en visioconférence pour vos apprenants
          </p>
        </div>
        <Link
          href="/admin/sessions/nouvelle"
          className="btn-gold text-xs px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Planifier une Session
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {sessions.map((sess) => (
          <motion.div
            key={sess.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-light p-6 rounded-3xl border border-border flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-emerald/15 text-emerald text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Video className="w-3 h-3" /> Live Programmé
                </span>
                <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gold" /> {sess.durationMinutes} min
                </span>
              </div>

              <h3 className="font-display font-bold text-navy text-lg leading-snug">
                {sess.title}
              </h3>

              <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-semibold text-navy">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    {format(new Date(sess.scheduledAt), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Animateur : <strong className="text-navy">{sess.instructorName}</strong></span>
                  <span className="font-mono text-gold font-bold">{sess.attendeesCount} inscrits</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
              <a
                href={sess.meetUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-gold py-2 px-4 text-xs font-bold rounded-xl inline-flex items-center gap-1.5 flex-1 justify-center"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Lancer la visioconférence
              </a>
              <button
                onClick={() => handleDelete(sess.id)}
                className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
