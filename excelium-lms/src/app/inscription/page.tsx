'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GraduationCap, Mail, Lock, User, Eye, EyeOff, Phone, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'
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
      <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center p-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md text-center"
        >
          <div className="bg-white border border-[#E7E2D6] p-8 md:p-10 rounded-3xl shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-6 text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#0A1F44] mb-3">
              Vérifiez votre boîte email
            </h2>
            <p className="text-[#475569] text-sm leading-relaxed mb-6">
              Un email de confirmation vient d&apos;être envoyé à{' '}
              <span className="text-[#0A1F44] font-semibold">{formData.email}</span>.
              Veuillez cliquer sur le lien pour valider l&apos;activation de votre compte.
            </p>
            <Link
              href="/connexion"
              className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-[#0A1F44] hover:bg-[#081836] text-white font-semibold text-sm transition-all justify-center inline-flex items-center shadow-sm"
            >
              Aller à la page de connexion
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center p-4 relative overflow-hidden py-12">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C9A24B]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#C9A24B]/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C9A24B] to-[#A0782E] flex items-center justify-center shadow-sm">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <div className="font-serif font-bold text-[#0A1F44] text-base leading-none">EXCELIUM</div>
              <div className="text-[#C9A24B] text-xs tracking-widest font-mono">CONSULTING COMPTA</div>
            </div>
          </Link>
        </div>

        <div className="bg-white border border-[#E7E2D6] p-8 rounded-3xl shadow-sm">
          <h1 className="font-serif text-2xl font-bold text-[#0A1F44] text-center mb-2">
            Créer votre compte
          </h1>
          <p className="text-[#475569] text-sm text-center mb-6">
            Rejoignez notre communauté de professionnels en gestion et fiscalité
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-[#1E293B] text-xs font-semibold uppercase tracking-wider mb-1.5">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Youssef El Mansouri"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF8F3] border border-[#E7E2D6] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B] transition-all text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[#1E293B] text-xs font-semibold uppercase tracking-wider mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="votre.email@exemple.ma"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF8F3] border border-[#E7E2D6] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B] transition-all text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[#1E293B] text-xs font-semibold uppercase tracking-wider mb-1.5">
                Téléphone (optionnel)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+212 600 000 000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF8F3] border border-[#E7E2D6] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B] transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[#1E293B] text-xs font-semibold uppercase tracking-wider mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  placeholder="8 caractères minimum"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#FAF8F3] border border-[#E7E2D6] text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0A1F44] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-[#1E293B] text-xs font-semibold uppercase tracking-wider mb-1.5">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF8F3] border text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none transition-all text-sm ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-500'
                      : 'border-[#E7E2D6] focus:border-[#C9A24B] focus:ring-1 focus:ring-[#C9A24B]'
                  }`}
                />
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-[#0A1F44] hover:bg-[#081836] text-white font-semibold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 group mt-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight className="w-4 h-4 text-[#C9A24B] group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#475569] text-xs mt-6 leading-relaxed">
            En créant un compte, vous acceptez nos{' '}
            <Link href="/cgu" className="text-[#C9A24B] hover:underline font-medium">conditions d&apos;utilisation</Link>{' '}
            et notre{' '}
            <Link href="/confidentialite" className="text-[#C9A24B] hover:underline font-medium">politique de confidentialité</Link>.
          </p>

          <p className="text-center text-[#475569] text-sm mt-4">
            Déjà un compte ?{' '}
            <Link href="/connexion" className="text-[#C9A24B] hover:text-[#A0782E] hover:underline font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
