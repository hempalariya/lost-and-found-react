import React from "react";
import Button from "../../utils/Button";
import { Link } from "react-router-dom";

const inputStyle =
  "w-full border border-blue-300 mb-5 rounded-md text-lg px-3 py-2";

export default function Login() {
  return (
    <div className="flex flex-col gap-3 items-center justify-center h-full md:w-130 m-auto">
      <form action="">
        <input type="text" className={inputStyle} placeholder="Username" />
        <input type="password" className={inputStyle} placeholder="Password" />
        <Button className={"bg-blue-500 w-full text-blue-100"}>Log in</Button>
      </form>
      <div className="text-lg text-center">
        <p>
          Don't have an account?{" "}
          <Link to={'/register'} className="text-blue-500 underline">Create Account</Link>
        </p>
        <p>Forgotten password <Link className="text-blue-500 underline">Click Here</Link></p>
      </div>
    </div>
  );
}
