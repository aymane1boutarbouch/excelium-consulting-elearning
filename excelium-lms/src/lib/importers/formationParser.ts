import * as XLSX from 'xlsx'
import mammoth from 'mammoth'

export interface ParsedLesson {
  id: string
  title: string
  duration: string
  type: 'video' | 'text' | 'resource' | 'quiz'
  content?: string
  videoUrl?: string
  isFreePreview?: boolean
}

export interface ParsedModule {
  id: string
  title: string
  lessons: ParsedLesson[]
}

export interface ParsedFormation {
  id?: string
  title: string
  slug: string
  category: string
  price: number
  currency: string
  durationHours: number
  level: 'Débutant' | 'Intermédiaire' | 'Avancé'
  description: string
  previewVideoUrl?: string
  thumbnailUrl?: string
  isPublished?: boolean
  isFeatured?: boolean
  modules: ParsedModule[]
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

/**
 * Parse Excel (.xlsx, .xls, .csv) files into ParsedFormation array
 */
export async function parseExcelFile(file: File): Promise<ParsedFormation[]> {
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data, { type: 'array' })
  
  const formationsMap = new Map<string, ParsedFormation>()

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName]
    const jsonRows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' })

    jsonRows.forEach((row, index) => {
      // Find matching keys case-insensitively
      const getVal = (...keys: string[]): string => {
        for (const k of Object.keys(row)) {
          const lowerK = k.toLowerCase().trim()
          for (const key of keys) {
            if (lowerK.includes(key.toLowerCase())) {
              return String(row[k] || '').trim()
            }
          }
        }
        return ''
      }

      const title = getVal('title', 'formation', 'cours', 'course') || sheetName || 'Formation sans titre'
      const category = getVal('category', 'categorie', 'domaine') || 'Fiscalité Marocaine'
      const priceRaw = getVal('price', 'prix', 'tarif')
      const price = priceRaw ? parseFloat(priceRaw.replace(/[^0-9.]/g, '')) || 1200 : 1200
      const levelRaw = getVal('level', 'niveau')
      let level: 'Débutant' | 'Intermédiaire' | 'Avancé' = 'Intermédiaire'
      if (levelRaw.toLowerCase().includes('deb') || levelRaw.toLowerCase().includes('beg')) level = 'Débutant'
      if (levelRaw.toLowerCase().includes('ava') || levelRaw.toLowerCase().includes('adv')) level = 'Avancé'

      const description = getVal('description', 'resume', 'intro') || `Formation pratique sur ${title}`
      const moduleTitle = getVal('module', 'chapitre', 'section') || 'Module 1 : Généralités'
      const lessonTitle = getVal('lesson', 'lecon', 'sujet', 'titre lecon') || `Leçon ${index + 1}`
      const duration = getVal('duration', 'duree', 'temps') || '45 min'
      const videoUrl = getVal('video', 'lien', 'url') || ''
      const content = getVal('content', 'contenu', 'texte') || ''
      const isFree = getVal('free', 'gratuit', 'apercu').toLowerCase().includes('oui') || getVal('free', 'gratuit', 'apercu') === 'true'

      const formationKey = slugify(title)
      if (!formationsMap.has(formationKey)) {
        formationsMap.set(formationKey, {
          title,
          slug: formationKey,
          category,
          price,
          currency: 'MAD',
          durationHours: 15,
          level,
          description,
          previewVideoUrl: videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
          isPublished: true,
          isFeatured: false,
          modules: [],
        })
      }

      const formation = formationsMap.get(formationKey)!

      // Find or create module
      let mod = formation.modules.find((m) => m.title.toLowerCase() === moduleTitle.toLowerCase())
      if (!mod) {
        mod = {
          id: `mod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          title: moduleTitle,
          lessons: [],
        }
        formation.modules.push(mod)
      }

      // Add lesson
      mod.lessons.push({
        id: `les-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: lessonTitle,
        duration: duration.endsWith('min') ? duration : `${duration} min`,
        type: videoUrl ? 'video' : 'text',
        videoUrl,
        content: content || `Support de cours détaillé pour : ${lessonTitle}`,
        isFreePreview: isFree,
      })
    })
  })

  return Array.from(formationsMap.values())
}

/**
 * Parse Word (.docx, .doc) files into ParsedFormation
 */
export async function parseWordFile(file: File): Promise<ParsedFormation> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  const text = result.value || ''

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)

  let title = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
  let description = ''
  let category = 'Comptabilité & Fiscalité'
  let price = 1500
  let level: 'Débutant' | 'Intermédiaire' | 'Avancé' = 'Intermédiaire'

  const modules: ParsedModule[] = []
  let currentModule: ParsedModule | null = null

  lines.forEach((line, index) => {
    const lower = line.toLowerCase()

    // Title parsing
    if (index === 0 && line.length > 5 && line.length < 120) {
      title = line
      return
    }

    if (lower.startsWith('titre:') || lower.startsWith('formation:')) {
      title = line.replace(/^(titre|formation)\s*:\s*/i, '')
      return
    }

    if (lower.startsWith('catégorie:') || lower.startsWith('categorie:')) {
      category = line.replace(/^catégorie\s*:\s*/i, '')
      return
    }

    if (lower.startsWith('prix:') || lower.startsWith('tarif:')) {
      const p = parseFloat(line.replace(/[^0-9.]/g, ''))
      if (p) price = p
      return
    }

    if (lower.startsWith('niveau:')) {
      if (lower.includes('deb')) level = 'Débutant'
      else if (lower.includes('ava')) level = 'Avancé'
      return
    }

    if (lower.startsWith('description:')) {
      description = line.replace(/^description\s*:\s*/i, '')
      return
    }

    // Module detection (starts with Module, Chapitre, Partie, Section, or bold/all-caps heading)
    if (
      /^(module|chapitre|partie|section|unité)\s*\d+/i.test(line) ||
      (line.toUpperCase() === line && line.length > 8 && line.length < 80)
    ) {
      currentModule = {
        id: `mod-${Date.now()}-${modules.length + 1}`,
        title: line,
        lessons: [],
      }
      modules.push(currentModule)
      return
    }

    // Lesson detection
    if (
      /^(leçon|lesson|sujet|cours|point|\d+\.\d+)\s*/i.test(line) ||
      (currentModule && (line.startsWith('-') || line.startsWith('•') || /^\d+[\.\)]/.test(line)))
    ) {
      if (!currentModule) {
        currentModule = {
          id: `mod-${Date.now()}-1`,
          title: 'Module 1 : Programme Principal',
          lessons: [],
        }
        modules.push(currentModule)
      }

      const lessonTitle = line.replace(/^[-•\d\.\)\s]+/, '').replace(/^(leçon|lesson|sujet)\s*\d*\s*:?\s*/i, '')
      currentModule.lessons.push({
        id: `les-${Date.now()}-${currentModule.lessons.length + 1}`,
        title: lessonTitle || line,
        duration: '45 min',
        type: 'text',
        content: `Contenu extrait du document Word pour la leçon : ${lessonTitle || line}`,
        isFreePreview: currentModule.lessons.length === 0,
      })
      return
    }

    // Capture overall description if not set
    if (index < 5 && !description && line.length > 20) {
      description += line + ' '
    }
  })

  // Fallback module if none found
  if (modules.length === 0) {
    modules.push({
      id: `mod-${Date.now()}-1`,
      title: 'Module 1 : Module Unique',
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          title: 'Leçon 1 : Contenu Général de la Formation',
          duration: '60 min',
          type: 'text',
          content: text.substring(0, 1000) + '...',
          isFreePreview: true,
        }
      ]
    })
  }

  return {
    title,
    slug: slugify(title),
    category,
    price,
    currency: 'MAD',
    durationHours: Math.max(10, modules.reduce((sum, m) => sum + m.lessons.length * 1.5, 0)),
    level,
    description: description.trim() || `Formation complète issue du document ${file.name}`,
    previewVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    isPublished: true,
    isFeatured: false,
    modules,
  }
}

/**
 * Generate and trigger download of pre-formatted Excel template (.xlsx)
 */
export function downloadSampleExcelTemplate() {
  const sampleData = [
    {
      Formation: 'Comptabilité Analytique & Contrôle de Gestion 2026',
      Catégorie: 'Comptabilité',
      Prix: 1450,
      Niveau: 'Intermédiaire',
      Description: 'Maîtrisez les coûts de revient, seuils de rentabilité et tableaux de bord de gestion.',
      Module: 'Module 1 : Calcul des Coûts de Revient',
      Leçon: 'Introduction à la comptabilité analytique d exploitation',
      Durée: '45 min',
      Vidéo_URL: 'https://vimeo.com/sample1',
      Contenu: 'Notions de charges incorporables et non incorporables selon le PCM.',
      Aperçu_Gratuit: 'Oui',
    },
    {
      Formation: 'Comptabilité Analytique & Contrôle de Gestion 2026',
      Catégorie: 'Comptabilité',
      Prix: 1450,
      Niveau: 'Intermédiaire',
      Description: 'Maîtrisez les coûts de revient, seuils de rentabilité et tableaux de bord de gestion.',
      Module: 'Module 1 : Calcul des Coûts de Revient',
      Leçon: 'Méthode des centres d analyse & Clés de répartition',
      Durée: '60 min',
      Vidéo_URL: 'https://vimeo.com/sample2',
      Contenu: 'Répartition primaire et secondaire des charges indirectes.',
      Aperçu_Gratuit: 'Non',
    },
    {
      Formation: 'Comptabilité Analytique & Contrôle de Gestion 2026',
      Catégorie: 'Comptabilité',
      Prix: 1450,
      Niveau: 'Intermédiaire',
      Description: 'Maîtrisez les coûts de revient, seuils de rentabilité et tableaux de bord de gestion.',
      Module: 'Module 2 : Seuils de Rentabilité & BFR',
      Leçon: 'Analyse du point mort et de la marge de sécurité',
      Durée: '75 min',
      Vidéo_URL: 'https://vimeo.com/sample3',
      Contenu: 'Calcul de la marge sur coût variable et levier opérationnel.',
      Aperçu_Gratuit: 'Non',
    },
    {
      Formation: 'Pratique du Contrôle Fiscal & Gestion des Contentieux',
      Catégorie: 'Fiscalité Marocaine',
      Prix: 1990,
      Niveau: 'Avancé',
      Description: 'Guide juridique et pratique face aux vérifications de l administration fiscale marocaine.',
      Module: 'Module 1 : Procédure de Vérification sur Place',
      Leçon: 'Droits et garanties du contribuable vérifié',
      Durée: '50 min',
      Vidéo_URL: 'https://vimeo.com/sample4',
      Contenu: 'Charte du contribuable et Délais légaux de la vérification.',
      Aperçu_Gratuit: 'Oui',
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(sampleData)

  // Adjust column widths
  worksheet['!cols'] = [
    { wch: 35 }, // Formation
    { wch: 18 }, // Catégorie
    { wch: 10 }, // Prix
    { wch: 15 }, // Niveau
    { wch: 40 }, // Description
    { wch: 30 }, // Module
    { wch: 35 }, // Leçon
    { wch: 12 }, // Durée
    { wch: 25 }, // Vidéo_URL
    { wch: 40 }, // Contenu
    { wch: 15 }, // Aperçu_Gratuit
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Formations_Excelium')
  XLSX.writeFile(workbook, 'Excelium_Modele_Import_Formations.xlsx')
}

/**
 * Returns structured guide text for Word (.docx) documents
 */
export function getWordTemplateGuideText(): string {
  return `EXCELIUM CONSULTING COMPTA — STRUCTURE RECOMMANDÉE WORD (.DOCX)

Titre : Pratique Avancée de la TVA Marocaine 2026
Catégorie : Fiscalité Marocaine
Prix : 1350
Niveau : Avancé
Description : Formation complète sur les régimes d'encaissement, de débit, droit à déduction et prorata de TVA.

Module 1 : Champ d'Application & Fait Générateur
Leçon 1 : Opérations obligatoirement et facultativement imposables
Leçon 2 : Délibération du fait générateur : Débit vs Encaissement

Module 2 : Droit à Déduction & Règle du Décalage d'un Mois
Leçon 1 : Conditions de forme et de fond du droit à déduction
Leçon 2 : Gestion des factures impayées et régularisations

Module 3 : Télé-déclaration SIMPL-TVA
Leçon 1 : Établissement du relevé de déduction XML
Leçon 2 : Validation et télépaiement sur le portail de la DGI`
}
