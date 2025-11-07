import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFoundReports,
  fetchLostReports,
} from "../features/report/reportSlice";

import Button from "./Button";
import HomeLost from "./HomeLost";
import HomeFound from "./HomeFound";

const activeClass = " bg-blue-500 text-blue-50";

export default function Home() {
  const [active, setActive] = useState("found");

  const dispatch = useDispatch();
  const { lost, found, loading } = useSelector((state) => state.reports);

  useEffect(() => {
    dispatch(fetchFoundReports());
    dispatch(fetchLostReports());
  }, []);

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
      {active === "lost" && <HomeLost data={lost} />}
      {active === "found" && <HomeFound data={found} />}
    </div>
  );
}
