'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Clock, Award, ArrowRight, Play, CheckCircle,
  FileText, ShieldCheck, ChevronDown, MessageCircle, Building2,
  BadgeCheck, FileSpreadsheet, Scale, ChevronRight, Star,
  TrendingUp, Users, Zap, MapPin, Phone, ExternalLink
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { cn } from '@/lib/utils'
import dynamic from 'next/dynamic'

const Hero3DWidgetDynamic = dynamic(
  () => import('@/components/layout/Hero3D').then(m => m.Hero3DWidget),
  { ssr: false, loading: () => <div className="w-full h-full bg-gradient-to-br from-[#F3EFE6] to-[#E8DFC8] rounded-2xl animate-pulse" /> }
)

const CinematicIntroDynamic = dynamic(
  () => import('@/components/layout/Hero3D').then(m => m.CinematicIntro),
  { ssr: false }
)

/* ── Data ──────────────────────────────────────────────────────────────── */

const stats = [
  { label: 'Financiers & Comptables Formés', value: 342, suffix: '+' },
  { label: 'Modules Conformes Loi de Finances 2026', value: 14, suffix: '' },
  { label: 'Taux de Validation aux Examens', value: 98.4, suffix: '%' },
  { label: 'Ans d\'expérience en conseil fiscal', value: 18, suffix: '' },
]

const programs = [
  {
    title: 'Pratique de la Liasse Fiscale Marocaine & Passages Fiscaux 2026',
    category: 'Fiscalité Marocaine',
    duration: '18 Heures',
    code: 'MOD-FISC-01',
    description: 'Déterminer le résultat fiscal à partir du résultat comptable. Réintégration des charges non déductibles, déduction des produits non imposables et télédéclaration SIMPL-IS.',
    level: 'Avancé',
    price: '1.490 MAD',
    href: '/formations/liasse-fiscale-marocaine',
    color: 'bg-blue-50',
    size: 'lg',
  },
  {
    title: 'Comptabilité Générale des Sociétés selon le PCM',
    category: 'Comptabilité',
    duration: '24 Heures',
    code: 'MOD-COMPTA-02',
    description: 'Enregistrement des opérations courantes et d\'inventaire. Amortissements, provisions, régularisations et clôture annuelle.',
    level: 'Intermédiaire',
    price: '1.250 MAD',
    href: '/formations/comptabilite-societes-pcm',
    color: 'bg-amber-50',
    size: 'sm',
  },
  {
    title: 'Gestion de la Paie, CNSS & Déclarations IR (SIMPL-Paie)',
    category: 'Gestion Sociale',
    duration: '14 Heures',
    code: 'MOD-PAIE-03',
    description: 'Calcul des bulletins de paie, cotisations CNSS, AMO, CIMR et télédéclaration IR annuel sur les plateformes officielles.',
    level: 'Pratique',
    price: '990 MAD',
    href: '/formations/gestion-paie-cnss-simpl',
    color: 'bg-emerald-50',
    size: 'sm',
  },
  {
    title: 'Audit Fiscal & Préparation au Contrôle de l\'Administration',
    category: 'Droit & Contentieux',
    duration: '16 Heures',
    code: 'MOD-AUDIT-04',
    description: 'Techniques d\'examen critique, détection des risques fiscaux, procédure contradictoire et rédaction des mémoires de réponse.',
    level: 'Expert',
    price: '1.850 MAD',
    href: '/formations/audit-fiscal-controle',
    color: 'bg-purple-50',
    size: 'lg',
  },
]

const steps = [
  { n: '01', title: 'Choisissez votre programme', desc: 'Parcourez notre catalogue de formations pratiques adaptées à votre niveau et vos objectifs professionnels.' },
  { n: '02', title: 'Inscrivez-vous en ligne', desc: 'Créez votre espace apprenant et finalisez votre inscription. Règlement par virement bancaire (CIH / Attijariwafa).' },
  { n: '03', title: 'Accédez aux contenus', desc: 'Cours vidéo HD, supports téléchargeables, quiz pratiques et exercices sur des cas d\'entreprises réels marocains.' },
  { n: '04', title: 'Obtenez votre certificat', desc: 'Validez votre formation et recevez votre certificat numérique authentifié avec QR Code vérifiable en ligne.' },
]

const testimonials = [
  {
    name: 'Mme Kenza Bennani',
    role: 'Responsable Financière',
    company: 'Groupe Industriel, Ain Sebaâ — Casablanca',
    content: 'La formation sur les passages fiscaux IS et la liasse 2026 est d\'une précision chirurgicale. Les cas pratiques tirés directement de bilans réels nous ont permis de sécuriser notre clôture annuelle sans risque.',
    rating: 5,
  },
  {
    name: 'M. Youssef El Mansouri',
    role: 'Chef Comptable en Cabinet Fiduciaire',
    company: 'Rabat Agdal',
    content: 'En tant que praticien, je cherchais un perfectionnement à jour avec la dernière Loi de Finances. M. El Amrani explique les arcanes du CGI avec la rigueur propre aux experts-comptables diplômés.',
    rating: 5,
  },
  {
    name: 'Mme Salma Berrada',
    role: 'Auditeure Senior',
    company: 'Technopark Casablanca',
    content: 'La maîtrise du module SIMPL-Paie et du calcul IR/CNSS a permis à notre cabinet d\'optimiser tous nos processus. Le support de cours téléchargeable est une vraie mine d\'or.',
    rating: 5,
  },
  {
    name: 'M. Hassan Alaoui',
    role: 'Directeur Administratif et Financier',
    company: 'PME Industrielle, Casablanca',
    content: 'Formation ultra-pratique avec des exercices sur des liasses fiscales réelles. J\'ai pu appliquer directement ce que j\'ai appris dans mon poste. Rapport qualité-prix excellent.',
    rating: 5,
  },
  {
    name: 'Mme Nadia Tazi',
    role: 'Expert-Comptable Stagiaire',
    company: 'Cabinet d\'Audit, Agdal Rabat',
    content: 'Les modules CNSS et paie m\'ont offert une vision globale que je n\'avais pas dans ma formation initiale. Le formateur est disponible et les réponses sont toujours précises.',
    rating: 5,
  },
]

const faqs = [
  {
    q: 'Comment s\'effectue l\'inscription et le règlement des frais de formation ?',
    a: 'Le règlement s\'effectue par virement bancaire vers notre compte professionnel (CIH Bank ou Attijariwafa Bank). Lors de votre inscription en ligne, une référence unique est générée. Dès le versement effectué et la pièce justificative transmise sur votre espace, votre accès aux cours et supports est validé sous 24 heures ouvrables.',
  },
  {
    q: 'Les attestations et certificats délivrés ont-ils une valeur officielle ?',
    a: 'Absolument. Chaque certificat délivré est numéroté, signé par l\'Expert-Comptable titulaire du cabinet et revêtu du sceau officiel. Il comporte un QR Code d\'authentification unique permettant aux employeurs et auditeurs de vérifier la validité de votre attestation en ligne.',
  },
  {
    q: 'Les formations sont-elles éligibles aux remboursements ou déductions fiscales ?',
    a: 'Oui, Excelium Consulting Compta étant un organisme de conseil et formation légalement constitué au Maroc (ICE : 002891402000034), nos factures sont comptabilisées en charges exploitables et déductibles du résultat fiscal de votre société (charges de formation continue).',
  },
  {
    q: 'Quelle est la durée d\'accès aux contenus et supports de cours ?',
    a: 'Vous bénéficiez d\'un accès continu de 12 à 24 mois selon le programme sélectionné, incluant l\'ensemble des mises à jour réglementaires apportées par la Loi de Finances en cours d\'année.',
  },
]

/* ── Animated counter hook ────────────────────────────────────────────── */
function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 2000
    const step = target / (duration / 16)
    let current = 0
    const interval = setInterval(() => {
      current = Math.min(current + step, target)
      setCurrent(parseFloat(current.toFixed(target % 1 !== 0 ? 1 : 0)))
      if (current >= target) clearInterval(interval)
    }, 16)
    return () => clearInterval(interval)
  }, [inView, target])

  return (
    <span ref={ref}>
      {current}{suffix}
    </span>
  )
}

/* ── Stagger reveal ───────────────────────────────────────────────────── */
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] },
  }),
}

/* ── Card tilt effect ─────────────────────────────────────────────────── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    ref.current.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(4px)`
  }

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
  }

  return (
    <div
      ref={ref}
      className={cn('transition-transform duration-200 ease-out', className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  )
}

/* ── Marquee ──────────────────────────────────────────────────────────── */
function TestimonialsMarquee() {
  return (
    <div className="overflow-hidden py-4">
      <div className="flex gap-6" style={{ animation: 'marqueeScroll 40s linear infinite', width: 'max-content' }}>
        {[...testimonials, ...testimonials].map((t, i) => (
          <div
            key={i}
            className="w-80 flex-shrink-0 card-white p-6 space-y-4"
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: t.rating }, (_, k) => (
                <Star key={k} className="w-3.5 h-3.5 fill-[#C9A24B] text-[#C9A24B]" />
              ))}
            </div>
            <p className="text-sm text-[#475569] leading-relaxed italic">
              &ldquo;{t.content}&rdquo;
            </p>
            <div className="border-t border-[#E7E2D6] pt-4">
              <div className="font-semibold text-[#0A1F44] text-sm">{t.name}</div>
              <div className="text-xs text-[#475569] mt-0.5">{t.role}</div>
              <div className="text-xs text-[#C9A24B]/80 font-mono mt-0.5">{t.company}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── FAQ Item ─────────────────────────────────────────────────────────── */
function FaqItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="card-white overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left p-6 flex items-start justify-between gap-4 font-semibold text-base text-[#0A1F44] hover:text-[#C9A24B] transition-colors"
        aria-expanded={isOpen}
      >
        <span className="leading-snug">{q}</span>
        <ChevronDown
          className={cn('w-5 h-5 text-[#C9A24B] flex-shrink-0 mt-0.5 transition-transform duration-300', isOpen && 'rotate-180')}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 text-[#475569] text-sm leading-relaxed border-t border-[#E7E2D6]">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Main Component ───────────────────────────────────────────────────── */

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showIntro, setShowIntro] = useState(false)
  const [introComplete, setIntroComplete] = useState(false)

  useEffect(() => {
    // Show intro only on first visit per session
    if (typeof window !== 'undefined') {
      const alreadySeen = sessionStorage.getItem('excelium-intro-seen')
      if (!alreadySeen) {
        setShowIntro(true)
      } else {
        setIntroComplete(true)
      }
    }
  }, [])

  const handleIntroComplete = () => {
    sessionStorage.setItem('excelium-intro-seen', 'true')
    setShowIntro(false)
    setIntroComplete(true)
  }

  const handleIntroSkip = () => {
    sessionStorage.setItem('excelium-intro-seen', 'true')
    setShowIntro(false)
    setIntroComplete(true)
  }

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Cinematic Intro */}
      {showIntro && (
        <CinematicIntroDynamic
          onComplete={handleIntroComplete}
          onSkip={handleIntroSkip}
        />
      )}

      <Navbar />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-[#FAF8F3]">
        {/* Background gold abstract decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-[#C9A24B]/5 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full bg-[#C9A24B]/5 blur-3xl" />
          {/* Abstract SVG lines */}
          <svg className="absolute top-20 right-0 w-1/2 h-full opacity-30" viewBox="0 0 600 800" fill="none" aria-hidden>
            <circle cx="500" cy="200" r="300" stroke="#C9A24B" strokeWidth="0.5" strokeDasharray="4 8" />
            <circle cx="500" cy="200" r="200" stroke="#C9A24B" strokeWidth="0.5" strokeDasharray="2 6" />
            <circle cx="500" cy="200" r="100" stroke="#C9A24B" strokeWidth="1" strokeOpacity="0.4" />
          </svg>
        </div>

        <div className="section-container relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div className="space-y-8 max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="section-label">
                  <Building2 className="w-3 h-3" />
                  Cabinet d&apos;Expertise & Formation — Casablanca
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-serif text-5xl md:text-6xl font-bold leading-[1.1] text-[#0A1F44]"
              >
                Pratique de la{' '}
                <span className="relative">
                  <span className="gold-underline revealed">Comptabilité</span>
                </span>
                {', '}du Droit{' '}
                <span className="text-gradient-gold">Fiscal</span>
                {' '}&amp; de la Paie au Maroc.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[#475569] text-lg leading-relaxed"
              >
                Programmes certifiants conçus par des professionnels du chiffre. Maîtrisez
                le Code Général des Impôts (CGI), la confection de la Liasse Fiscale et les
                déclarations électroniques SIMPL.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/formations" className="btn-gold text-base px-8 animate-pulse-gold">
                  Consulter le Catalogue
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link href="/a-propos" className="btn-outline-navy text-base px-8">
                  Présentation du Cabinet
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-[#475569] border-t border-[#E7E2D6]"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Conforme Loi de Finances 2026
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Attestations Authentifiées QR
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Factures Éligibles FPC
                </span>
              </motion.div>
            </div>

            {/* Right: 3D Widget + session card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* 3D Scene */}
              <div className="relative h-[420px] lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#F3EFE6] to-[#E8DFC8]">
                <Hero3DWidgetDynamic />

                {/* Floating label on 3D */}
                <div className="absolute bottom-4 left-4 glass-card px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A24B]/15 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-[#C9A24B]" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#0A1F44]">Taux de réussite</div>
                    <div className="text-xl font-bold text-[#C9A24B] font-mono">98.4%</div>
                  </div>
                </div>
              </div>

              {/* Session card (floats below) */}
              <div className="mt-4 card-white p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[#C9A24B] font-mono uppercase tracking-widest">Prochaine Session</div>
                    <div className="font-serif font-bold text-[#0A1F44] text-base">Liasse Fiscale & IS 2026</div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs">
                    Inscriptions Ouvertes
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    { label: 'Formateur', value: 'M. El Amrani (OEC)' },
                    { label: 'Volume', value: '18h de cas réels' },
                    { label: 'Supports', value: 'Matrice Excel + PDF' },
                    { label: 'Format', value: 'En Ligne & Sessions Live' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[#FAF8F3] rounded-lg p-2.5">
                      <div className="text-[#475569] mb-0.5">{label}</div>
                      <div className="font-semibold text-[#0A1F44]">{value}</div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/formations/liasse-fiscale-marocaine"
                  className="btn-gold w-full justify-center text-sm"
                >
                  Voir la fiche du programme
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR / STATS ──────────────────────────────────────────────── */}
      <section className="bg-[#F3EFE6] border-y border-[#E7E2D6] py-14 relative overflow-hidden">
        <div className="section-container relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((item, i) => (
              <motion.div
                key={item.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={fadeUpVariants}
                className="text-center md:text-left border-l-2 border-[#C9A24B] pl-4 md:pl-6"
              >
                <div className="font-serif font-bold text-4xl md:text-5xl text-[#0A1F44] font-mono">
                  <AnimatedNumber target={item.value} suffix={item.suffix} />
                </div>
                <div className="text-sm text-[#475569] font-medium mt-1.5 leading-snug">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAMS BENTO GRID ────────────────────────────────────────────── */}
      <section className="section-padding bg-[#FAF8F3]">
        <div className="section-container space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="section-label mb-3 inline-flex">Offre Académique Pratique</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0A1F44] mt-3 max-w-xl">
                Programmes de Perfectionnement Fisc & Compta
              </h2>
            </motion.div>
            <Link href="/formations" className="text-sm font-semibold text-[#C9A24B] hover:text-[#A0782E] inline-flex items-center gap-1.5 group flex-shrink-0">
              Explorer le catalogue complet
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Bento grid: 2 large + 2 small, alternating */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {programs.map((prog, i) => (
              <TiltCard
                key={prog.code}
                className={cn(
                  prog.size === 'lg' && i === 0 ? 'xl:col-span-2' : '',
                  prog.size === 'lg' && i === 3 ? 'xl:col-span-2' : ''
                )}
              >
                <motion.div
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-60px' }}
                  variants={fadeUpVariants}
                  className="card-white h-full flex flex-col p-6 md:p-7 space-y-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="section-label text-[0.65rem]">{prog.category}</span>
                    <span className="text-xs text-[#475569] font-mono">{prog.code} · {prog.duration}</span>
                  </div>

                  <h3 className="font-serif font-bold text-xl md:text-2xl text-[#0A1F44] leading-snug">
                    {prog.title}
                  </h3>

                  <p className="text-[#475569] text-sm leading-relaxed flex-1">
                    {prog.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#E7E2D6]">
                    <div>
                      <div className="text-[10px] text-[#475569] uppercase font-semibold tracking-wider">Tarif TTC</div>
                      <div className="font-serif font-bold text-2xl text-[#0A1F44] font-mono">{prog.price}</div>
                    </div>
                    <Link href={prog.href} className="btn-navy text-sm !h-11 px-5">
                      Voir la fiche
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="section-padding bg-[#F3EFE6] relative overflow-hidden">
        {/* Decorative abstract */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C9A24B]/6 blur-3xl pointer-events-none" />

        <div className="section-container space-y-14">
          <div className="text-center max-w-2xl mx-auto">
            <span className="section-label">Comment ça marche</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0A1F44] mt-4">
              4 Étapes Vers la Certification
            </h2>
            <p className="text-[#475569] text-lg mt-4">
              Un parcours clair, de l&apos;inscription à l&apos;obtention de votre certificat authentifié.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line (hidden on mobile) */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#C9A24B]/50 to-transparent" />

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-5">
              {steps.map((step, i) => (
                <motion.div
                  key={step.n}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUpVariants}
                  className="relative text-center"
                >
                  {/* Step number bubble */}
                  <div className="relative mx-auto w-20 h-20 rounded-2xl bg-white border border-[#E7E2D6] flex items-center justify-center shadow-sm mb-5">
                    <span className="font-serif font-bold text-3xl text-[#C9A24B] font-mono">{step.n}</span>
                    {i < steps.length - 1 && (
                      <div className="md:hidden absolute -right-3 top-1/2 -translate-y-1/2">
                        <ChevronRight className="w-4 h-4 text-[#C9A24B]/40" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#0A1F44] mb-3 leading-snug">{step.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRAINER SECTION ────────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: visual card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="card-ivory p-8 space-y-6 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-48 h-48 opacity-20">
                  <svg viewBox="0 0 200 200" fill="none" aria-hidden>
                    <circle cx="100" cy="100" r="90" stroke="#C9A24B" strokeWidth="1" strokeDasharray="3 6" />
                    <circle cx="100" cy="100" r="60" stroke="#C9A24B" strokeWidth="1" strokeDasharray="2 4" />
                  </svg>
                </div>

                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#C9A24B] to-[#A0782E] flex items-center justify-center text-white font-serif font-bold text-2xl flex-shrink-0 shadow-gold">
                    AE
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-[#0A1F44]">M. Abdellah El Amrani</h3>
                    <p className="text-sm text-[#C9A24B] font-mono mt-0.5">
                      Expert-Comptable DPLE — Membre OEC Maroc
                    </p>
                  </div>
                </div>

                <p className="text-[#475569] text-sm leading-relaxed relative z-10">
                  Fondateur et directeur d&apos;études d&apos;Excelium Consulting Compta. Plus de 18 ans
                  d&apos;expérience en direction financière, assistance lors de vérifications fiscales
                  et conseil fiscal auprès de groupes marocains et internationaux.
                </p>

                <div className="grid grid-cols-2 gap-3 relative z-10">
                  {[
                    { label: 'Années d\'exp.', value: '18+' },
                    { label: 'Dossiers suivis', value: '200+' },
                    { label: 'Apprenants formés', value: '342+' },
                    { label: 'Modules conformes LF', value: '14' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-xl p-3 text-center border border-[#E7E2D6]">
                      <div className="font-bold text-xl text-[#C9A24B] font-mono">{value}</div>
                      <div className="text-[11px] text-[#475569] mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: copy */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-6"
            >
              <span className="section-label">Corps Professoral & Direction</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0A1F44] leading-tight">
                Une Pédagogie Ancrée dans la Réalité des Pratiques Marocaines.
              </h2>
              <p className="text-[#475569] text-lg leading-relaxed">
                Nos cours ne s&apos;appuient pas sur des concepts théoriques abstraits. Chaque cas
                traité est issu directement d&apos;un dossier réel transmis aux administrations
                marocaines (Direction Générale des Impôts, CNSS, Office des Changes).
              </p>

              <div className="space-y-3.5 pt-2">
                {[
                  'Dépôt certifié des liasses fiscales selon le PCM',
                  'Maîtrise des télé-procédures administratives SIMPL',
                  'Préparation aux contrôles fiscaux sur place et sur pièces',
                  'Support individuel par la messagerie dédiée aux étudiants',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-[#1E293B]">
                    <div className="w-6 h-6 rounded-full bg-[#C9A24B]/10 border border-[#C9A24B]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#C9A24B]" />
                    </div>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/a-propos" className="btn-gold inline-flex text-sm">
                Présentation complète du cabinet
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS MARQUEE ───────────────────────────────────────────── */}
      <section className="section-padding bg-[#FAF8F3] overflow-hidden">
        <div className="section-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="section-label">Retour d&apos;Expérience Praticiens</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0A1F44] mt-4">
              Témoignages de nos Apprenants
            </h2>
          </div>
        </div>
        <TestimonialsMarquee />
      </section>

      {/* ── CERTIFICATE 3D FLIP SECTION ────────────────────────────────────── */}
      <section className="section-padding bg-[#F3EFE6]">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Certificate preview */}
            <motion.div
              initial={{ opacity: 0, rotateY: -20 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="perspective"
            >
              <div className="preserve-3d hover:rotate-y-6 transition-transform duration-500">
                <div className="bg-white rounded-2xl border-2 border-[#C9A24B]/40 p-8 shadow-gold relative overflow-hidden">
                  {/* Gold corner decorations */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#C9A24B]/60 rounded-tl-sm" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#C9A24B]/60 rounded-tr-sm" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#C9A24B]/60 rounded-bl-sm" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#C9A24B]/60 rounded-br-sm" />

                  <div className="text-center space-y-4 py-4">
                    <div className="text-xs font-mono tracking-widest text-[#475569] uppercase">Excelium Consulting Compta</div>
                    <div className="text-xs text-[#C9A24B] font-mono tracking-wider">CABINET DE CONSEIL & FORMATION CONTINUE</div>

                    <div className="font-serif text-2xl font-bold text-[#0A1F44] leading-tight">
                      Attestation de Formation Professionnelle
                    </div>

                    <div className="space-y-1">
                      <div className="text-[#475569] text-sm">Délivrée à</div>
                      <div className="font-serif font-bold text-xl text-[#0A1F44]">Mme Kenza Bennani</div>
                    </div>

                    <div className="bg-[#FAF8F3] rounded-xl p-4 border border-[#E7E2D6]">
                      <div className="text-xs text-[#475569] mb-1">Formation suivie & validée</div>
                      <div className="font-semibold text-sm text-[#0A1F44]">
                        Pratique de la Liasse Fiscale Marocaine & Passages Fiscaux 2026
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#E7E2D6]">
                      <div className="text-left">
                        <div className="text-xs text-[#475569]">Référence</div>
                        <div className="font-mono font-bold text-sm text-[#C9A24B]">EXC-2026-001</div>
                      </div>
                      <div className="w-16 h-16 bg-[#0A1F44] rounded-lg flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-[#C9A24B]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Copy */}
            <div className="space-y-6">
              <span className="section-label">Certification Authentifiée</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0A1F44]">
                Des Certificats Vérifiables & Reconnus par les Employeurs
              </h2>
              <p className="text-[#475569] text-lg leading-relaxed">
                Chaque attestation est numérotée, signée par l&apos;Expert-Comptable titulaire
                et revêtue du sceau officiel. Le QR Code intégré permet une vérification
                instantanée en ligne par n&apos;importe quel employeur ou auditeur.
              </p>
              <div className="space-y-3">
                {[
                  'Numérotation sécurisée unique par certificat',
                  'QR Code de vérification authentifiée en ligne',
                  'Signature de l\'Expert-Comptable DPLE Membre OEC',
                  'Valeur reconnue auprès des DRH et cabinets d\'audit',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-[#1E293B]">
                    <ShieldCheck className="w-4 h-4 text-[#C9A24B] flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/certificats/verifier/EXC-DEMO" className="btn-outline-navy inline-flex text-sm">
                Vérifier un certificat exemple
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="section-container max-w-3xl">
          <div className="text-center mb-12">
            <span className="section-label">Informations Pratiques</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0A1F44] mt-4">
              Foire Aux Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <FaqItem
                key={idx}
                q={faq.q}
                a={faq.a}
                isOpen={openFaq === idx}
                onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#FAF8F3] relative overflow-hidden">
        {/* Decorative dots grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #C9A24B 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="section-container max-w-4xl text-center relative z-10 space-y-8">
          <span className="section-label">Passez à l&apos;action</span>
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-[#0A1F44] leading-tight">
            Renforcez vos Compétences
            <span className="block text-gradient-gold">Fisc & Compta dès Aujourd&apos;hui.</span>
          </h2>
          <p className="text-[#475569] text-xl leading-relaxed max-w-2xl mx-auto">
            Consultez le programme détaillé de nos sessions pratiques ou échangez directement
            avec notre secrétariat à Casablanca.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link href="/formations" className="btn-gold text-base px-10">
              Découvrir les Formations Ouvertes
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="https://wa.me/212661345892"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-navy text-base px-10"
            >
              <MessageCircle className="w-5 h-5" />
              Secrétariat WhatsApp
            </a>
          </div>

          {/* Contact info strip */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-6 border-t border-[#E7E2D6] text-sm text-[#475569]">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C9A24B]" />
              +212 (0) 522 48 90 12
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C9A24B]" />
              142 Bd Abdelmoumen, Casablanca
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
