import React from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { ContactForm } from '@/components/contact/ContactForm'

export const metadata = {
  title: 'Contact — Excelium Consulting Compta',
  description: 'Contactez le cabinet Excelium Consulting Compta pour toute demande de renseignement ou d\'accompagnement en formation comptable et fiscale.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3] flex flex-col">
      <Navbar />

      {/* Header section */}
      <div className="bg-[#F3EFE6] border-b border-[#E7E2D6] pt-32 pb-16 px-4 relative overflow-hidden text-center">
        <div className="section-container relative z-10 max-w-3xl mx-auto">
          <span className="text-[#C9A24B] text-xs font-bold uppercase tracking-widest">
            Conseil & Assistance Pédagogique
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#0A1F44] mt-2 mb-4">
            Contactez Notre Cabinet
          </h1>
          <p className="text-[#475569] text-lg leading-relaxed">
            Notre équipe d&apos;experts est à votre disposition pour vous orienter vers le programme adapté à votre profil professionnel.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="py-20 flex-1">
        <div className="section-container max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Direct Contact Info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0A1F44] mb-3">
                  Coordonnées du Cabinet
                </h2>
                <p className="text-[#475569] text-base leading-relaxed">
                  Basé à Casablanca, Excelium Consulting Compta répond à toutes vos questions relatives aux programmes de formation, aux modalités de financement et aux inscriptions.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E7E2D6] shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#C9A24B]/15 border border-[#C9A24B]/30 flex items-center justify-center text-[#C9A24B]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[#475569] font-medium">Email professionnel</div>
                    <a href="mailto:contact@excelium.ma" className="text-base font-semibold text-[#0A1F44] hover:text-[#C9A24B] transition-colors">
                      contact@excelium.ma
                    </a>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E7E2D6] shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#C9A24B]/15 border border-[#C9A24B]/30 flex items-center justify-center text-[#C9A24B]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[#475569] font-medium">Ligne directe</div>
                    <a href="tel:+212522000000" className="text-base font-semibold text-[#0A1F44] hover:text-[#C9A24B] transition-colors">
                      +212 (0) 5 22 00 00 00
                    </a>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E7E2D6] shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#C9A24B]/15 border border-[#C9A24B]/30 flex items-center justify-center text-[#C9A24B]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-[#475569] font-medium">Siège & Centre de formation</div>
                    <div className="text-base font-semibold text-[#0A1F44]">
                      Boulevard d&apos;Anfa, Casablanca, Maroc
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct card */}
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-4 hover:bg-emerald-100/60 transition-all block group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-[#0A1F44] text-base group-hover:text-emerald-800 transition-colors">
                    Assistance WhatsApp en direct
                  </div>
                  <div className="text-xs text-[#475569]">Réponse immédiate sous 2 heures ouvrables</div>
                </div>
              </a>
            </div>

            {/* Contact Form component */}
            <ContactForm />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
