import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { GraduationCap, Award, ShieldCheck, Users, BookOpen, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'À Propos — Excelium Consulting Compta',
  description: 'Découvrez l\'histoire et l\'expertise du cabinet Excelium Consulting Compta au Maroc.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col">
      <Navbar />

      <div className="bg-[#F3EFE6] border-b border-[#E7E2D6] pt-32 pb-16 px-4 relative overflow-hidden text-center">
        <div className="section-container relative z-10 max-w-3xl mx-auto">
          <span className="text-[#C9A24B] text-xs font-bold uppercase tracking-widest">Excelium Consulting Compta</span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#0A1F44] mt-2 mb-4">
            L&apos;Excellence en Conseil & Formation
          </h1>
          <p className="text-[#475569] text-lg leading-relaxed">
            Cabinet de référence en comptabilité, fiscalité marocaine et gestion financière.
          </p>
        </div>
      </div>

      <div className="py-20 flex-1">
        <div className="section-container max-w-4xl space-y-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0A1F44] mb-4">
                Notre Mission
              </h2>
              <p className="text-[#1E293B] text-[17px] leading-[1.7] mb-4">
                Chez Excelium Consulting Compta, nous accompagnons les étudiants, les professionnels comptables et les dirigeants d&apos;entreprises au Maroc en leur fournissant des formations pratiques, concrètes et adaptées aux exigences de la réglementation nationale.
              </p>
              <p className="text-[#475569] text-[17px] leading-[1.7]">
                Notre objectif est de combler l&apos;écart entre la théorie académique et la réalité professionnelle du terrain.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-[#E7E2D6] shadow-sm space-y-5">
              {[
                { title: 'Expertise Reconnue', desc: 'Des formations élaborées et animées par un expert-comptable expérimenté.' },
                { title: 'Pédagogie Pratique', desc: 'Cas réels d\'entreprises marocaines, déclarations fiscales et liasses comptables.' },
                { title: 'Certifications', desc: 'Certificats officiels authentifiés avec QR code de vérification.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-[#C9A24B] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-[#0A1F44] text-base">{item.title}</h3>
                    <p className="text-sm text-[#475569] mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
