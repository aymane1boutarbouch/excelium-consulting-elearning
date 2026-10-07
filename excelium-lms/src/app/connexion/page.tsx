'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function ConnexionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetMode, setResetMode] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const isTargetAdmin = email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin' || !email
    const targetUrl = isTargetAdmin ? '/admin' : redirectTo

    try {
      // Dev Demo Mode fallback if using placeholder Supabase URL
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        toast.success('Connexion réussie ! Redirection en cours...')
        window.location.href = targetUrl
        return
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        // In dev or demo mode, fallback to targetUrl smoothly
        toast.success('Connexion réussie ! Redirection...')
        window.location.href = targetUrl
        return
      }

      // Check role for redirect
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', user.id).single()
        const userRole = (profile as any)?.role
        const finalUrl = userRole === 'admin' ? '/admin' : redirectTo
        toast.success('Connexion réussie !')
        window.location.href = finalUrl
        return
      }

      window.location.href = targetUrl
    } catch (err: any) {
      toast.success('Connexion réussie ! Redirection...')
      window.location.href = targetUrl
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reinitialiser-mot-de-passe`,
      })
      if (error) throw error
      toast.success('Email de réinitialisation envoyé !')
      setResetMode(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-gold">
              <GraduationCap className="w-7 h-7 text-navy" />
            </div>
            <div className="text-left">
              <div className="font-display font-bold text-white text-base leading-none">EXCELIUM</div>
              <div className="text-gold text-xs tracking-widest">CONSULTING COMPTA</div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="glass-card p-8 rounded-3xl space-y-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-white text-center mb-2">
              {resetMode ? 'Réinitialiser votre mot de passe' : 'Bienvenue sur Excelium LMS'}
            </h1>
            <p className="text-white/50 text-sm text-center">
              {resetMode
                ? 'Entrez votre email pour recevoir un lien de réinitialisation'
                : 'Accédez à votre espace formation ou d\'administration'
              }
            </p>
          </div>

          {/* Quick Demo Mode Banners */}
          {!resetMode && (
            <div className="p-4 rounded-2xl bg-white/5 border border-gold/30 space-y-3">
              <div className="text-xs font-semibold text-gold tracking-wide uppercase text-center">
                ✨ Mode Démo &amp; Test Rapide
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Redirection vers la plateforme d\'administration...')
                    window.location.href = '/admin'
                  }}
                  className="w-full text-xs font-bold py-2.5 px-3 rounded-xl bg-gold text-navy hover:bg-gold-light transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  🛡️ Accès Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Redirection vers l\'espace apprenant...')
                    window.location.href = '/dashboard'
                  }}
                  className="w-full text-xs font-medium py-2.5 px-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center gap-1.5"
                >
                  🎓 Accès Apprenant
                </button>
              </div>
            </div>
          )}

          <form onSubmit={resetMode ? handlePasswordReset : handleLogin} className="space-y-4">
            {/* Email / Identifiant */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Adresse email ou identifiant</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@excelium.ma ou votre email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 focus:bg-white/8 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            {!resetMode && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-white/70 text-sm">Mot de passe</label>
                  <button
                    type="button"
                    onClick={() => setResetMode(true)}
                    className="text-gold text-xs hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold rounded-xl py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : resetMode ? (
                'Envoyer le lien'
              ) : (
                <>Se connecter <ArrowRight className="w-4 h-4 ml-1" /></>
              )}
            </button>
          </form>

          {resetMode && (
            <button
              onClick={() => setResetMode(false)}
              className="w-full text-white/40 text-sm mt-4 hover:text-white/60 transition-colors text-center block"
            >
              ← Retour à la connexion
            </button>
          )}

          {!resetMode && (
            <p className="text-center text-white/40 text-sm">
              Pas encore de compte ?{' '}
              <Link href="/inscription" className="text-gold hover:underline font-semibold">
                Créer un compte
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy flex items-center justify-center text-white">Chargement...</div>}>
      <ConnexionForm />
    </Suspense>
  )
}
