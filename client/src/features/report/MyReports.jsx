
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import ItemCard from "../../utils/ItemCard";
import { useNavigate } from "react-router-dom";

export default function MyReports() {
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not authenticated");
          navigate("/login");
          return;
        }
        const res = await api.get("/report/my-reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyReports(res.data || []);
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        setError(message);
        if (err.response?.status === 401) navigate("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [navigate]);

  if (loading) return <div className="p-5">Loading...</div>;
  if (error) return <div className="p-5 text-red-500">{error}</div>;

  return (
    <div className="p-5 grid gap-4 md:grid-cols-3">
      {myReports.length === 0 ? (
        <div>No reports found</div>
      ) : (
        myReports.map((report) => <ItemCard key={report._id} item={report} />)
      )}
    </div>
  );
}
