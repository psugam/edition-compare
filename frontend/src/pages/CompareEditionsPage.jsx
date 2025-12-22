import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../utils/axiosInstance";
import { BookOpen } from "lucide-react";

const fieldsToCompare = [
  { key: "editors", label: "Editors" },
  { key: "publishedDate", label: "Published Date" },
  { key: "publisher", label: "Publisher" },
  { key: "hasOriginalText", label: "Original Text" },
  { key: "hasTranslation", label: "Translation" },
  { key: "hasFacingTranslation", label: "Facing Translation" },
  { key: "hasCommentary", label: "Commentary" },
  { key: "hasApparatus", label: "Apparatus" },
  { key: "hasIntroduction", label: "Introduction" },
  { key: "publicDomain", label: "Public Domain" },
  { key: "openAccess", label: "Open Access" },
  { key: "pageCount", label: "Page Count" },
  { key: "translators", label: "Translators" },
  { key: "manuscripts", label: "Manuscripts" },
];

const renderValue = (value) => {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return value || "N/A";
};

const CompareEditionsPage = () => {
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editionIds = searchParams.getAll("editions");

    if (editionIds.length < 2) {
      setError("Please select at least two editions to compare.");
      setLoading(false);
      return;
    }

    const fetchEditions = async () => {
      try {
        const responses = await Promise.all(
          editionIds.map((id) => api.get(`/api/editions/${id}`))
        );
        setEditions(responses.map((res) => res.data));
      } catch (err) {
        setError("Failed to fetch edition data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEditions();
  }, [location.search]);

  const areValuesDifferent = (fieldKey) => {
    if (editions.length < 2) return false;
    const firstValue = JSON.stringify(editions[0][fieldKey]);
    for (let i = 1; i < editions.length; i++) {
      if (JSON.stringify(editions[i][fieldKey]) !== firstValue) {
        return true;
      }
    }
    return false;
  };

  if (loading) {
    return <div className="text-center p-10">Loading comparison...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 my-8">
      <header className="border-b pb-4 mb-6">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-emerald-600" />
          Compare Editions
        </h1>
        <p className="text-lg text-gray-600 italic">
          Side-by-side comparison of selected text editions.
        </p>
      </header>

      <main>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 border border-gray-200 font-semibold text-left text-sm text-gray-600 uppercase w-1/4">
                  Feature
                </th>
                {editions.map((edition) => (
                  <th
                    key={edition.editionId}
                    className="p-4 border border-gray-200 font-bold text-left text-md text-emerald-800"
                  >
                    {edition.editionTitle}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fieldsToCompare.map((field) => {
                const isDifferent = areValuesDifferent(field.key);
                return (
                  <tr
                    key={field.key}
                    className={
                      isDifferent ? "bg-yellow-100" : "hover:bg-gray-50"
                    }
                  >
                    <td className="p-4 border border-gray-200 font-semibold text-sm">
                      {field.label}
                    </td>
                    {editions.map((edition) => (
                      <td
                        key={`${edition.editionId}-${field.key}`}
                        className="p-4 border border-gray-200 text-sm"
                      >
                        {renderValue(edition[field.key])}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default CompareEditionsPage;
