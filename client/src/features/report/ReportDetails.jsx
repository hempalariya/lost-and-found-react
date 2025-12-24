import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../utils/api";

export default function ReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [matches, setMatches] = useState([]);
  const [matchStatus, setMatchStatus] = useState({
    loading: true,
    error: null,
  });
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    async function fetchReport() {
      const response = await axios.get(`/report/${id}`);
      setReport(response.data);
    }
    fetchReport();
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    if (!id || !token) {
      setUnreadCount(0);
      return;
    }

    axios
      .get(`/chat/${id}/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (isMounted) setUnreadCount(data?.unread || 0);
      })
      .catch(() => {
        if (isMounted) setUnreadCount(0);
      });

    return () => {
      isMounted = false;
    };
  }, [id, token]);

  useEffect(() => {
    let isMounted = true;
    async function fetchMatches() {
      try {
        setMatchStatus({ loading: true, error: null });
        const { data } = await axios.get(`/report/${id}/matches`);
        if (isMounted) {
          setMatches(data?.matches || []);
          setMatchStatus({ loading: false, error: null });
        }
      } catch (err) {
        const message = err.response?.data?.message || err.message;
        if (isMounted) {
          setMatchStatus({ loading: false, error: message });
        }
      }
    }
    if (id) fetchMatches();
    return () => {
      isMounted = false;
    };
  }, [id]);

  console.log(report);
  if (!report) return <p>loading...</p>;
  return (
    <div className="p-5 md:w-130 m-auto">
      {report.image && (
        <img
          src={`https://lost-and-found-react.onrender.com/${report.image}`}
          className="w-full h-60 object-cover rounded mb-5"
        />
      )}
      <p>Reported by: {report.createdBy.userName}</p>
      <h1 className="text-2xl font-bold">{report.itemName}</h1>
      <p className="text-lg mt-2">{report.description}</p>
      <p className="text-gray-700 mt-2">📍 {report.location}</p>
      <p className="mt-3 font-semibold">
        Type:{" "}
        <span className="capitalize text-blue-600">{report.reportType}</span>
      </p>
      {(report.contactNumber || report.contactEmail) && (
        <div className="mt-4 flex gap-3">
          {report.contactNumber && (
            <a
              href={`tel:${report.contactNumber}`}
              className="border px-3 py-2 rounded"
            >
              Call Finder
            </a>
          )}
          {report.contactEmail && (
            <a
              href={`mailto:${report.contactEmail}?subject=Regarding your ${
                report.reportType
              } report: ${report.itemName}&body=Hi ${
                report.contactName || ""
              },`}
              className="border px-3 py-2 rounded"
            >
              Email Finder
            </a>
          )}
        </div>
      )}
      <Link
        to={`/chat/${report._id}`}
        className="border px-3 py-2 rounded inline-flex items-center gap-2 relative"
      >
        <span>Message</span>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full min-w-[1.5rem] text-center">
            {unreadCount}
          </span>
        )}
      </Link>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Possible matches</h2>
        {matchStatus.loading ? (
          <p>Checking reports...</p>
        ) : matchStatus.error ? (
          <p className="text-red-500">{matchStatus.error}</p>
        ) : matches.length === 0 ? (
          <p>No matches yet. New reports will be checked automatically.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {matches.map((match) => (
              <Link
                key={match.report._id}
                to={`/report/${match.report._id}`}
                className="border rounded-lg p-3 flex gap-3 hover:shadow"
              >
                {match.report.image && (
                  <img
                    src={`https://lost-and-found-react.onrender.com/${match.report.image}`}
                    alt={match.report.itemName}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div>
                  <p className="text-lg font-semibold">
                    {match.report.itemName}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {match.report.description}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    {match.reason || "AI suggested match"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
