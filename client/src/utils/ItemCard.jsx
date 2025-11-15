import React from "react";
import { IoLocationOutline } from "react-icons/io5";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { buildAssetUrl } from "./config";

export default function ItemCard({ item }) {
  const { user } = useSelector((state) => state.user);

  const linkTo = !user ? "/login" : `/report/${item._id}`;

  return (
    <Link to={linkTo}>
      <div className="flex w-full gap-4 p-2 h-52 ring ring-stone-300 relative">
        <div className="w-32 overflow-hidden">
          <img
            src={buildAssetUrl(item.image)}
            alt={item.itemName}
            className="h-full"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold">{item.itemName}</h3>
          <p className="flex items-center gap-2 text-lg">
            {" "}
            <IoLocationOutline />
            {item.location}
          </p>
          <p className="">{item.description}</p>
        </div>
      
      </div>
    </Link>
  );
}
