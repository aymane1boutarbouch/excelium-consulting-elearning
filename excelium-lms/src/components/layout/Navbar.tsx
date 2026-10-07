'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GraduationCap, Menu, X, ArrowRight, User, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        (supabase as any)
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }: any) => {
            if (data) setRole(data.role)
          })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const navLinks = [
    { label: 'Formations', href: '/formations' },
    { label: 'À propos du Cabinet', href: '/a-propos' },
    { label: 'Vérifier un Certificat', href: '/certificats/verifier/EXC-DEMO' },
    { label: 'Contact & Accès', href: '/contact' },
  ]

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b',
      scrolled
        ? 'bg-navy/95 backdrop-blur-md border-white/10 py-3 shadow-md'
        : 'bg-navy border-white/5 py-4'
    )}>
      <div className="section-container flex items-center justify-between">
        {/* Brand logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition-all duration-200">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-serif font-bold text-white text-sm tracking-wide leading-tight">
              EXCELIUM <span className="text-gold font-normal">CONSULTING</span>
            </div>
            <div className="text-[10px] text-white/50 tracking-widest font-mono uppercase">
              COMPTABILITÉ & FISCALITÉ MAROC
            </div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-xs font-medium tracking-wide transition-colors',
                pathname === link.href ? 'text-gold font-semibold' : 'text-white/70 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action button */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <Link
              href={role === 'admin' ? '/admin' : '/dashboard'}
              className="btn-gold text-xs px-4 py-2.5 font-semibold"
            >
              <User className="w-4 h-4" />
              {role === 'admin' ? 'Espace Administration' : 'Mon Espace Apprenant'}
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/connexion"
                className="text-xs font-semibold text-white/80 hover:text-white px-3 py-2 transition-colors"
              >
                Espace Client
              </Link>
              <Link
                href="/inscription"
                className="btn-gold text-xs px-4 py-2 font-semibold"
              >
                S&apos;inscrire
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-white/80 hover:text-white"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy border-b border-white/10 px-4 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-white/80 hover:text-gold py-1"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {session ? (
              <Link
                href={role === 'admin' ? '/admin' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="btn-gold w-full text-center text-xs py-2.5"
              >
                Tableau de Bord
              </Link>
            ) : (
              <>
                <Link
                  href="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-outline-gold w-full text-center text-xs py-2.5"
                >
                  Se Connecter
                </Link>
                <Link
                  href="/inscription"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-gold w-full text-center text-xs py-2.5"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
