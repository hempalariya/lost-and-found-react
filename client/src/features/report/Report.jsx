import React, { useState } from "react";
import axios from "../../utils/api";
import { useNavigate } from "react-router-dom";
import Button from "../../utils/Button";

const inputStyle =
  "w-full border border-blue-300 mb-5 rounded-md text-lg px-3 py-2";

export default function Report() {
  const [reportData, setReportData] = useState({
    itemName: "",
    description: "",
    location: "",
    reportType: "lost",
    image: null,
    contactName: "",
    contactEmail: "",
    contactNumber: "",
  });

  const navigate = useNavigate();

  function handleChange(value, name) {
    setReportData({ ...reportData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("itemName", reportData.itemName);
    formData.append("description", reportData.description);
    formData.append("location", reportData.location);
    formData.append("reportType", reportData.reportType);
    formData.append("image", reportData.image);
    formData.append("contactName", reportData.contactName || "");
    formData.append("contactEmail", reportData.contactEmail || "");
    formData.append("contactNumber", reportData.contactNumber || "");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="md:w-130 m-auto p-5">
      <h1>Report lost/found</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="itemName"
          value={reportData.itemName}
          placeholder="Item name"
          className={inputStyle}
          onChange={(e) => {
            let name = e.target.name;
            let value = e.target.value;
            handleChange(value, name);
          }}
        />
        <textarea
          name="description"
          value={reportData.description}
          placeholder="description"
          className={inputStyle}
          onChange={(e) => handleChange(e.target.value, e.target.name)}
        ></textarea>

        <input
          type="text"
          name="location"
          placeholder="locaction"
          className={inputStyle}
          onChange={(e) => {
            let name = e.target.name;
            let value = e.target.value;
            handleChange(value, name);
          }}
        />
        <select
          name="reportType"
          id=""
          onChange={(e) => {
            let name = e.target.name;
            let value = e.target.value;
            handleChange(value, name);
          }}
        >
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <div>
          <input
            type="file"
            id="file"
            name="image"
            className="hidden"
            onChange={(e) => handleChange(e.target.files[0], "image")}
          />
          {reportData.image && (
            <p className="mt-2 text-sm text-green-600">
              {reportData.image.name}
            </p>
          )}
          <label htmlFor="file">
            <span className="ring ring-blue-400 rounded-full text-lg font-semibold px-3 py-2 cursor-pointer mt-2 inline-block">
              Upload Image
            </span>
          </label>
        </div>
        <input
          type="text"
          name="contactName"
          placeholder="Your name (optional)"
          className={inputStyle}
          onChange={(e) => handleChange(e.target.value, e.target.name)}
        />

        <input
          type="email"
          name="contactEmail"
          placeholder="Your email (optional)"
          className={inputStyle}
          onChange={(e) => handleChange(e.target.value, e.target.name)}
        />

        <input
          type="tel"
          name="contactNumber"
          placeholder="Your phone (optional)"
          className={inputStyle}
          onChange={(e) => handleChange(e.target.value, e.target.name)}
        />
        <Button type="submit">Report</Button>
      </form>
    </div>
  );
}
