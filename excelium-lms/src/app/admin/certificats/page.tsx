'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Award, Plus, Search, ExternalLink, ShieldCheck, Download, RefreshCw, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const mockCertificates = [
  {
    id: 'cert-1',
    code: 'EXC-2026-8819',
    studentName: 'Youssef Chraibi',
    studentEmail: 'ychraibi@fiduciaire.ma',
    courseTitle: 'Gestion de la Paie, CNSS & SIMPL-Paie',
    issuedAt: '2026-03-01T14:20:00Z',
    score: 92,
    isRevoked: false,
  },
  {
    id: 'cert-2',
    code: 'EXC-2026-4012',
    studentName: 'Mohammed Al Fassi',
    studentEmail: 'm.alfassi@excelium.ma',
    courseTitle: 'Pratique de la Liasse Fiscale Marocaine & IS 2026',
    issuedAt: '2026-02-18T16:45:00Z',
    score: 95,
    isRevoked: false,
  },
  {
    id: 'cert-3',
    code: 'EXC-2026-1092',
    studentName: 'Fatima-Zohra Alami',
    studentEmail: 'fz.alami@finance.ma',
    courseTitle: 'Comptabilité Générale des Sociétés (PCM)',
    issuedAt: '2026-01-30T11:00:00Z',
    score: 88,
    isRevoked: false,
  },
]

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState(mockCertificates)
  const [searchTerm, setSearchTerm] = useState('')

  const handleIssueCertificate = () => {
    const studentName = prompt('Nom complet du récipiendaire :')
    if (!studentName) return
    const courseTitle = prompt('Formation validée :', 'Pratique de la Liasse Fiscale Marocaine & IS 2026')
    const code = `EXC-2026-${Math.floor(1000 + Math.random() * 9000)}`

    const newCert = {
      id: `cert-${Date.now()}`,
      code,
      studentName,
      studentEmail: `${studentName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      courseTitle: courseTitle || 'Formation Comptable Excelium',
      issuedAt: new Date().toISOString(),
      score: 90,
      isRevoked: false,
    }

    setCerts([newCert, ...certs])
    toast.success(`Certificat officiel ${code} délivré à ${studentName} !`)
  }

  const toggleRevoke = (id: string) => {
    setCerts(prev => prev.map(c => c.id === id ? { ...c, isRevoked: !c.isRevoked } : c))
    toast.success('Statut du certificat mis à jour')
  }

  const filtered = certs.filter(c =>
    c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-navy dark:text-white text-2xl">
            Registre des Certificats Professionnels ({certs.length})
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Gérez la délivrance et la vérification des diplômes signés par l&apos;Expert-Comptable
          </p>
        </div>
        <button
          onClick={handleIssueCertificate}
          className="btn-gold text-xs px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Émettre un Certificat
        </button>
      </div>

      <div className="glass-card-light dark:glass-card p-4 rounded-2xl border border-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par code certificat, élève..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      <div className="glass-card-light dark:glass-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Code Unique</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Apprenant</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Formation Validée</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Date &amp; Score</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Vérification QR</th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cert) => (
                <tr key={cert.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-gold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald" /> {cert.code}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-sm font-bold text-navy dark:text-white">{cert.studentName}</div>
                    <div className="text-xs text-muted-foreground">{cert.studentEmail}</div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-navy dark:text-white font-medium max-w-[220px] truncate">
                    {cert.courseTitle}
                  </td>
                  <td className="px-4 py-3.5 text-xs font-mono">
                    <div className="text-navy dark:text-white font-bold">{cert.score}% de réussite</div>
                    <div className="text-muted-foreground text-[10px]">
                      {format(new Date(cert.issuedAt), 'd MMM yyyy', { locale: fr })}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Link
                      href={`/certificats/verifier/${cert.code}`}
                      target="_blank"
                      className="text-gold hover:underline text-xs font-bold inline-flex items-center gap-1"
                    >
                      Voir la preuve publique <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => toggleRevoke(cert.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors',
                        cert.isRevoked ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                      )}
                    >
                      {cert.isRevoked ? 'Réactiver' : 'Révoker'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
