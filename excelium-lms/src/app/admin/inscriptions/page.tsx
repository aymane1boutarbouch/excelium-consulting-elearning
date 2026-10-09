'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus, Search, CheckCircle, Clock, XCircle, ArrowUpRight } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const mockEnrollments = [
  {
    id: 'enr-01',
    referenceCode: 'EXC-2026-9481',
    studentName: 'Karim Bencherif',
    studentEmail: 'k.bencherif@gmail.com',
    courseTitle: 'Pratique de la Liasse Fiscale Marocaine & IS 2026',
    enrolledAt: '2026-03-02T10:14:00Z',
    status: 'approved',
    completionRate: 65,
  },
  {
    id: 'enr-02',
    referenceCode: 'EXC-2026-3820',
    studentName: 'Sara Loudiyi',
    studentEmail: 'sara.loudiyi@outlook.com',
    courseTitle: 'Comptabilité Générale des Sociétés (PCM)',
    enrolledAt: '2026-03-01T15:30:00Z',
    status: 'pending',
    completionRate: 0,
  },
  {
    id: 'enr-03',
    referenceCode: 'EXC-2026-7712',
    studentName: 'Youssef Chraibi',
    studentEmail: 'ychraibi@fiduciaire.ma',
    courseTitle: 'Gestion de la Paie & Télédéclarations SIMPL-CNSS',
    enrolledAt: '2026-02-27T09:45:00Z',
    status: 'approved',
    completionRate: 100,
  },
  {
    id: 'enr-04',
    referenceCode: 'EXC-2026-1102',
    studentName: 'Fatima-Zohra Alami',
    studentEmail: 'fz.alami@finance.ma',
    courseTitle: 'Audit Fiscal & Préparation au Contrôle',
    enrolledAt: '2026-02-25T11:20:00Z',
    status: 'approved',
    completionRate: 40,
  },
]

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState(mockEnrollments)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const toggleStatus = (id: string, newStatus: string) => {
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e))
    toast.success('Statut d\'inscription mis à jour')
  }

  const handleManualEnroll = () => {
    const studentName = prompt('Nom complet de l\'étudiant :')
    if (!studentName) return
    const courseTitle = prompt('Nom de la formation :', 'Pratique de la Liasse Fiscale Marocaine & IS 2026')
    
    const newEnr = {
      id: `enr-${Date.now()}`,
      referenceCode: `EXC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName,
      studentEmail: `${studentName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      courseTitle: courseTitle || 'Formation Comptable',
      enrolledAt: new Date().toISOString(),
      status: 'approved',
      completionRate: 0,
    }
    setEnrollments([newEnr, ...enrollments])
    toast.success(`Inscription manuelle créée pour ${studentName} !`)
  }

  const filtered = enrollments.filter(e => {
    const matchesSearch = e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.referenceCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || e.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-navy text-2xl">
            Registre des Inscriptions ({enrollments.length})
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Visualisez et gérez les accès aux cours attribués aux apprenants
          </p>
        </div>
        <button
          onClick={handleManualEnroll}
          className="btn-gold text-xs px-4 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Inscription Manuelle
        </button>
      </div>

      {/* Filter bar */}
      <div className="glass-card-light p-4 rounded-2xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par référence, étudiant..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none text-navy w-full sm:w-auto"
        >
          <option value="all">Tous les statuts</option>
          <option value="approved">Approuvé (Accès actif)</option>
          <option value="pending">En attente de paiement</option>
          <option value="rejected">Refusé / Rejeté</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card-light rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Référence</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Étudiant</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Formation</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Progression</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Statut</th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((enr) => (
                <tr key={enr.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-xs font-bold text-gold">
                    {enr.referenceCode}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-sm font-bold text-navy">{enr.studentName}</div>
                    <div className="text-xs text-muted-foreground">{enr.studentEmail}</div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-navy font-medium max-w-[220px] truncate">
                    {enr.courseTitle}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="w-28 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                        <span>Progression</span>
                        <span>{enr.completionRate}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full" style={{ width: `${enr.completionRate}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-bold border',
                      enr.status === 'approved' ? 'bg-emerald/10 text-emerald border-emerald/20' :
                      enr.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    )}>
                      {enr.status === 'approved' ? 'Approuvé' : enr.status === 'pending' ? 'En attente' : 'Refusé'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {enr.status === 'pending' ? (
                      <button
                        onClick={() => toggleStatus(enr.id, 'approved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald/10 text-emerald border border-emerald/20 hover:bg-emerald/20 text-xs font-bold transition-all"
                      >
                        Valider l&apos;accès
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleStatus(enr.id, enr.status === 'approved' ? 'rejected' : 'approved')}
                        className="px-3 py-1.5 rounded-xl border border-border text-xs font-medium hover:bg-muted transition-colors"
                      >
                        {enr.status === 'approved' ? 'Révoquer' : 'Réactiver'}
                      </button>
                    )}
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
