'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, Clock, Award, ArrowRight, Play, CheckCircle,
  FileText, ShieldCheck, ChevronDown, MessageCircle, Building2,
  BadgeCheck, FileSpreadsheet, Scale, ChevronRight
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { cn } from '@/lib/utils'

// Realistic stats
const stats = [
  { label: 'Financiers & Comptables Formés', value: '342' },
  { label: 'Modules Conformés Loi de Finances 2026', value: '14' },
  { label: 'Taux de Validation aux Examens', value: '98.4%' },
  { label: 'Dossiers Pratiques d\'Entreprises', value: '100%' },
]

// Practical Moroccan modules
const flagshipModules = [
  {
    title: 'Pratique de la Liasse Fiscale Marocaine & Passages Fiscaux 2026',
    category: 'Fiscalité Marocaine',
    duration: '18 Heures',
    code: 'MOD-FISC-01',
    description: 'Déterminer le résultat fiscal à partir du résultat comptable. Réintégration des charges non déductibles, déduction des produits non imposables et télédéclaration SIMPL-IS.',
    level: 'Avancé',
    price: '1.490 MAD',
    href: '/formations/liasse-fiscale-marocaine',
  },
  {
    title: 'Comptabilité Générale des Sociétés selon le Plan Comptable Marocain (PCM)',
    category: 'Comptabilité',
    duration: '24 Heures',
    code: 'MOD-COMPTA-02',
    description: 'Enregistrement des opérations courantes et d\'inventaire. Amortissements, provisions, régularisations de charges et clôture annuelle des comptes.',
    level: 'Intermédiaire',
    price: '1.250 MAD',
    href: '/formations/comptabilite-societes-pcm',
  },
  {
    title: 'Gestion de la Paie, CNSS & Déclarations Annuelles IR (SIMPL-Paie)',
    category: 'Gestion Sociale',
    duration: '14 Heures',
    code: 'MOD-PAIE-03',
    description: 'Calcul des bulletins de paie, traitement des cotisations CNSS, AMO, CIMR et télédéclaration IR annuel (état 9421) sur les plateformes officielles.',
    level: 'Pratique',
    price: '990 MAD',
    href: '/formations/gestion-paie-cnss-simpl',
  },
  {
    title: 'Audit Fiscal & Préparation au Contrôle de l\'Administration (CLT/CNRF)',
    category: 'Droit & Contentieux',
    duration: '16 Heures',
    code: 'MOD-AUDIT-04',
    description: 'Techniques d\'examen critique de la comptabilité, détection des risques fiscaux majeurs, procédure contradictoire et rédaction des mémoires de réponse.',
    level: 'Expert',
    price: '1.850 MAD',
    href: '/formations/audit-fiscal-controle',
  },
]

// Authentic Moroccan testimonials
const testimonials = [
  {
    name: 'Mme Kenza Bennani',
    role: 'Responsable Financière, Groupe Industriel — Ain Sebaâ, Casablanca',
    content: 'La formation sur les passages fiscaux IS et la liasse 2026 est d\'une précision chirurgicale. Les cas pratiques tirés directement de bilans réels nous ont permis de sécuriser notre clôture annuelle sans risque d\'imposition arbitraire.',
  },
  {
    name: 'M. Youssef El Mansouri',
    role: 'Chef Comptable en Cabinet Fiduciaire — Rabat Agdal',
    content: 'En tant que praticien, je cherchais un perfectionnement à jour avec la dernière Loi de Finances. M. El Amrani explique les arcanes du Code Général des Impôts avec la rigueur propre aux experts-comptables diplômés.',
  },
  {
    name: 'Mme Salma Berrada',
    role: 'Auditeure Senior — Technopark Casablanca',
    content: 'La maîtrise du module SIMPL-Paie et du calcul IR/CNSS a permis à notre cabinet d\'optimiser tous nos processus de traitement mensuel. Le support de cours téléchargeable est une vraie mine d\'or.',
  },
]

// Realistic FAQs
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

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-ivory dark:bg-navy font-sans text-navy dark:text-white selection:bg-gold/30">
      <Navbar />

      {/* ── HERO SECTION (Editorial Asymmetric Layout) ────────────────────── */}
      <section className="pt-32 pb-20 border-b border-border bg-navy text-white relative overflow-hidden">
        <div className="section-container relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left 7 cols: Editorial Header & Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-mono font-semibold">
                <Building2 className="w-3.5 h-3.5" /> Cabinet d&apos;Expertise & Formation — Casablanca
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white">
                Pratique de la <span className="text-gold underline decoration-gold/40 underline-offset-8">Comptabilité</span>, du Droit Fiscal & de la Paie au Maroc.
              </h1>

              <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
                Programmes certifiants conçus par des professionnels du chiffre. Maîtrisez le Code Général des Impôts (CGI), la confection de la Liasse Fiscale et les déclarations électroniques SIMPL.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <Link href="/formations" className="btn-gold text-sm px-6 py-3.5 font-bold">
                  Consulter le Catalogue des Formations <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link href="/a-propos" className="btn-outline-gold text-sm px-6 py-3.5">
                  Présentation du Cabinet
                </Link>
              </div>

              <div className="pt-6 flex items-center gap-6 text-xs text-white/50 border-t border-white/10 font-mono">
                <span>✓ Conforme Loi de Finances 2026</span>
                <span>✓ Attestations Authentifiées QR</span>
                <span>✓ Factures Éligibles FPC</span>
              </div>
            </div>

            {/* Right 5 cols: Structured Asymmetric Panel */}
            <div className="lg:col-span-5">
              <div className="bg-navy-light border border-white/15 rounded-2xl p-6 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <div className="text-xs text-gold font-mono uppercase">Prochaine Session Pratique</div>
                    <div className="font-serif font-bold text-white text-lg">Liasse Fiscale & IS 2026</div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald/20 border border-emerald/40 text-emerald-300 font-mono text-[11px]">
                    Inscriptions Ouvertes
                  </span>
                </div>

                <div className="space-y-3 text-xs text-white/80">
                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-white/50">Formateur référent</span>
                    <span className="font-semibold text-white">M. Abdellah El Amrani (OEC)</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-white/50">Volume horaire</span>
                    <span className="font-mono text-white">18 Heures de cas réels</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                    <span className="text-white/50">Supports transmis</span>
                    <span className="text-white">Matrice Excel + Guides PDF</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-white/50">Lieu / Format</span>
                    <span className="text-gold font-semibold">En Ligne & Sessions Directes</span>
                  </div>
                </div>

                <Link
                  href="/formations/liasse-fiscale-marocaine"
                  className="btn-gold w-full text-xs py-3 justify-center text-navy font-bold uppercase tracking-wider"
                >
                  Voir la fiche du programme
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── METRICS STRIP ─────────────────────────────────────────────────── */}
      <section className="bg-ivory dark:bg-navy-900 border-b border-border py-10">
        <div className="section-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((item) => (
              <div key={item.label} className="border-l-2 border-gold pl-4">
                <div className="font-serif font-bold text-3xl md:text-4xl text-navy dark:text-white font-mono">
                  {item.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1 font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLAGSHIP MODULES (Asymmetric Grid Layout) ────────────────────── */}
      <section className="section-padding bg-ivory dark:bg-navy">
        <div className="section-container space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
            <div>
              <span className="text-gold text-xs font-mono uppercase tracking-widest">Offre Académique Pratique</span>
              <h2 className="font-serif text-3xl font-bold text-navy dark:text-white mt-1">
                Programmes de Perfectionnement Fisc & Compta
              </h2>
            </div>
            <Link href="/formations" className="text-xs font-semibold text-gold hover:underline inline-flex items-center gap-1">
              Explorer l&apos;ensemble du catalogue <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {flagshipModules.map((module) => (
              <div key={module.code} className="editorial-card flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded bg-navy/5 dark:bg-white/5 text-gold font-mono font-semibold">
                      {module.category}
                    </span>
                    <span className="text-muted-foreground font-mono">{module.code} • {module.duration}</span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-navy dark:text-white leading-snug">
                    {module.title}
                  </h3>

                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {module.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-semibold">Tarif TTC</div>
                    <div className="font-serif font-bold text-lg text-navy dark:text-gold font-mono">
                      {module.price}
                    </div>
                  </div>

                  <Link href={module.href} className="btn-navy text-xs px-4 py-2">
                    Fiche du programme <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRAINER CREDENTIALS (Human Agency Style) ──────────────────────── */}
      <section className="section-padding bg-navy text-white border-t border-b border-white/10">
        <div className="section-container">
          <div className="grid md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-5">
              <div className="p-8 rounded-2xl bg-navy-light border border-white/15 space-y-4 shadow-xl">
                <div className="w-16 h-16 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-serif font-bold text-2xl">
                  AE
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">M. Abdellah El Amrani</h3>
                  <p className="text-xs text-gold font-mono mt-0.5">
                    Expert-Comptable DPLE — Membre OEC Maroc
                  </p>
                </div>
                <p className="text-white/70 text-xs leading-relaxed">
                  Fondateur et directeur d&apos;études d&apos;Excelium Consulting Compta. Plus de 18 ans d&apos;expérience en direction financière, assistance lors de vérifications fiscales et conseil fiscal auprès de groupes marocains et internationaux.
                </p>
              </div>
            </div>

            <div className="md:col-span-7 space-y-6">
              <span className="text-gold text-xs font-mono uppercase tracking-widest">Corps Professoral & Direction</span>
              <h2 className="font-serif text-3xl font-bold text-white">
                Une Pédagogie Ancrée dans la Réalité des Pratiques Marocaines.
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Nos cours ne s&apos;appuient pas sur des concepts théoriques abstraits. Chaque cas traité est issu directement d&apos;un dossier réel transmis aux administrations marocaines (Direction Générale des Impôts, CNSS, Office des Changes).
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'Dépôt certifié des liasses fiscales selon le PCM',
                  'Maîtrise des télé-procédures administratives SIMPL',
                  'Préparation aux contrôles fiscaux sur place et sur pièces',
                  'Support individuel par la messagerie dédiée aux étudiants',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-xs text-white/90">
                    <BadgeCheck className="w-4 h-4 text-gold flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (Realistic Professionals) ──────────────────────── */}
      <section className="section-padding bg-ivory dark:bg-navy">
        <div className="section-container space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-gold text-xs font-mono uppercase tracking-widest">Retour d&apos;Expérience Praticiens</span>
            <h2 className="font-serif text-3xl font-bold text-navy dark:text-white">
              Témoignages de nos Apprenants & Clients
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="editorial-card flex flex-col justify-between space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="pt-4 border-t border-border">
                  <div className="font-semibold text-navy dark:text-white text-xs">{t.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ (Moroccan Context) ────────────────────────────────────────── */}
      <section className="section-padding bg-white dark:bg-navy-900 border-t border-border">
        <div className="section-container max-w-3xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-gold text-xs font-mono uppercase tracking-widest">Informations Pratiques</span>
            <h2 className="font-serif text-3xl font-bold text-navy dark:text-white">
              Foire Aux Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-border rounded-xl overflow-hidden bg-card">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-sm text-navy dark:text-white hover:text-gold transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform', openFaq === idx && 'rotate-180 text-gold')} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-navy text-white text-center border-t border-white/10">
        <div className="section-container max-w-3xl space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
            Renforcez vos Compétences Fisc & Compta dès Aujourd&apos;hui.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-xl mx-auto">
            Consultez le programme détaillé de nos sessions pratiques ou échangez directement avec notre secrétariat à Casablanca.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/formations" className="btn-gold text-xs px-8 py-3.5 font-bold uppercase tracking-wider">
              Découvrir les Formations Ouvertes
            </Link>
            <a
              href="https://wa.me/212661345892"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold text-xs px-8 py-3.5 inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Secrétariat WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
