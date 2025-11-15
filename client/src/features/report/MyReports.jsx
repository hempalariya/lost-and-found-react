import React, { useEffect, useState } from "react";
import axios from "../../utils/api";
import ItemCard from "../../utils/ItemCard";
import { useNavigate } from "react-router-dom";

export default function MyReports() {
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [infoMessage, setInfoMessage] = useState("");
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
        const res = await axios.get("/report/my-reports", {
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

  async function handleMarkReturned(id) {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not authenticated");
      navigate("/login");
      return;
    }
    try {
      setUpdatingId(id);
      setInfoMessage("");
      const response = await axios.patch(`/report/${id}/returned`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedReport = response.data?.report;

      setMyReports((prev) =>
        prev.map((r) =>
          r._id === id
            ? { ...r, status: updatedReport?.status || "returned" }
            : r
        )
      );
      setInfoMessage(response.data?.message || "Report marked as returned.");
    } catch (err) {
      const message =
        err.response?.data?.message || "Unable to update the report status.";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <div className="p-5">Loading...</div>;
  if (error) return <div className="p-5 text-red-500">{error}</div>;

  return (
    <div className="p-5 grid gap-4 md:grid-cols-3">
      {infoMessage && (
        <p className="md:col-span-3 text-green-700 font-semibold">
          {infoMessage}
        </p>
      )}
      {myReports.length === 0 ? (
        <div>No reports found</div>
      ) : (
        myReports.map((report) => (
          <div key={report._id}>
            <ItemCard item={report} />

            {report.status === "active" ? (
              <button
                onClick={() => handleMarkReturned(report._id)}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                disabled={updatingId === report._id}
              >
                {updatingId === report._id ? "Updating..." : "Mark as Returned"}
              </button>
            ) : (
              <p className="mt-2 text-green-700 font-semibold">✓ Returned</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
