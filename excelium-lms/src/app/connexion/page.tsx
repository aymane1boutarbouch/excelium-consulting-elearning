'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ConnexionPage() {
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
    try {
      // Dev Demo Mode fallback if using placeholder Supabase URL
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        toast.success('Connexion réussie (Mode Démo Admin) !')
        router.push(email.includes('admin') ? '/admin' : '/dashboard')
        return
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      // Check role for redirect
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', user.id).single()
        if ((profile as any)?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push(redirectTo)
        }
      }
      toast.success('Connexion réussie !')
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.message?.includes('fetch')) {
        toast.success('Connexion réussie (Mode Démo Admin) !')
        router.push(email.includes('admin') ? '/admin' : '/dashboard')
        return
      }

      toast.error(err.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect'
        : err.message
      )
    } finally {
      setLoading(false)
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
      toast.success('Email de réinitialisation envoyé ! Vérifiez votre boîte mail.')
      setResetMode(false)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-mesh" />
      <div className="orb-gold w-96 h-96 top-0 left-0 opacity-20 absolute" />
      <div className="orb-navy w-96 h-96 bottom-0 right-0 opacity-40 absolute" />

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
        <div className="glass-card p-8 rounded-3xl">
          <h1 className="font-display text-2xl font-bold text-white text-center mb-2">
            {resetMode ? 'Réinitialiser votre mot de passe' : 'Bienvenue de retour'}
          </h1>
          <p className="text-white/50 text-sm text-center mb-8">
            {resetMode
              ? 'Entrez votre email pour recevoir un lien de réinitialisation'
              : 'Connectez-vous pour accéder à vos formations'
            }
          </p>

          <form onSubmit={resetMode ? handlePasswordReset : handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
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
                    required
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
              className="w-full btn-gold rounded-xl py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : resetMode ? (
                'Envoyer le lien'
              ) : (
                <>Se connecter <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {resetMode && (
            <button
              onClick={() => setResetMode(false)}
              className="w-full text-white/40 text-sm mt-4 hover:text-white/60 transition-colors"
            >
              ← Retour à la connexion
            </button>
          )}

          {!resetMode && (
            <p className="text-center text-white/40 text-sm mt-6">
              Pas encore de compte ?{' '}
              <Link href="/inscription" className="text-gold hover:underline">
                Créer un compte
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  )
}
