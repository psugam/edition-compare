// ============================================
// FILE: src/pages/CompareEditionsPage.jsx
// ============================================
import React, { useState, useMemo } from "react";
import {
  Search,
  ScrollText,
  GitCompare,
  X,
  Check,
  BookOpen,
} from "lucide-react";

// Import both data sources
import textsData from "../data/texts_new.json";
// ASSUMPTION: editionsData is available in the same folder and has the specified format.
import editionsData from "../data/editions_new.json";

function CompareEditionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearched, setIsSearched] = useState(false); // New state to track if search has been executed
  const [selectedWorkId, setSelectedWorkId] = useState(null);
  const [selectedEdition1Id, setSelectedEdition1Id] = useState(null);
  const [selectedEdition2Id, setSelectedEdition2Id] = useState(null);

  // Define edition-specific features for comparison
  const comparisonFeatures = [
    // Core Identification
    { key: "editionTitle", label: "Edition Title", type: "text" },
    { key: "editors", label: "Editors", type: "array" },
    { key: "publishedDate", label: "Publication Year", type: "text" },
    { key: "pageCount", label: "Total Pages", type: "text" },
    // Textual Features
    {
      key: "hasOriginalText",
      label: "Includes Original Text",
      type: "boolean",
    },
    { key: "hasTranslation", label: "Includes Translation", type: "boolean" },
    {
      key: "translationLanguages",
      label: "Translation Language(s)",
      type: "array",
    },
    {
      key: "hasFacingTranslation",
      label: "Facing Translation Layout",
      type: "boolean",
    },
    { key: "hasApparatus", label: "Critical Apparatus", type: "boolean" },
    { key: "hasCommentary", label: "Commentary Included", type: "boolean" },
    { key: "commentaryType", label: "Commentary Type", type: "text" },
    // Manuscript and Paratext
    {
      key: "primaryManuscripts",
      label: "Primary Manuscripts Used",
      type: "array",
    },
    { key: "hasIntroduction", label: "Has Introduction", type: "boolean" },
    { key: "hasGlossary", label: "Has Glossary", type: "boolean" },
    // Publisher & Availability
    { key: "publisher", label: "Publisher", type: "text" },
    { key: "isbn", label: "ISBN", type: "text" },
    { key: "openAccess", label: "Open Access", type: "boolean" },
  ];

  /* ------------------------------------------
   * Derived data
   * ----------------------------------------*/

  // 1. Search filter for works - ONLY RUNS IF isSearched is true
  const filteredWorks = useMemo(() => {
    if (!isSearched) return []; // Do not show results until searched

    const q = searchTerm.toLowerCase();

    return textsData
      .filter(
        (text) =>
          text.title.toLowerCase().includes(q) ||
          text.authors.some((a) => a.toLowerCase().includes(q))
      )
      .slice(0, 20);
  }, [searchTerm, isSearched]);

  const selectedWork = textsData.find((t) => t.textId === selectedWorkId);

  // 2. Filter editions based on the selected work's textId
  const availableEditions = useMemo(() => {
    if (!selectedWorkId) return [];

    // Filter editionsData to only include those matching the selected work's ID
    const editions = editionsData.filter((e) => e.textId === selectedWorkId);

    // Reset edition selections if the work changes
    if (!editions.some((e) => e.editionId === selectedEdition1Id)) {
      setSelectedEdition1Id(null);
    }
    if (!editions.some((e) => e.editionId === selectedEdition2Id)) {
      setSelectedEdition2Id(null);
    }

    return editions;
  }, [selectedWorkId, selectedEdition1Id, selectedEdition2Id]);

  // 3. Editions currently being compared
  const edition1Data = availableEditions.find(
    (e) => e.editionId === selectedEdition1Id
  );
  const edition2Data = availableEditions.find(
    (e) => e.editionId === selectedEdition2Id
  );

  /* ------------------------------------------
   * Helper Functions
   * ----------------------------------------*/

  const getFeatureValue = (edition, featureKey, type) => {
    const value = edition[featureKey];

    if (type === "array" && Array.isArray(value)) {
      return value.join(", ") || "N/A";
    }

    return value !== null && value !== undefined && value !== ""
      ? value.toString()
      : "N/A";
  };

  const handleWorkSelect = (textId) => {
    setSelectedWorkId(textId);
    setSelectedEdition1Id(null);
    setSelectedEdition2Id(null);
    setIsSearched(false); // Hide search results after selection
    setSearchTerm("");
  };

  const handleSearchClick = () => {
    setIsSearched(true);
    setSelectedWorkId(null); // Clear selected work on new search
  };

  const handleWorkDeselect = () => {
    setSelectedWorkId(null);
    setSelectedEdition1Id(null);
    setSelectedEdition2Id(null);
  };

  /* ------------------------------------------
   * Helper Components
   * ----------------------------------------*/

  const BooleanRenderer = ({ value }) => (
    <div className="flex justify-center">
      {value === true ? (
        <Check className="w-5 h-5 text-green-600" />
      ) : value === false ? (
        <X className="w-5 h-5 text-red-500" />
      ) : (
        <span className="text-gray-400">—</span>
      )}
    </div>
  );

  const WorkCard = ({ text, onSelect }) => (
    <div
      onClick={() => onSelect(text.textId)}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-3 hover:bg-indigo-50 cursor-pointer transition flex items-center justify-between"
    >
      <div>
        <h4 className="text-md font-semibold text-gray-900">{text.title}</h4>
        <p className="text-sm text-gray-600">
          {text.authors.join(", ")} | {text.originalLanguage} ({text.date})
        </p>
      </div>
      <button className="text-indigo-600 text-sm font-medium ml-4 flex-shrink-0">
        Select Work
      </button>
    </div>
  );

  const SelectedWorkDisplay = ({ work, onDeselect }) => (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex justify-between items-center shadow-inner">
      <div>
        <h3 className="text-xl font-serif font-bold text-indigo-800">
          <BookOpen className="inline w-6 h-6 mr-2" />
          {work.title} ({work.authors.join(", ")})
        </h3>
        <p className="text-sm text-indigo-600 mt-1">
          Now select two editions of this work to compare.
        </p>
      </div>
      <button
        onClick={onDeselect}
        className="text-sm font-medium text-red-500 hover:text-red-700 transition flex-shrink-0"
      >
        Change Work
      </button>
    </div>
  );

  /* ------------------------------------------
   * Main Render
   * ----------------------------------------*/

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans">
      <h1 className="text-4xl font-serif text-gray-900 mb-8 font-bold flex items-center">
        Compare Editions of a Text
      </h1>

      {/* 1. Work Selection Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          1. Select the Work
        </h2>

        {!selectedWork ? (
          <>
            {/* Search Input and Button */}
            <div className="flex space-x-3 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchTerm.length > 0)
                      handleSearchClick();
                  }}
                  className="pl-12 w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="Type a title or author (e.g., Iliad, Aeneid, Plato)..."
                />
              </div>
              <button
                onClick={handleSearchClick}
                disabled={searchTerm.length < 1}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-indigo-300 transition"
              >
                Search
              </button>
            </div>

            {/* Search Results */}
            <div className="mt-4 max-h-80 overflow-y-auto pr-2">
              {isSearched && filteredWorks.length > 0 ? (
                <>
                  <p className="text-sm text-gray-500 mb-3">
                    {filteredWorks.length} results found. Select one to
                    continue:
                  </p>
                  {filteredWorks.map((text) => (
                    <WorkCard
                      key={text.textId}
                      text={text}
                      onSelect={handleWorkSelect}
                    />
                  ))}
                </>
              ) : isSearched && filteredWorks.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No works found matching your search term.
                </p>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Enter a search term and click 'Search' to find a work.
                </p>
              )}
            </div>
          </>
        ) : (
          <SelectedWorkDisplay
            work={selectedWork}
            onDeselect={handleWorkDeselect}
          />
        )}
      </div>

      {/* 2. Edition Selection Section */}
      {selectedWork && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <ScrollText className="w-6 h-6 text-gray-500 mr-2" />
            2. Choose Editions to Compare ({availableEditions.length} available)
          </h2>

          {availableEditions.length > 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Edition 1 Dropdown */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Edition 1
                </label>
                <select
                  value={selectedEdition1Id || ""}
                  onChange={(e) => setSelectedEdition1Id(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                >
                  <option value="" disabled>
                    Select Edition 1...
                  </option>
                  {availableEditions.map((e) => (
                    <option
                      key={e.editionId}
                      value={e.editionId}
                      disabled={e.editionId === selectedEdition2Id}
                    >
                      {e.editionTitle} ({e.editors.join(", ")} -{" "}
                      {e.publishedDate})
                    </option>
                  ))}
                </select>
                {edition1Data && (
                  <p className="mt-2 text-sm text-gray-500">
                    {edition1Data.seriesName} | ISBN: {edition1Data.isbn}
                  </p>
                )}
              </div>

              {/* Edition 2 Dropdown */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Edition 2
                </label>
                <select
                  value={selectedEdition2Id || ""}
                  onChange={(e) => setSelectedEdition2Id(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-base focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                >
                  <option value="" disabled>
                    Select Edition 2...
                  </option>
                  {availableEditions.map((e) => (
                    <option
                      key={e.editionId}
                      value={e.editionId}
                      disabled={e.editionId === selectedEdition1Id}
                    >
                      {e.editionTitle} ({e.editors.join(", ")} -{" "}
                      {e.publishedDate})
                    </option>
                  ))}
                </select>
                {edition2Data && (
                  <p className="mt-2 text-sm text-gray-500">
                    {edition2Data.seriesName} | ISBN: {edition2Data.isbn}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
              <p className="text-yellow-800 font-medium">
                Only {availableEditions.length} edition(s) found for{" "}
                {selectedWork.title}. You need at least two editions to compare.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. Comparison Table Section */}
      {edition1Data && edition2Data ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg overflow-x-auto">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            3. Edition Feature Comparison
          </h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                  Feature
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edition 1: {edition1Data.editionTitle} (
                  {edition1Data.publishedDate})
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Edition 2: {edition2Data.editionTitle} (
                  {edition2Data.publishedDate})
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comparisonFeatures.map((feature) => (
                <tr key={feature.key} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {feature.label}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    {feature.type === "boolean" ? (
                      <BooleanRenderer value={edition1Data[feature.key]} />
                    ) : (
                      getFeatureValue(edition1Data, feature.key, feature.type)
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    {feature.type === "boolean" ? (
                      <BooleanRenderer value={edition2Data[feature.key]} />
                    ) : (
                      getFeatureValue(edition2Data, feature.key, feature.type)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center shadow-inner">
          <p className="text-lg font-medium text-yellow-800">
            {/* This message only shows if two editions are NOT selected, regardless of work selection state */}
            Select two different editions above to start the comparison.
          </p>
        </div>
      )}
    </div>
  );
}

export default CompareEditionsPage;
