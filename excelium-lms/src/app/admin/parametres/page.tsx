'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save, Building, CreditCard, Shield, Phone, Mail, Globe, Database, Key } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    firmName: 'EXCELIUM CONSULTING COMPTA SARL',
    ice: '002891402000034',
    ifCode: '45892102',
    rcCity: 'Casablanca',
    rcNumber: '394201',
    patente: '34109825',
    bankName: 'CIH Bank — Agence Abdelmoumen',
    bankRib: '230 780 0001234567890123 45',
    bankAccountName: 'EXCELIUM CONSULTING COMPTA SARL',
    bankIban: 'MA64 2307 8000 0123 4567 8901 2345',
    whatsappNumber: '+212661345892',
    supportEmail: 'contact@excelium.ma',
    currency: 'MAD',
  })

  const [saving, setSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success('Paramètres du cabinet et coordonnées bancaires sauvegardés !')
    }, 500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-display font-bold text-navy dark:text-white text-2xl">
          Paramètres Généraux du Cabinet &amp; Plateforme
        </h1>
        <p className="text-muted-foreground text-xs mt-1">
          Modifiez les identifiants fiscaux, les coordonnées bancaires pour les virements et le support WhatsApp
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Firm Identifiers */}
        <div className="glass-card-light dark:glass-card p-6 rounded-3xl border border-border space-y-4">
          <h2 className="font-display font-bold text-navy dark:text-white text-lg flex items-center gap-2">
            <Building className="w-5 h-5 text-gold" /> Identifiants Fiscaux &amp; Juridiques du Cabinet
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Raison Sociale</label>
              <input
                type="text"
                name="firmName"
                value={formData.firmName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">ICE (Identifiant Commun de l&apos;Entreprise)</label>
              <input
                type="text"
                name="ice"
                value={formData.ice}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Identifiant Fiscal (IF)</label>
              <input
                type="text"
                name="ifCode"
                value={formData.ifCode}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Registre du Commerce (RC)</label>
              <input
                type="text"
                name="rcNumber"
                value={formData.rcNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Bank Transfer Details */}
        <div className="glass-card-light dark:glass-card p-6 rounded-3xl border border-border space-y-4">
          <h2 className="font-display font-bold text-navy dark:text-white text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gold" /> Coordonnées Bancaires (Paiement par Virement)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Banque &amp; Agence</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Intitulé du Compte (Bénéficiaire)</label>
              <input
                type="text"
                name="bankAccountName"
                value={formData.bankAccountName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Relevé d&apos;Identité Bancaire (RIB — 24 chiffres)</label>
              <input
                type="text"
                name="bankRib"
                value={formData.bankRib}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm font-mono focus:outline-none text-gold font-bold"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Code IBAN International</label>
              <input
                type="text"
                name="bankIban"
                value={formData.bankIban}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact & Support */}
        <div className="glass-card-light dark:glass-card p-6 rounded-3xl border border-border space-y-4">
          <h2 className="font-display font-bold text-navy dark:text-white text-lg flex items-center gap-2">
            <Phone className="w-5 h-5 text-gold" /> Support &amp; Assistance WhatsApp
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Numéro WhatsApp Support</label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-navy dark:text-white mb-1">Email de Contact Client</label>
              <input
                type="email"
                name="supportEmail"
                value={formData.supportEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn-gold w-full py-4 rounded-2xl font-bold text-base shadow-gold inline-flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" /> Enregistrer les Paramètres
        </button>
      </form>
    </div>
  )
}
