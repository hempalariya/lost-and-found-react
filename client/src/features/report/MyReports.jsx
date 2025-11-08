import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import ItemCard from "../../utils/ItemCard";

export default function MyReports() {
  const [myReports, setMyReports] = useState([]);

  useEffect(() => {
    async function fetch() {
      const res = await api.get("/report/my-reports");
      setMyReports(res.data);
    }
    fetch();
  }, []);

  return (
    <div className="p-5 grid gap-4 md:grid-cols-3">
      {myReports.map(report => (
        <ItemCard key={report._id} item={report} />
      ))}
    </div>
  );
}
