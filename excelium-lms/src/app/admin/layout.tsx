import React from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = {
  title: 'Administration — Excelium Consulting Compta',
  description: 'Panneau de gestion et contrôle de la plateforme LMS Excelium Consulting Compta',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminSidebar>{children}</AdminSidebar>
}
