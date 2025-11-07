import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../utils/api";

export default function ReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  useEffect(() => {
    async function fetchReport() {
      const response = await axios.get(`/report/${id}`);
      setReport(response.data);
    }
    fetchReport();
  }, [id]);

  if (!report) return <p>loading...</p>;
  return (
    <div className="p-5 md:w-130 m-auto">
      {report.image && (
        <img
          src={`http://localhost:5000/${report.image}`}
          className="w-full h-60 object-cover rounded mb-5"
        />
      )}

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
    </div>
  );
}
