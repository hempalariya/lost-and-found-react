import React from "react";
import { Link } from "react-router-dom";

export default function NavButton({ to, children, className = ' ' }) {
  return (
    <button className={`text-sm md:text-lg bg-blue-500 text-stone-200 font-semibold px-5 py-1 rounded-full ${className}`}>
      <Link to={to}>{children}</Link>
    </button>
  );
}






