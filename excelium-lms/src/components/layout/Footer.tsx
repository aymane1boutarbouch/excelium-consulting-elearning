import Link from 'next/link'
import { GraduationCap, Mail, Phone, MapPin, ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/10 text-white/70 text-xs">
      {/* Upper Footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Legal Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-serif font-bold text-white text-base leading-tight">
                  EXCELIUM CONSULTING COMPTA
                </div>
                <div className="text-[10px] text-gold tracking-widest font-mono uppercase">
                  CABINET DE CONSEIL & FORMATION CONTINUE
                </div>
              </div>
            </Link>

            <p className="text-white/60 text-xs leading-relaxed max-w-md">
              Organisme d&apos;accompagnement et de perfectionnement professionnel spécialisé en comptabilité française et marocaine, droit fiscal (CGI), gestion sociale CNSS et audit financier à Casablanca.
            </p>

            <div className="space-y-1.5 pt-2 text-[11px] text-white/50 font-mono">
              <div>Excelium Consulting Compta SARL AU — Capital Social : 100.000 DH</div>
              <div>I.F : 45892102 | I.C.E : 002891402000034 | R.C. Casablanca : 394201 | Patente : 34109825</div>
            </div>
          </div>

          {/* Practical Modules */}
          <div>
            <h4 className="font-serif font-semibold text-white text-sm mb-4 text-gold">
              Programmes Pratiques
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Liasse Fiscale & Passage Fiscal (IS/IR)', href: '/formations?cat=fiscalite' },
                { label: 'Comptabilité des Sociétés & PCM', href: '/formations?cat=comptabilite' },
                { label: 'Gestion de la Paie & SIMPL-CNSS', href: '/formations?cat=gestion' },
                { label: 'Audit & Contrôle Fiscal au Maroc', href: '/formations?cat=fiscalite' },
                { label: 'Excel Financier & Tableaux de Bord', href: '/formations?cat=bureautique' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-gold transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-gold/60" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Subscriptions */}
          <div>
            <h4 className="font-serif font-semibold text-white text-sm mb-4 text-gold">
              Contact & Secrétariat
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>142 Bd Abdelmoumen, Résidence Anfa, 4ème étage, Casablanca</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>+212 (0) 522 48 90 12 / +212 (0) 661 34 58 92</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span>contact@excelium.ma</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <a
                href="https://wa.me/212661345892"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 font-semibold hover:bg-emerald-600/30 transition-colors w-full justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                Assistance WhatsApp Directe
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-white/5 py-6">
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <div>
            © {new Date().getFullYear()} Excelium Consulting Compta. Tous droits réservés. Conformité Code Général des Impôts Marocain.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/certificats/verifier/EXC-DEMO" className="hover:text-gold transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Vérifier un Certificat
            </Link>
            <Link href="/contact" className="hover:text-gold transition-colors">Mentions Légales</Link>
            <Link href="/contact" className="hover:text-gold transition-colors">CGV & Réglement</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
