import React from 'react'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Award, CheckCircle, GraduationCap, ArrowLeft, ShieldCheck } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  params: { code: string }
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `Vérification du Certificat N° ${params.code} — Excelium Consulting Compta`,
  }
}

export default async function VerifyCertificatePage({ params }: Props) {
  const supabase = createServerSupabaseClient()

  const { data: cert } = await (supabase as any)
    .from('certificates')
    .select(`
      *,
      profiles:student_id (full_name, email),
      courses:course_id (title, duration_hours, level)
    `)
    .eq('certificate_number', params.code)
    .single()

  const isValid = cert && !cert.is_revoked

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh" />

      <div className="relative z-10 max-w-lg w-full">
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

        <div className="glass-card p-8 rounded-3xl text-center space-y-6 border border-white/20 shadow-2xl">
          {isValid ? (
            <>
              <div className="w-20 h-20 rounded-full bg-emerald/10 border-4 border-emerald/30 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-10 h-10 text-emerald" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald/10 text-emerald text-xs font-bold uppercase tracking-wider">
                  Certificat Authentique & Valide
                </span>
                <h1 className="font-display text-2xl font-bold text-white mt-3">
                  Certificat Officiel de Formation
                </h1>
                <p className="text-white/50 text-sm mt-1">Délivré par le cabinet Excelium Consulting Compta</p>
              </div>

              <div className="glass-card p-5 rounded-2xl text-left space-y-3 border border-gold/20">
                <div className="flex justify-between text-xs text-white/50">
                  <span>Numéro d&apos;attestation</span>
                  <span className="font-mono text-gold font-bold">{cert.certificate_number}</span>
                </div>
                <div className="flex justify-between text-xs text-white/50">
                  <span>Titulaire</span>
                  <span className="font-semibold text-white">{cert.profiles?.full_name}</span>
                </div>
                <div className="flex justify-between text-xs text-white/50">
                  <span>Formation</span>
                  <span className="font-semibold text-white text-right max-w-[60%]">{cert.courses?.title}</span>
                </div>
                <div className="flex justify-between text-xs text-white/50">
                  <span>Volume horaire</span>
                  <span className="font-mono text-white">{cert.courses?.duration_hours} heures</span>
                </div>
                <div className="flex justify-between text-xs text-white/50 border-t border-white/10 pt-2">
                  <span>Date d&apos;émission</span>
                  <span className="text-white font-medium">
                    {format(new Date(cert.issued_at), 'd MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              </div>

              <p className="text-white/40 text-xs leading-relaxed">
                Ce document officiel atteste que le titulaire a suivi et validé avec succès l&apos;ensemble des exigences académiques de la formation.
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-red-500/10 border-4 border-red-500/30 flex items-center justify-center mx-auto">
                <Award className="w-10 h-10 text-red-400" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider">
                  Certificat Introuvable ou Révoqué
                </span>
                <h1 className="font-display text-2xl font-bold text-white mt-3">
                  Vérification Impossible
                </h1>
                <p className="text-white/50 text-sm mt-2">
                  Le numéro <span className="font-mono text-gold font-bold">{params.code}</span> n&apos;est pas reconnu dans notre registre officiel.
                </p>
              </div>
            </>
          )}

          <Link href="/" className="btn-outline-gold rounded-xl py-3 w-full justify-center inline-flex text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour au site principal
          </Link>
        </div>
      </div>
    </div>
  )
}
