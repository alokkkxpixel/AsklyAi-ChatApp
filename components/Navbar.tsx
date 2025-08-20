import React from 'react'
import ThemeToggleButton from './ui/theme-toggle-button'
import { Github } from 'lucide-react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='w-full mx-auto px-5 py-2 md:px-70 '>

          <div className='flex  items-center justify-between   py-2 bg--400'>
     <Link 
  href="https://github.com/alokkkxpixel/AsklyAi-ChatApp" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <Github size={24} />
</Link>
     <h1 className="text-2xl font-medium  font-[Skiper1] ">  Askly </h1>
      <ThemeToggleButton  />
      </div>
    </div>
  )
}

export default Navbar