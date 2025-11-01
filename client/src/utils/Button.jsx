import React from "react";

export default function Button({ children, className = " ", onClick, type='button'
 }) {
  return (
    <button
    type={type}
      className={`text-lg font-semibold w-30 rounded-full py-1 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
