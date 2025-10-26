import React from "react";
import { IoLocationOutline } from "react-icons/io5";

import img from "/demo.png";
import NavButton from "./NavButton";

export default function ItemCard({ item }) {
  return (
    <div className="flex w-full gap-4 p-2 h-40 ring ring-stone-300">
      <div className="w-30">
        <img src={img} alt="" className="h-full"/>
      </div>
      <div className="flex flex-col gap-1 relative">
        <h3 className="text-xl font-semibold">{item.itemName}</h3>
        <p className="flex items-center gap-2 text-lg">
          {" "}
          <IoLocationOutline />
          Mehragoan, Bhimtal
        </p>
        <p className="">{item.itemDescription}</p>
        <NavButton className= {' absolute bottom-1 right-3'} to={'/login'}> Claim </NavButton>
      </div>
    </div>
  );
}
