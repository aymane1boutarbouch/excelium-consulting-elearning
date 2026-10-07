'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, Phone, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function InscriptionPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    setLoading(true)
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')) {
        setStep('verify')
        return
      }

      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: formData.fullName,
          },
        },
      })

      if (error) throw error

      // Create profile
      if (data.user) {
        const { error: profileError } = await (supabase as any).from('profiles').insert({
          id: data.user.id,
          email: formData.email,
          full_name: formData.fullName,
          phone: formData.phone,
          role: 'student',
        })

        if (profileError && profileError.code !== '23505') {
          throw profileError
        }
      }

      setStep('verify')
    } catch (err: any) {
      if (err.message === 'Failed to fetch' || err.message?.includes('fetch')) {
        setStep('verify')
        return
      }
      if (err.message?.includes('already registered')) {
        toast.error('Un compte existe déjà avec cet email')
      } else {
        toast.error(err.message || 'Erreur lors de l\'inscription')
      }
    } finally {
      setLoading(false)
    }
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md text-center"
        >
          <div className="glass-card p-10 rounded-3xl">
            <div className="w-20 h-20 rounded-full bg-emerald/10 border-2 border-emerald/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-3">
              Vérifiez votre email !
            </h2>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Un email de vérification a été envoyé à{' '}
              <span className="text-gold font-semibold">{formData.email}</span>.
              Cliquez sur le lien pour activer votre compte.
            </p>
            <Link href="/connexion" className="btn-gold w-full rounded-xl py-3 justify-center inline-flex">
              Aller à la connexion
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden py-10">
      <div className="absolute inset-0 bg-mesh" />
      <div className="orb-gold w-96 h-96 top-0 right-0 opacity-20 absolute" />

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

        <div className="glass-card p-8 rounded-3xl">
          <h1 className="font-display text-2xl font-bold text-white text-center mb-2">
            Créer votre compte
          </h1>
          <p className="text-white/50 text-sm text-center mb-8">
            Rejoignez plus de 1200 apprenants sur Excelium
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Nom complet</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Mohammed Al Fassi"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Téléphone (optionnel)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+212 600 000 000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder="8 caractères minimum"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-white/30 focus:outline-none transition-all text-sm ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-500/50'
                      : 'border-white/10 focus:border-gold/50'
                  }`}
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">Les mots de passe ne correspondent pas</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold rounded-xl py-3.5 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <>Créer mon compte <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/40 text-xs mt-6 leading-relaxed">
            En créant un compte, vous acceptez nos{' '}
            <Link href="/cgu" className="text-gold hover:underline">conditions d&apos;utilisation</Link>{' '}
            et notre{' '}
            <Link href="/confidentialite" className="text-gold hover:underline">politique de confidentialité</Link>.
          </p>

          <p className="text-center text-white/40 text-sm mt-4">
            Déjà un compte ?{' '}
            <Link href="/connexion" className="text-gold hover:underline">Se connecter</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
