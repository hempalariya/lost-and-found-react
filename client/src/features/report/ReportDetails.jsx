import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../utils/api";
import { buildAssetUrl } from "../../utils/config";

export default function ReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchReport = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(`/report/${id}`);
        if (!ignore) {
          setReport(response.data);
        }
      } catch (err) {
        if (!ignore) {
          setReport(null);
          setError(
            err.response?.data?.message || "Unable to load this report right now."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchReport();
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-5 text-center">
        <p className="text-gray-600">Loading report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-5 text-center">
        <p className="text-red-500 mb-4">{error || "Report not found."}</p>
        <Link className="text-blue-600 underline" to="/">
          Go back home
        </Link>
      </div>
    );
  }

  const imageUrl = buildAssetUrl(report.image);

  return (
    <div className="p-5 md:w-130 m-auto">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={report.itemName}
          className="w-full h-60 object-cover rounded mb-5"
        />
      )}

      <h1 className="text-2xl font-bold">{report.itemName}</h1>
      <p className="text-lg mt-2 text-gray-800">{report.description}</p>
      <p className="text-gray-700 mt-2">
        <span className="font-semibold">Location:</span>{" "}
        {report.location || "Not provided"}
      </p>
      <p className="mt-3 font-semibold">
        Type:{" "}
        <span className="capitalize text-blue-600">{report.reportType}</span>
      </p>
      {report.status && (
        <p className="mt-1 text-sm uppercase tracking-wide text-green-700">
          Status: {report.status}
        </p>
      )}
      {(report.contactNumber || report.contactEmail) && (
        <div className="mt-4 flex flex-wrap gap-3">
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
        className="mt-5 inline-block border px-3 py-2 rounded"
      >
        Message Owner
      </Link>
    </div>
  );
}
