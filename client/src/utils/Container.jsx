import React from 'react'

export default function Container({children}) {
  return (
   <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,400px))] gap-3 px-3">
        {children}
      </div>
  )
}
