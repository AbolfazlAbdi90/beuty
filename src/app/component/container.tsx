import React from 'react'

interface Ichildren {
  children: React.ReactNode
}

export default function Container({ children }: Ichildren) {
  return (
    <div className='container mx-auto px-3 sm:px-8 py-8'>
      {children}
    </div>
  )
}
