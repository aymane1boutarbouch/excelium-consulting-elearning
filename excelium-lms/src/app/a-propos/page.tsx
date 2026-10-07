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
    <div className="min-h-screen bg-ivory dark:bg-navy flex flex-col">
      <Navbar />

      <div className="bg-mesh pt-32 pb-16 px-4 relative overflow-hidden text-center">
        <div className="orb-gold w-96 h-96 top-0 left-1/4 opacity-20 absolute" />
        <div className="section-container relative z-10 max-w-3xl mx-auto">
          <span className="text-gold text-xs font-bold uppercase tracking-widest">Excelium Consulting Compta</span>
          <h1 className="font-display text-fluid-4xl font-bold text-white mt-2 mb-4">
            L&apos;Excellence en Conseil & Formation
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Cabinet de référence en comptabilité, fiscalité marocaine et gestion financière.
          </p>
        </div>
      </div>

      <div className="section-padding flex-1">
        <div className="section-container max-w-4xl space-y-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-fluid-3xl font-bold text-navy dark:text-white mb-4">
                Notre Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chez Excelium Consulting Compta, nous accompagnons les étudiants, les professionnels comptables et les dirigeants d&apos;entreprises au Maroc en leur fournissant des formations pratiques, concrètes et adaptées aux exigences de la réglementation nationale.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Notre objectif est de combler l&apos;écart entre la théorie académique et la réalité professionnelle du terrain.
              </p>
            </div>
            <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-gold/20 shadow-xl space-y-4">
              {[
                { title: 'Expertise Reconnue', desc: 'Des formations élaborées et animées par un expert-comptable expérimenté.' },
                { title: 'Pédagogie Pratique', desc: 'Cas réels d\'entreprises marocaines, déclarations fiscales et liasses comptables.' },
                { title: 'Certifications', desc: 'Certificats officiels authentifiés avec QR code de vérification.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-navy dark:text-white text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
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
