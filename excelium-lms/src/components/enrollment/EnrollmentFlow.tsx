'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Upload, CheckCircle, Copy, AlertCircle,
  FileImage, FileText, X, Loader2, CreditCard, Info
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency, generateReferenceCode } from '@/lib/utils'
import type { Course } from '@/types/database'

interface Props {
  course: Course
  userId: string
  existingEnrollment?: any
}

type Step = 'details' | 'payment' | 'upload' | 'success'

export default function EnrollmentFlow({ course, userId, existingEnrollment }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<Step>(existingEnrollment ? 'success' : 'details')
  const [loading, setLoading] = useState(false)
  const [enrollmentId, setEnrollmentId] = useState<string>(existingEnrollment?.id || '')
  const [referenceCode, setReferenceCode] = useState<string>(existingEnrollment?.reference_code || '')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  // Bank details from env
  const bankDetails = {
    bank: process.env.NEXT_PUBLIC_BANK_NAME || 'CIH Bank',
    rib: process.env.NEXT_PUBLIC_BANK_RIB || '00000 00000 000000000000 00',
    accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || 'EXCELIUM CONSULTING COMPTA',
    iban: process.env.NEXT_PUBLIC_BANK_ACCOUNT_IBAN || 'MA64 0000 0000 0000 0000 0000 00',
  }

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
    toast.success('Copié !')
  }

  // Step 1 → 2: Create enrollment and payment record
  const handleStartEnrollment = async () => {
    setLoading(true)
    try {
      const refCode = generateReferenceCode()
      setReferenceCode(refCode)

      // Create enrollment
      const { data: enrollment, error: enrollError } = await (supabase as any)
        .from('enrollments')
        .insert({
          student_id: userId,
          course_id: course.id,
          status: 'pending',
          reference_code: refCode,
        })
        .select()
        .single()

      if (enrollError) {
        if (enrollError.code === '23505') {
          toast.error('Vous êtes déjà inscrit à cette formation')
          return
        }
        throw enrollError
      }

      setEnrollmentId((enrollment as any).id)

      // Create payment record
      await (supabase as any).from('payments').insert({
        enrollment_id: (enrollment as any).id,
        student_id: userId,
        course_id: course.id,
        amount: course.price,
        currency: course.currency,
        reference_code: refCode,
        status: 'pending',
      })

      setStep('payment')
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  // File drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Fichier trop volumineux (max 10 Mo)')
        return
      }
      setProofFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
  })

  // Step 3: Upload payment proof
  const handleUploadProof = async () => {
    if (!proofFile) {
      toast.error('Veuillez sélectionner un fichier')
      return
    }
    setUploading(true)
    try {
      const fileExt = proofFile.name.split('.').pop()
      const filePath = `payment-proofs/${enrollmentId}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(filePath, proofFile, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      // Update payment record
      await (supabase as any)
        .from('payments')
        .update({
          proof_file_path: filePath,
          proof_file_name: proofFile.name,
        })
        .eq('enrollment_id', enrollmentId)

      setStep('success')
      toast.success('Preuve de paiement envoyée ! Nous la vérifierons sous 24h.')
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'envoi du fichier')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress steps */}
      {step !== 'success' && (
        <div className="flex items-center gap-2 mb-8">
          {(['details', 'payment', 'upload'] as Step[]).map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
                s === step ? 'bg-gold text-navy' :
                ((['payment', 'upload'] as string[]).indexOf(step as string) > i || (step as string) === 'success') ? 'bg-emerald text-white' :
                'bg-muted text-muted-foreground'
              }`}>
                {((['payment', 'upload'] as string[]).indexOf(step as string) > i || (step as string) === 'success') ? '✓' : i + 1}
              </div>
              {i < 2 && <div className={`flex-1 h-0.5 transition-all ${
                ((['payment', 'upload'] as string[]).indexOf(step as string) > i) ? 'bg-emerald' : 'bg-muted'
              }`} />}
            </React.Fragment>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ── Step 1: Course details ─────────────────────── */}
        {step === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display text-xl font-bold text-navy dark:text-white mb-1">
                Récapitulatif de commande
              </h3>
              <p className="text-muted-foreground text-sm">Vérifiez les détails avant de procéder au paiement</p>
            </div>

            <div className="glass-card-light dark:glass-card p-5 rounded-2xl space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Formation</span>
                <span className="font-semibold text-navy dark:text-white text-right max-w-[60%]">{course.title}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Durée</span>
                <span className="font-mono text-navy dark:text-white">{course.duration_hours}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Niveau</span>
                <span className="text-navy dark:text-white">
                  {course.level === 'debutant' ? 'Débutant' : course.level === 'intermediaire' ? 'Intermédiaire' : 'Avancé'}
                </span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-navy dark:text-white">Total à payer</span>
                <span className="font-display text-xl font-bold text-gold">
                  {formatCurrency(course.price, course.currency)}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Paiement par virement bancaire</p>
                <p className="text-blue-500/80 text-xs">
                  Après validation, vous recevrez un code de référence unique pour effectuer le virement.
                  L&apos;accès est activé sous 24h après vérification de votre paiement.
                </p>
              </div>
            </div>

            <button
              onClick={handleStartEnrollment}
              disabled={loading}
              className="w-full btn-gold rounded-xl py-4 text-base"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (
                <>Procéder à l&apos;inscription <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </motion.div>
        )}

        {/* ── Step 2: Bank transfer details ─────────────── */}
        {step === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display text-xl font-bold text-navy dark:text-white mb-1">
                Coordonnées bancaires
              </h3>
              <p className="text-muted-foreground text-sm">
                Effectuez un virement vers le compte suivant, puis téléchargez votre reçu.
              </p>
            </div>

            {/* Bank details card */}
            <div className="glass-card-light dark:glass-card p-6 rounded-2xl space-y-4 border border-gold/20">
              {[
                { label: 'Banque', value: bankDetails.bank, key: 'bank' },
                { label: 'Titulaire', value: bankDetails.accountName, key: 'name' },
                { label: 'RIB', value: bankDetails.rib, key: 'rib', mono: true },
                { label: 'IBAN', value: bankDetails.iban, key: 'iban', mono: true },
                { label: 'Montant', value: formatCurrency(course.price, course.currency), key: 'amount' },
                { label: 'Référence (OBLIGATOIRE)', value: referenceCode, key: 'ref', highlight: true, mono: true },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground mb-0.5">{item.label}</div>
                    <div className={`text-sm font-semibold break-all ${
                      item.highlight ? 'text-gold text-base font-bold' :
                      item.mono ? 'font-mono text-navy dark:text-white' :
                      'text-navy dark:text-white'
                    }`}>
                      {item.value}
                    </div>
                  </div>
                  <button
                    onClick={() => copy(item.value, item.key)}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-muted transition-colors"
                    aria-label={`Copier ${item.label}`}
                  >
                    {copied === item.key ? (
                      <CheckCircle className="w-4 h-4 text-emerald" />
                    ) : (
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-700 dark:text-yellow-400">
                <p className="font-semibold mb-1">Important !</p>
                <p className="text-xs opacity-80">
                  Mentionnez obligatoirement la référence{' '}
                  <span className="font-mono font-bold">{referenceCode}</span>{' '}
                  dans le libellé de votre virement pour faciliter l&apos;identification de votre paiement.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep('upload')}
              className="w-full btn-gold rounded-xl py-4 text-base"
            >
              J&apos;ai effectué le virement <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* ── Step 3: Upload proof ───────────────────────── */}
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="font-display text-xl font-bold text-navy dark:text-white mb-1">
                Preuve de paiement
              </h3>
              <p className="text-muted-foreground text-sm">
                Téléchargez votre reçu de virement (image ou PDF) pour validation.
              </p>
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-gold bg-gold/10'
                  : proofFile
                  ? 'border-emerald bg-emerald/5'
                  : 'border-border hover:border-gold/50 hover:bg-gold/5'
              }`}
            >
              <input {...getInputProps()} />
              {proofFile ? (
                <div className="flex flex-col items-center gap-3">
                  {proofFile.type === 'application/pdf' ? (
                    <FileText className="w-12 h-12 text-emerald" />
                  ) : (
                    <FileImage className="w-12 h-12 text-emerald" />
                  )}
                  <div>
                    <p className="font-semibold text-navy dark:text-white text-sm">{proofFile.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {(proofFile.size / 1024 / 1024).toFixed(2)} Mo
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setProofFile(null) }}
                    className="text-muted-foreground hover:text-red-500 text-xs flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Changer de fichier
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <p className="font-semibold text-navy dark:text-white text-sm">
                      {isDragActive ? 'Déposez ici !' : 'Glissez-déposez ou cliquez pour parcourir'}
                    </p>
                    <p className="text-muted-foreground text-xs mt-1">
                      JPEG, PNG, WebP, PDF — max 10 Mo
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleUploadProof}
              disabled={!proofFile || uploading}
              className="w-full btn-gold rounded-xl py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <>Envoyer la preuve de paiement <ArrowRight className="w-5 h-5" /></>
              )}
            </button>

            <button
              onClick={() => setStep('payment')}
              className="w-full text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              ← Retour aux coordonnées bancaires
            </button>
          </motion.div>
        )}

        {/* ── Success ────────────────────────────────────── */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-emerald/10 border-4 border-emerald/30 flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-12 h-12 text-emerald" />
            </motion.div>

            <div>
              <h3 className="font-display text-2xl font-bold text-navy dark:text-white mb-2">
                Demande envoyée !
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                Votre demande d&apos;inscription a été reçue. Nous vérifierons votre paiement et activerons
                votre accès sous <span className="font-semibold text-navy dark:text-white">24 heures ouvrables</span>.
              </p>
            </div>

            {referenceCode && (
              <div className="glass-card-light dark:glass-card p-4 rounded-2xl border border-gold/20 inline-block">
                <div className="text-xs text-muted-foreground mb-1">Votre référence de paiement</div>
                <div className="font-mono font-bold text-gold text-xl">{referenceCode}</div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="btn-gold rounded-xl py-3 w-full justify-center inline-flex"
              >
                Aller au tableau de bord
              </button>
              <button
                onClick={() => router.push('/formations')}
                className="btn-outline-gold rounded-xl py-3 w-full"
              >
                Continuer à explorer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
