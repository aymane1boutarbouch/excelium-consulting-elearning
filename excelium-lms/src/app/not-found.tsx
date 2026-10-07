import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ArrowLeft, GraduationCap } from 'lucide-react'

export const metadata = {
  title: 'Page Non Trouvée — Excelium Consulting Compta',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory dark:bg-navy flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center section-padding">
        <div className="section-container max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold mx-auto font-serif font-bold text-2xl">
            404
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold text-navy dark:text-white">
              Page Introuvable
            </h1>
            <p className="text-muted-foreground text-xs leading-relaxed">
              La page ou la ressource que vous recherchez n&apos;existe pas ou a été déplacée.
            </p>
          </div>

          <Link href="/" className="btn-gold text-xs px-6 py-3 font-semibold inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retourner à l&apos;accueil
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
