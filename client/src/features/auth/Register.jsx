import React from 'react'
import Button from '../../utils/Button';
import { Link } from 'react-router-dom';

const inputStyle =
  " w-full border border-blue-300 mb-5 rounded-md text-lg px-3 py-2";

export default function Register() {
  return (
    <div className="px-10 flex flex-col gap-3 items-center justify-center h-full md:w-130 m-auto">
      <form action="">
        <input type="text" className={inputStyle} placeholder="Username" />
        <input className={inputStyle} type="email" placeholder='email' />
        <input type="text" className={inputStyle} placeholder='Mobile number'/>
        <input type="password" className={inputStyle} placeholder="Password" />
        <Button className={"bg-blue-500 w-full text-blue-100"}>Log in</Button>
      </form>
      <div className="text-lg text-center">
        <p>
          Already have an account{" "}
          <Link to={'/Login'} className="text-blue-500 underline">LogIn</Link>
        </p>
        
      </div>
    </div>
  )
}
