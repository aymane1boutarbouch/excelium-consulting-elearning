import React from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Contact — Excelium Consulting Compta',
  description: 'Contactez le cabinet Excelium Consulting Compta pour toute demande de renseignement ou d\'accompagnement.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-ivory dark:bg-navy flex flex-col">
      <Navbar />

      <div className="bg-mesh pt-32 pb-16 px-4 relative overflow-hidden text-center">
        <div className="orb-gold w-96 h-96 top-0 right-1/4 opacity-20 absolute" />
        <div className="section-container relative z-10 max-w-3xl mx-auto">
          <span className="text-gold text-xs font-bold uppercase tracking-widest">Besoin d&apos;aide ?</span>
          <h1 className="font-display text-fluid-4xl font-bold text-white mt-2 mb-4">
            Contactez Notre Équipe
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Nous sommes à votre disposition pour vous orienter vers la formation adaptée à vos objectifs.
          </p>
        </div>
      </div>

      <div className="section-padding flex-1">
        <div className="section-container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Direct Contact Info */}
            <div className="space-y-6">
              <h2 className="font-display text-fluid-2xl font-bold text-navy dark:text-white">
                Coordonnées du Cabinet
              </h2>
              <p className="text-muted-foreground text-sm">
                Retrouvez-nous à Casablanca ou contactez-nous directement sur WhatsApp pour une réponse rapide.
              </p>

              <div className="space-y-4">
                <div className="glass-card-light dark:glass-card p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="text-sm font-semibold text-navy dark:text-white">contact@excelium.ma</div>
                  </div>
                </div>

                <div className="glass-card-light dark:glass-card p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Téléphone</div>
                    <div className="text-sm font-semibold text-navy dark:text-white">+212 600 000 000</div>
                  </div>
                </div>

                <div className="glass-card-light dark:glass-card p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Adresse</div>
                    <div className="text-sm font-semibold text-navy dark:text-white">Casablanca, Maroc</div>
                  </div>
                </div>
              </div>

              {/* WhatsApp direct card */}
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center gap-4 hover:bg-green-500/20 transition-all block group"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center text-white shadow-lg">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-navy dark:text-white text-base">Discuter sur WhatsApp</div>
                  <div className="text-xs text-muted-foreground">Réponse directe sous 2 heures ouvrables</div>
                </div>
              </a>
            </div>

            {/* Contact Form */}
            <div className="glass-card-light dark:glass-card p-8 rounded-3xl border border-border shadow-xl space-y-4">
              <h3 className="font-display text-xl font-bold text-navy dark:text-white mb-2">
                Envoyez-nous un message
              </h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Nom complet</label>
                  <input
                    type="text"
                    required
                    placeholder="Votre nom"
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="votre@email.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-gold resize-none"
                  />
                </div>
                <button type="submit" className="btn-gold rounded-xl py-3 w-full justify-center inline-flex font-bold text-sm">
                  Envoyer le message <Send className="w-4 h-4 ml-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
