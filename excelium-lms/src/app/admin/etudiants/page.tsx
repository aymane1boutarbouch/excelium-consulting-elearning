'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, Mail, Phone, BookOpen, Award, Shield, CheckCircle, MoreVertical, MessageSquare } from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { toast } from 'sonner'

const mockStudents = [
  {
    id: 'st-01',
    fullName: 'Mohammed Al Fassi',
    email: 'm.alfassi@excelium.ma',
    phone: '+212 661 234 567',
    city: 'Casablanca',
    enrolledCourses: 3,
    completedCourses: 1,
    totalPaid: 3730,
    xpPoints: 1450,
    status: 'actif',
    registeredAt: '2026-01-10',
  },
  {
    id: 'st-02',
    fullName: 'Karim Bencherif',
    email: 'k.bencherif@gmail.com',
    phone: '+212 662 987 654',
    city: 'Rabat',
    enrolledCourses: 2,
    completedCourses: 0,
    totalPaid: 1490,
    xpPoints: 620,
    status: 'actif',
    registeredAt: '2026-02-04',
  },
  {
    id: 'st-03',
    fullName: 'Sara Loudiyi',
    email: 'sara.loudiyi@outlook.com',
    phone: '+212 663 112 233',
    city: 'Tanger',
    enrolledCourses: 1,
    completedCourses: 0,
    totalPaid: 1250,
    xpPoints: 410,
    status: 'actif',
    registeredAt: '2026-02-28',
  },
  {
    id: 'st-04',
    fullName: 'Youssef Chraibi',
    email: 'ychraibi@fiduciaire.ma',
    phone: '+212 664 445 566',
    city: 'Marrakech',
    enrolledCourses: 4,
    completedCourses: 2,
    totalPaid: 4620,
    xpPoints: 2890,
    status: 'actif',
    registeredAt: '2025-11-15',
  },
  {
    id: 'st-05',
    fullName: 'Fatima-Zohra Alami',
    email: 'fz.alami@finance.ma',
    phone: '+212 665 778 899',
    city: 'Agadir',
    enrolledCourses: 1,
    completedCourses: 1,
    totalPaid: 1490,
    xpPoints: 1100,
    status: 'inactif',
    registeredAt: '2026-03-01',
  },
]

export default function AdminStudentsPage() {
  const [students, setStudents] = useState(mockStudents)
  const [searchTerm, setSearchTerm] = useState('')

  const handleSendMessage = (email: string) => {
    toast.success(`Message envoyé à ${email}`)
  }

  const toggleStudentStatus = (id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'actif' ? 'inactif' : 'actif' } : s))
    toast.success('Statut étudiant mis à jour')
  }

  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-navy dark:text-white text-2xl">
            Répertoire des Étudiants ({students.length})
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            Gérez les comptes apprenants, leur progression et leur historique d&apos;apprentissage
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card-light dark:glass-card p-4 rounded-2xl border border-border">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, email ou ville..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border text-xs focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Students Table */}
      <div className="glass-card-light dark:glass-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Étudiant</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Ville &amp; Contact</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Formations</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Total Investi</th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-muted-foreground">Statut</th>
                <th className="px-4 py-3.5 text-right text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center font-bold text-xs font-mono">
                        {student.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-navy dark:text-white">{student.fullName}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-xs font-medium text-navy dark:text-white">{student.city}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-gold" /> {student.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-xs font-bold text-navy dark:text-white flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-gold" />
                      {student.enrolledCourses} cours ({student.completedCourses} terminés)
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {student.xpPoints} XP accumulés
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-mono font-bold text-navy dark:text-white">
                    {formatCurrency(student.totalPaid, 'MAD')}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-bold border',
                      student.status === 'actif' ? 'bg-emerald/10 text-emerald border-emerald/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                    )}>
                      {student.status === 'actif' ? 'Actif' : 'Suspendu'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleSendMessage(student.email)}
                        className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-gold transition-colors"
                        title="Envoyer un message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleStudentStatus(student.id)}
                        className="px-2.5 py-1 rounded-lg border border-border hover:bg-muted text-xs font-medium transition-colors"
                      >
                        {student.status === 'actif' ? 'Bloquer' : 'Activer'}
                      </button>
                    </div>
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
