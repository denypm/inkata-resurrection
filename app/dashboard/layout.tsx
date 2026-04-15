import React from 'react'
import Navbar from '@/components/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="pb-24 lg:pb-0">
        {children}
      </main>
    </>
  )
}
