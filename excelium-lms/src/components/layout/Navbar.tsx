'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GraduationCap, Menu, X, User, ChevronDown } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Formations', href: '/formations' },
  { label: 'À propos du Cabinet', href: '/a-propos' },
  { label: 'Vérifier un Certificat', href: '/certificats/verifier/EXC-DEMO' },
  { label: 'Contact & Accès', href: '/contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        ;(supabase as any)
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

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E7E2D6] shadow-sm py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="section-container flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-[#0A1F44] text-[#C9A24B] shadow-sm group-hover:scale-105"
          >
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div
              className={cn(
                'font-serif font-bold text-sm tracking-wide leading-tight transition-colors',
                scrolled ? 'text-[#0A1F44]' : 'text-[#0A1F44]'
              )}
            >
              EXCELIUM{' '}
              <span className="text-[#C9A24B] font-semibold">CONSULTING</span>
            </div>
            <div className="text-[10px] text-[#475569] tracking-[0.2em] font-mono uppercase">
              COMPTABILITÉ & FISCALITÉ MAROC
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors relative group',
                pathname === link.href
                  ? 'text-[#C9A24B] font-semibold'
                  : 'text-[#1E293B] hover:text-[#C9A24B]'
              )}
            >
              {link.label}
              <span className={cn(
                'absolute -bottom-1 left-0 h-0.5 bg-[#C9A24B] transition-all duration-300',
                pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
              )} />
            </Link>
          ))}
        </nav>

        {/* Action buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {session ? (
            <Link
              href={role === 'admin' ? '/admin' : '/dashboard'}
              className="btn-gold text-sm !h-12"
            >
              <User className="w-4 h-4" />
              {role === 'admin' ? 'Espace Admin' : 'Mon Espace'}
            </Link>
          ) : (
            <>
              <Link
                href="/connexion"
                className="text-sm font-semibold text-[#1E293B] hover:text-[#0A1F44] px-4 py-3 rounded-xl hover:bg-[#F3EFE6] transition-all duration-200"
              >
                Connexion
              </Link>
              <Link href="/inscription" className="btn-gold text-sm !h-12">
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>

        {/* Mobile trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl text-[#1E293B] hover:bg-[#F3EFE6] transition-colors"
          aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden bg-white border-b border-[#E7E2D6]"
          >
            <div className="section-container py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    pathname === link.href
                      ? 'bg-[#C9A24B]/10 text-[#A0782E] font-semibold'
                      : 'text-[#1E293B] hover:bg-[#F3EFE6] hover:text-[#0A1F44]'
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-[#E7E2D6] space-y-2">
                {session ? (
                  <Link
                    href={role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-gold w-full justify-center"
                  >
                    Tableau de Bord
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/connexion"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-outline-navy w-full justify-center"
                    >
                      Connexion
                    </Link>
                    <Link
                      href="/inscription"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn-gold w-full justify-center"
                    >
                      S&apos;inscrire
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
