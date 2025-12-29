import React, { useState } from "react";
import api from "../utils/axiosInstance";
import {
  BookOpen,
  Search,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

// Expanded and grouped fields for a more comprehensive comparison
const fieldsToCompare = {
  Publication: [
    { key: "publisher", label: "Publisher" },
    { key: "publishedDate", label: "Published Date" },
    { key: "seriesName", label: "Series" },
    { key: "isbn", label: "ISBN" },
    { key: "inPrint", label: "In Print" },
  ],
  Contributors: [
    { key: "editors", label: "Editors" },
    { key: "translators", label: "Translators" },
    { key: "contributors", label: "Other Contributors" },
  ],
  Content: [
    { key: "completeEdition", label: "Complete Edition" },
    { key: "partsIncluded", label: "Parts Included" },
    { key: "pageCount", label: "Page Count" },
    { key: "hasOriginalText", label: "Includes Original Text" },
    { key: "hasIntroduction", label: "Has Introduction" },
    { key: "hasBibliography", label: "Has Bibliography" },
    { key: "hasGlossary", label: "Has Glossary" },
    { key: "illustrations", label: "Has Illustrations" },
    { key: "maps", label: "Has Maps" },
  ],
  "Textual Features": [
    { key: "manuscripts", label: "Manuscripts Used" },
    { key: "hasApparatus", label: "Has Critical Apparatus" },
    { key: "apparatusType", label: "Apparatus Type" },
    { key_
    : "hasNotes", label: "Has Notes" },
    { key: "notesType", label: "Notes Type" },
    { key: "lineNumbering", label: "Has Line Numbering" },
  ],
  Translation: [
    { key: "hasTranslation", label: "Includes Translation" },
    { key: "translationLanguages", label: "Translation Language(s)" },
    { key: "translationType", label: "Translation Type" },
    { key: "hasFacingTranslation", label: "Has Facing Translation" },
  ],
  Commentary: [
    { key: "hasCommentary", label: "Has Commentary" },
    { key: "commentaryLength", label: "Commentary Length" },
    { key: "commentaryLanguage", label: "Commentary Language" },
  ],
  Access: [
    { key: "publicDomain", label: "Public Domain" },
    { key: "openAccess", label: "Open Access" },
    { key: "license", label: "License" },
  ],
};

const RenderValue = ({ value }) => {
  if (typeof value === "boolean") {
    return value ? (
      <CheckCircle2 className="w-6 h-6 text-green-600" />
    ) : (
      <XCircle className="w-6 h-6 text-red-500" />
    );
  }
  if (Array.isArray(value) && value.length > 0) {
    return (
      <ul className="list-disc list-inside">
        {value.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  }
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return <span className="text-gray-400">N/A</span>;
  }
  return String(value);
};

const CompareEditionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedText, setSelectedText] = useState(null);
  const [editions, setEditions] = useState([]);
  const [selectedEditions, setSelectedEditions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    setSelectedText(null);
    setEditions([]);
    setSelectedEditions([]);
    try {
      const response = await api.get(`/api/texts?q=${searchQuery}`);
      setSearchResults(response.data.texts);
    } catch (err) {
      setError("Failed to search for texts.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectText = async (text) => {
    setSelectedText(text);
    setSearchResults([]); // Clear search results
    setLoading(true);
    setError(null);
    setEditions([]);
    setSelectedEditions([]);
    try {
      const response = await api.get(`/api/editions/text/${text.textId}`);
      if (response.data.length < 2) {
        setError(
          "Comparison not possible: This text does not have at least two editions."
        );
        setEditions([]);
      } else {
        setEditions(response.data);
      }
    } catch (err) {
      setError(`Failed to fetch editions for ${text.title}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditionSelection = (e) => {
    const editionId = e.target.value;
    const isChecked = e.target.checked;

    let newSelection = [...selectedEditions];

    if (isChecked) {
      if (newSelection.length < 2) {
        const edition = editions.find((ed) => ed.editionId === editionId);
        if (edition) {
          newSelection.push(edition);
        }
      } else {
        e.target.checked = false;
        return;
      }
    } else {
      newSelection = newSelection.filter((ed) => ed.editionId !== editionId);
    }

    setSelectedEditions(newSelection);
  };

  const areValuesDifferent = (key) => {
    if (selectedEditions.length < 2) return false;
    const firstValue = JSON.stringify(selectedEditions[0][key]);
    const secondValue = JSON.stringify(selectedEditions[1][key]);
    return firstValue !== secondValue;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white my-8">
      <header className="border-b-2 border-gray-200 pb-4 mb-6">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <BookOpen className="w-10 h-10 text-emerald-600" />
          Compare Editions
        </h1>
        <p className="text-lg text-gray-500 italic mt-1">
          Search for a text and select two of its editions to compare
          side-by-side.
        </p>
      </header>

      <main>
        {/* Step 1: Search for a text */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="bg-emerald-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
              1
            </span>
            Search for a Text
          </h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. 'The Odyssey', 'Homer', 'grc-001'"
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </form>

          {loading && searchResults.length === 0 && (
            <div className="mt-4">Searching...</div>
          )}
          
          {searchResults.length > 0 && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-bold mb-2">Search Results:</h3>
              <ul className="space-y-2">
                {searchResults.map((text) => (
                  <li
                    key={text.textId}
                    onClick={() => handleSelectText(text)}
                    className="p-3 bg-white rounded shadow-sm hover:bg-emerald-50 cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <span className="font-bold">{text.title}</span> (
                      {text.authors.join(", ")})
                      <em className="ml-2 text-gray-500">{text.textId}</em>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Step 2: Select editions */}
        {selectedText && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="bg-emerald-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
                2
              </span>
              Select Two Editions of{" "}
              <em className="text-emerald-700">{selectedText.title}</em>
            </h2>
            {loading && <div className="mt-4">Loading editions...</div>}
            {error && (
              <div className="mt-4 text-orange-600 bg-orange-100 p-4 rounded-lg flex items-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                <span>{error}</span>
              </div>
            )}
            {editions.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {editions.map((edition) => (
                  <label
                    key={edition.editionId}
                    className="p-4 border rounded-lg hover:border-emerald-500 cursor-pointer has-[:checked]:bg-emerald-50 has-[:checked]:border-emerald-600 transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={edition.editionId}
                      onChange={handleEditionSelection}
                      className="mr-3"
                      disabled={selectedEditions.length >= 2 && !selectedEditions.find(se => se.editionId === edition.editionId)}
                    />
                    <span className="font-semibold">{edition.editionTitle}</span>
                    <p className="text-sm text-gray-600">
                      {edition.publisher}, {edition.publishedDate}
                    </p>
                  </label>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Step 3: Compare */}
        {selectedEditions.length === 2 && (
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="bg-emerald-600 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
                3
              </span>
              Comparison Result
            </h2>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 border-r border-gray-200 font-semibold text-left text-sm text-gray-600 uppercase w-1/4">
                      Feature
                    </th>
                    {selectedEditions.map((edition) => (
                      <th
                        key={edition.editionId}
                        className="p-4 border-r border-gray-200 font-bold text-left text-md text-emerald-800"
                      >
                        {edition.editionTitle}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(fieldsToCompare).map(
                    ([category, fields]) => (
                      <React.Fragment key={category}>
                        <tr className="bg-gray-50">
                          <td
                            colSpan={3}
                            className="p-2 font-bold text-emerald-800 border-t border-b border-gray-200"
                          >
                            {category}
                          </td>
                        </tr>
                        {fields.map((field) => {
                          const isDifferent = areValuesDifferent(field.key);
                          return (
                            <tr
                              key={field.key}
                              className={
                                isDifferent
                                  ? "bg-yellow-100"
                                  : "hover:bg-gray-50"
                              }
                            >
                              <td className="p-4 border-r border-t border-gray-200 font-semibold text-sm align-top">
                                {field.label}
                              </td>
                              {selectedEditions.map((edition) => (
                                <td
                                  key={`${edition.editionId}-${field.key}`}
                                  className="p-4 border-r border-t border-gray-200 text-sm align-top"
                                >
                                  <RenderValue value={edition[field.key]} />
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CompareEditionsPage;
