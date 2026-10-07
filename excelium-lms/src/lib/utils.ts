import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'MAD'): string {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date, locale: string = 'fr-MA'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m.toString().padStart(2, '0')}min`
  if (m > 0) return `${m}min ${s.toString().padStart(2, '0')}s`
  return `${s}s`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function generateReferenceCode(): string {
  return 'EXC-' + Math.random().toString(36).substr(2, 8).toUpperCase()
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export function getVideoId(url: string): { type: 'youtube' | 'vimeo' | 'direct' | null; id: string | null } {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  if (ytMatch) return { type: 'youtube', id: ytMatch[1] }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return { type: 'vimeo', id: vimeoMatch[1] }

  // Direct URL
  if (url.startsWith('http') || url.startsWith('/')) return { type: 'direct', id: url }

  return { type: null, id: null }
}

export function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    debutant: 'Débutant',
    intermediaire: 'Intermédiaire',
    avance: 'Avancé',
  }
  return labels[level] || level
}

export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    debutant: 'bg-emerald/10 text-emerald border-emerald/20',
    intermediaire: 'bg-gold/10 text-gold border-gold/20',
    avance: 'bg-red-500/10 text-red-500 border-red-500/20',
  }
  return colors[level] || 'bg-muted text-muted-foreground'
}

export function getEnrollmentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Refusé',
    expired: 'Expiré',
    revoked: 'Révoqué',
  }
  return labels[status] || status
}

export function getEnrollmentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    approved: 'bg-emerald/10 text-emerald border-emerald/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    expired: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    revoked: 'bg-red-900/10 text-red-700 border-red-900/20',
  }
  return colors[status] || 'bg-muted text-muted-foreground'
}
