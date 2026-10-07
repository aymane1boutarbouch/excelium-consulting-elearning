'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Users, CreditCard,
  FileText, Video, Award, Bell, Settings, Layers,
  GraduationCap, Eye, LogOut, Menu, X, Plus, AlertCircle, CheckCircle2
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

const adminLinks = [
  { label: 'Tableau de bord', icon: LayoutDashboard, href: '/admin' },
  { label: 'CMS & Structure', icon: Layers, href: '/admin/cms' },
  { label: 'Programmes', icon: Layers, href: '/admin/programmes' },
  { label: 'Formations', icon: BookOpen, href: '/admin/formations' },
  { label: 'Étudiants', icon: Users, href: '/admin/etudiants' },
  { label: 'Paiements', icon: CreditCard, href: '/admin/paiements', badgeKey: 'pendingPayments' },
  { label: 'Inscriptions', icon: FileText, href: '/admin/inscriptions' },
  { label: 'Quiz & Examens', icon: FileText, href: '/admin/quiz' },
  { label: 'Sessions live', icon: Video, href: '/admin/sessions' },
  { label: 'Certificats', icon: Award, href: '/admin/certificats' },
  { label: 'Annonces', icon: Bell, href: '/admin/annonces' },
  { label: 'Paramètres', icon: Settings, href: '/admin/parametres' },
]

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pendingCount, setPendingCount] = useState(3)

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch {}
    toast.success('Déconnexion réussie')
    window.location.href = '/connexion'
  }

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={cn(
        'fixed md:sticky top-0 left-0 h-screen z-50 md:z-auto',
        'w-64 bg-navy dark:bg-navy-900 border-r border-white/10',
        'flex flex-col transition-transform duration-300 shadow-2xl md:shadow-none',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Brand header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
              <GraduationCap className="w-6 h-6 text-navy" />
            </div>
            <div>
              <div className="font-display font-bold text-white text-xs tracking-wider">EXCELIUM ADMIN</div>
              <div className="text-gold text-[10px] tracking-widest font-mono">CABINET &amp; E-LEARNING</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {adminLinks.map((link) => {
            const Icon = link.icon
            const isActive = link.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(link.href)
            
            const badgeValue = link.badgeKey === 'pendingPayments' ? pendingCount : null

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'sidebar-item relative group text-xs py-2.5 px-3 rounded-xl flex items-center gap-3 transition-all',
                  isActive
                    ? 'bg-gold/15 text-gold font-bold border border-gold/30'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                )}
              >
                <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-gold' : 'text-white/50 group-hover:text-gold')} />
                <span className="flex-1 truncate">{link.label}</span>
                {badgeValue && badgeValue > 0 && (
                  <span className="w-5 h-5 rounded-full bg-yellow-500 text-navy text-[10px] font-bold flex items-center justify-center font-mono animate-pulse">
                    {badgeValue}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="sidebar-item text-white/60 hover:text-white text-xs py-2 px-3 rounded-xl flex items-center gap-2"
            target="_blank"
          >
            <Eye className="w-4 h-4 text-white/40" />
            <span>Voir le site public</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full sidebar-item text-white/60 hover:text-red-400 hover:bg-red-500/10 text-xs py-2 px-3 rounded-xl flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4 text-white/40 group-hover:text-red-400" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-ivory/85 dark:bg-navy/85 backdrop-blur-md border-b border-border px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-muted-foreground text-[11px] font-mono capitalize">
                {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
              <h1 className="font-display font-bold text-navy dark:text-white text-lg leading-tight">
                Plateforme d&apos;Administration Excelium
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/paiements"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400 text-xs font-semibold hover:bg-yellow-500/20 transition-all"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>3 paiements à valider</span>
            </Link>

            <Link
              href="/admin/formations/nouveau"
              className="btn-gold text-xs px-3.5 py-2 rounded-xl font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Nouveau cours</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
