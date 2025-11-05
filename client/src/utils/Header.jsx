import React from 'react'
import NavButton from './NavButton'
import {useSelector, useDispatch} from "react-redux"
import { logout } from '../features/auth/userSlice'
import Button from './Button'


export default function Header() {
  const {user} = useSelector(state => state.user)
  const dispatch = useDispatch()

  function handleLogout(){
    dispatch(logout())
  }

  console.log(user)

  return (
    <header className='flex justify-end items-center px-6 py-3 md:px-10 md:py-5 border-b border-b-stone-200'>
        <nav className='flex space-x-5'>
            <NavButton>Report</NavButton>
          {user && <div className='flex items-center'><p>welcome {user.userName}</p> <Button onClick={handleLogout}>Logout</Button></div>}
        </nav>
    </header>
  )
}
