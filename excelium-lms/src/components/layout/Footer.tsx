import Link from 'next/link'
import { GraduationCap, Mail, Phone, MapPin, ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react'

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 1 0 0-3.06 1.53 1.53 0 0 0 0 3.06m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#F3EFE6] text-[#1E293B] border-t border-[#E7E2D6]">
      {/* Gold top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#C9A24B] via-[#E8D099] to-[#C9A24B]" />

      {/* Upper Footer */}
      <div className="section-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand column */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-11 h-11 rounded-xl bg-[#0A1F44] flex items-center justify-center text-[#C9A24B] group-hover:bg-[#C9A24B] group-hover:text-[#0A1F44] transition-all duration-300 shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-serif font-bold text-[#0A1F44] text-base leading-tight">
                  EXCELIUM CONSULTING COMPTA
                </div>
                <div className="text-[10px] text-[#C9A24B] tracking-[0.18em] font-mono uppercase mt-0.5">
                  CABINET DE CONSEIL & FORMATION CONTINUE
                </div>
              </div>
            </Link>

            <p className="text-[#475569] text-sm leading-relaxed max-w-sm">
              Organisme de perfectionnement professionnel spécialisé en comptabilité marocaine, droit fiscal CGI, gestion sociale CNSS et audit financier. Basé à Casablanca depuis 2007.
            </p>

            {/* Legal info */}
            <div className="space-y-1 text-[11px] text-[#64748B] font-mono border-t border-[#E7E2D6] pt-4">
              <div>Excelium Consulting Compta SARL AU — Capital : 100 000 DH</div>
              <div>I.F : 45892102 | I.C.E : 002891402000034 | R.C. Casablanca : 394201</div>
              <div>Patente : 34109825</div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { href: '#', Icon: LinkedinIcon, label: 'LinkedIn' },
                { href: '#', Icon: InstagramIcon, label: 'Instagram' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white border border-[#E7E2D6] flex items-center justify-center text-[#475569] hover:text-[#0A1F44] hover:border-[#C9A24B] hover:shadow-sm transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Modules column */}
          <div className="md:col-span-3">
            <h4 className="font-serif font-semibold text-[#0A1F44] text-base mb-5 pb-2 border-b border-[#E7E2D6]">
              Programmes Pratiques
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Liasse Fiscale & Passage Fiscal', href: '/formations?cat=fiscalite' },
                { label: 'Comptabilité des Sociétés PCM', href: '/formations?cat=comptabilite' },
                { label: 'Gestion de la Paie & SIMPL-CNSS', href: '/formations?cat=gestion' },
                { label: 'Audit & Contrôle Fiscal', href: '/formations?cat=fiscalite' },
                { label: 'Excel Financier & Tableaux de Bord', href: '/formations?cat=bureautique' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-sm text-[#475569] hover:text-[#0A1F44] hover:translate-x-1 transition-all group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-[#C9A24B] group-hover:text-[#0A1F44] flex-shrink-0 transition-colors" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="md:col-span-4">
            <h4 className="font-serif font-semibold text-[#0A1F44] text-base mb-5 pb-2 border-b border-[#E7E2D6]">
              Contact & Secrétariat
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C9A24B]/15 border border-[#C9A24B]/30 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#0A1F44]">
                  <MapPin className="w-4 h-4 text-[#C9A24B]" />
                </div>
                <span className="text-sm text-[#475569] leading-relaxed">
                  142 Bd Abdelmoumen, Résidence Anfa, 4ème étage<br />Casablanca 20050
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C9A24B]/15 border border-[#C9A24B]/30 flex items-center justify-center flex-shrink-0 text-[#0A1F44]">
                  <Phone className="w-4 h-4 text-[#C9A24B]" />
                </div>
                <span className="text-sm text-[#475569] font-mono">
                  +212 (0) 522 48 90 12<br />+212 (0) 661 34 58 92
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C9A24B]/15 border border-[#C9A24B]/30 flex items-center justify-center flex-shrink-0 text-[#0A1F44]">
                  <Mail className="w-4 h-4 text-[#C9A24B]" />
                </div>
                <a
                  href="mailto:contact@excelium.ma"
                  className="text-sm text-[#475569] hover:text-[#0A1F44] transition-colors"
                >
                  contact@excelium.ma
                </a>
              </div>
            </div>

            <a
              href="https://wa.me/212661345892"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2.5 w-full min-h-[48px] px-5 py-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-semibold hover:bg-emerald-100 hover:border-emerald-400 transition-all duration-200 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Assistance WhatsApp Directe
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E7E2D6] bg-[#FAF8F3]">
        <div className="section-container py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#64748B]">
            © {new Date().getFullYear()} Excelium Consulting Compta. Tous droits réservés.
            Conformité Code Général des Impôts Marocain.
          </div>
          <div className="flex items-center gap-5 text-xs text-[#64748B]">
            <Link
              href="/certificats/verifier/EXC-DEMO"
              className="hover:text-[#0A1F44] transition-colors flex items-center gap-1 font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-[#C9A24B]" />
              Vérifier un Certificat
            </Link>
            <Link href="/contact" className="hover:text-[#0A1F44] transition-colors font-medium">
              Mentions Légales
            </Link>
            <Link href="/contact" className="hover:text-[#0A1F44] transition-colors font-medium">
              CGV & Règlement
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
