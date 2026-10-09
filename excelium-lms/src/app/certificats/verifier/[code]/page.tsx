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
    <div className="min-h-screen bg-[#FAF8F3] flex items-center justify-center p-4 relative overflow-hidden py-12">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#C9A24B]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#C9A24B]/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0A1F44] flex items-center justify-center shadow-sm">
              <GraduationCap className="w-6 h-6 text-[#C9A24B]" />
            </div>
            <div className="text-left">
              <div className="font-serif font-bold text-[#0A1F44] text-base leading-none">EXCELIUM</div>
              <div className="text-[#C9A24B] text-[10px] tracking-widest font-mono uppercase mt-0.5">
                CONSULTING COMPTA
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white border border-[#E7E2D6] p-8 md:p-10 rounded-3xl text-center space-y-6 shadow-sm">
          {isValid ? (
            <>
              <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-700">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  Certificat Authentique & Valide
                </span>
                <h1 className="font-serif text-2xl font-bold text-[#0A1F44] mt-3">
                  Certificat Officiel de Formation
                </h1>
                <p className="text-[#475569] text-sm mt-1">
                  Délivré par le cabinet Excelium Consulting Compta (Casablanca)
                </p>
              </div>

              <div className="bg-[#FAF8F3] p-5 rounded-2xl text-left space-y-3.5 border border-[#E7E2D6]">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#475569]">Numéro d&apos;attestation</span>
                  <span className="font-mono text-[#0A1F44] font-bold bg-white px-2.5 py-1 rounded border border-[#E7E2D6]">
                    {cert.certificate_number}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#475569]">Titulaire certifié</span>
                  <span className="font-semibold text-[#0A1F44]">{cert.profiles?.full_name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#475569]">Programme suivi</span>
                  <span className="font-semibold text-[#0A1F44] text-right max-w-[65%]">{cert.courses?.title}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#475569]">Volume horaire</span>
                  <span className="font-mono font-medium text-[#0A1F44]">{cert.courses?.duration_hours} heures</span>
                </div>
                <div className="flex justify-between text-xs border-t border-[#E7E2D6] pt-3">
                  <span className="text-[#475569]">Date d&apos;émission</span>
                  <span className="text-[#0A1F44] font-medium">
                    {format(new Date(cert.issued_at), 'd MMMM yyyy', { locale: fr })}
                  </span>
                </div>
              </div>

              <p className="text-[#64748B] text-xs leading-relaxed">
                Ce document officiel atteste que le titulaire a suivi et validé avec succès l&apos;ensemble des exigences académiques et pratiques du programme de formation.
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-red-100 border border-red-300 flex items-center justify-center mx-auto text-red-600">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
                  Certificat Introuvable ou Révoqué
                </span>
                <h1 className="font-serif text-2xl font-bold text-[#0A1F44] mt-3">
                  Vérification Impossible
                </h1>
                <p className="text-[#475569] text-sm mt-2">
                  La référence <span className="font-mono text-[#0A1F44] font-bold bg-[#FAF8F3] px-2 py-0.5 rounded border border-[#E7E2D6]">{params.code}</span> n&apos;est pas reconnue dans notre registre officiel.
                </p>
              </div>
            </>
          )}

          <Link
            href="/"
            className="w-full min-h-[48px] py-3.5 px-6 rounded-xl bg-[#0A1F44] hover:bg-[#081836] text-white font-semibold text-sm transition-all justify-center inline-flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#C9A24B]" /> Retour à la plateforme
          </Link>
        </div>
      </div>
    </div>
  )
}
