import React from 'react'
import NavButton from './NavButton'

export default function Header() {
  return (
    <header className='flex justify-end items-center px-6 py-3 md:px-10 md:py-5 border-b border-b-stone-200'>
        <nav className='space-x-5'>
            <NavButton>Report Lost</NavButton>
            <NavButton>Report Found</NavButton>
        </nav>
    </header>
  )
}
