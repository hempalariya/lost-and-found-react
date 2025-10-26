import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import Footer from './Footer'

export default function AppLayout() {
  return (
    <div className='h-screen grid grid-rows-[auto_1fr_auto]'>
        <Header />
        <main className='overflow-scroll pt-5'>
            <Outlet />
        </main>
        <Footer />
    </div>
  )
}
