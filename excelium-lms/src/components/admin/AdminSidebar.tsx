'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Users, CreditCard,
  FileText, Video, Award, Bell, Settings, Layers,
  GraduationCap, Eye, LogOut, Menu, X, Plus, AlertCircle
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
  const pendingCount = 3

  const handleLogout = async () => {
    try { await supabase.auth.signOut() } catch {}
    toast.success('Déconnexion réussie')
    window.location.href = '/connexion'
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed md:sticky top-0 left-0 h-screen z-50 md:z-auto',
        'w-64 bg-white border-r border-[#E7E2D6]',
        'flex flex-col transition-transform duration-300 shadow-lg md:shadow-none',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        {/* Brand */}
        <div className="p-5 border-b border-[#E7E2D6] flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A24B] to-[#A0782E] flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-serif font-bold text-[#0A1F44] text-xs tracking-wider">EXCELIUM ADMIN</div>
              <div className="text-[#C9A24B] text-[10px] tracking-widest font-mono">CABINET & E-LEARNING</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-[#475569] hover:text-[#0A1F44] p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
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
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all relative',
                  isActive
                    ? 'bg-[#C9A24B]/10 text-[#A0782E] font-bold border-r-2 border-[#C9A24B]'
                    : 'text-[#475569] hover:bg-[#F3EFE6] hover:text-[#0A1F44]'
                )}
              >
                <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-[#C9A24B]' : 'text-[#94A3B8]')} />
                <span className="flex-1 truncate">{link.label}</span>
                {badgeValue && badgeValue > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-[#0A1F44] text-[10px] font-bold flex items-center justify-center font-mono">
                    {badgeValue}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-[#E7E2D6] space-y-0.5">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[#475569] hover:bg-[#F3EFE6] hover:text-[#0A1F44] transition-all"
          >
            <Eye className="w-4 h-4 text-[#94A3B8]" />
            <span>Voir le site public</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-[#475569] hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-4 h-4 text-[#94A3B8]" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E7E2D6] px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-[#F3EFE6] text-[#475569] hover:text-[#0A1F44] transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[#475569] text-[11px] font-mono capitalize">
                {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
              <h1 className="font-serif font-bold text-[#0A1F44] text-lg leading-tight">
                Plateforme d&apos;Administration Excelium
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/paiements"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-all"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>3 paiements à valider</span>
            </Link>

            <Link
              href="/admin/formations/nouveau"
              className="btn-gold text-xs !h-12 px-4 rounded-xl font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Nouveau cours</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
