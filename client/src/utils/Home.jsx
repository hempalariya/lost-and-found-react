import React, { useState } from "react";
import ItemCard from "./ItemCard";
import Button from "./Button";
import HomeLost from "./HomeLost";
import HomeFound from "./HomeFound";
import { useSelector } from "react-redux";

const activeClass = " bg-blue-500 text-blue-50";

export default function Home() {
  const [active, setActive] = useState("found");

  const user = useSelector((state) => state.user);

  console.log(user);

  return (
    <div className="lg:w-2/3 m-auto">
      <div className="flex gap-3 justify-evenly py-5 lg:mb-5">
        <Button
          className={`${active === "found" ? activeClass : " "}`}
          onClick={() => {
            setActive("found");
          }}
        >
          Found
        </Button>
        <Button
          className={`${active === "lost" ? activeClass : " text-stone-900"}`}
          onClick={() => {
            setActive("lost");
          }}
        >
          Lost
        </Button>
      </div>
      {active === "lost" && <HomeLost />}
      {active === "found" && <HomeFound />}
    </div>
  );
}
