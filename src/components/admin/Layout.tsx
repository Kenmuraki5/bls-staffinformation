import React from 'react'
import PersistentDrawerLeft from '../drawer'

export default function LayoutPage({children}:any) {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <PersistentDrawerLeft />
      {children}
    </main>
  )
}
