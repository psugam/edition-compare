import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Globe,
  ExternalLink,
  Filter,
} from "lucide-react";
import textsData from "../data/texts.json";
import editionsData from "../data/editions.json";

function TextDetailPage() {
  const { textId } = useParams();
  const text = textsData.find((t) => t.textId === textId);

  const [filters, setFilters] = useState({
    hasOriginal: null,
    hasCommentary: null,
    translationLanguages: [],
    publicDomain: null,
    dateRange: [1400, 2025],
  });
  const resetFilters = () => {
    setFilters({
      hasOriginal: null,
      hasCommentary: null,
      translationLanguages: [],
      publicDomain: null,
      dateRange: [minYear, maxYear],
    });
  };

  const [showFilters, setShowFilters] = useState(true);
  const [minYear, setMinYear] = useState(1400);
  const [maxYear, setMaxYear] = useState(2025);

  const editions = useMemo(() => {
    return editionsData.filter((e) => e.textId === textId);
  }, [textId]);

  // Calculate actual date range from editions
  useEffect(() => {
    if (editions.length > 0) {
      const years = editions
        .map((e) => parseInt(e.publishedDate))
        .filter((y) => !isNaN(y));
      if (years.length > 0) {
        const min = Math.min(...years);
        const max = Math.max(...years);
        setMinYear(min);
        setMaxYear(max);
        setFilters((prev) => ({ ...prev, dateRange: [min, max] }));
      }
    }
  }, [editions]);

  // Get all unique translation languages
  const allTranslationLanguages = useMemo(() => {
    const languages = new Set();
    editions.forEach((ed) => {
      ed.translationLanguages.forEach((lang) => languages.add(lang));
    });
    return Array.from(languages).sort();
  }, [editions]);

  const filteredEditions = useMemo(() => {
    return editions.filter((ed) => {
      // orignal text filter
      if (
        filters.hasOriginal !== null &&
        ed.hasOriginal !== filters.hasOriginal
      ) {
        return false;
      }

      // Commentary filter
      if (
        filters.hasCommentary !== null &&
        ed.hasCommentary !== filters.hasCommentary
      ) {
        return false;
      }

      // Translation language filter
      if (filters.translationLanguages.length > 0) {
        const hasSelectedLanguage = filters.translationLanguages.some((lang) =>
          ed.translationLanguages.includes(lang)
        );
        if (!hasSelectedLanguage) return false;
      }

      // Public domain filter
      if (
        filters.publicDomain !== null &&
        ed.publicDomain !== filters.publicDomain
      ) {
        return false;
      }

      // Date range filter
      const year = parseInt(ed.publishedDate);
      if (
        !isNaN(year) &&
        (year < filters.dateRange[0] || year > filters.dateRange[1])
      ) {
        return false;
      }

      return true;
    });
  }, [editions, filters]);

  const toggleTranslationLanguage = (lang) => {
    setFilters((prev) => ({
      ...prev,
      translationLanguages: prev.translationLanguages.includes(lang)
        ? prev.translationLanguages.filter((l) => l !== lang)
        : [...prev.translationLanguages, lang],
    }));
  };

  if (!text) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Text not found
        </h2>
        <Link to="/search" className="text-blue-600 hover:text-blue-800">
          Return to search
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/search"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to search
      </Link>

      {/* Text Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">{text.title}</h1>
        <p className="text-xl text-gray-600 mb-4">{text.titleOriginal}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <div className="w-full">
            <span className="font-medium">Author(s):</span>{" "}
            {text.authors.join(", ")}
          </div>
          <div className="w-full">
            <span className="font-medium">Language:</span>{" "}
            {text.originalLanguage}
          </div>
          {text.date && (
            <div className="w-full">
              <span className="font-medium">Date:</span> ~{text.date}
            </div>
          )}
          {text.description && <div className="w-full">{text.description}</div>}

          {text.wikiLink && (
            <div>
              <a href={text.wikiLink} target="_blank" className="text-blue-500">
                Wikipedia
              </a>
            </div>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {filteredEditions.length} edition
          {filteredEditions.length !== 1 ? "s" : ""} available
        </div>
      </div>

      {/* Filters Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full"
        >
          <span className="font-medium text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Editions
          </span>
          <span className="text-sm text-gray-600">
            {showFilters ? "Hide" : "Show"}
          </span>
        </button>

        {showFilters && (
          <div className="mt-6 space-y-6">
            {/* Date Range Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Publication Date Range: {filters.dateRange[0]} -{" "}
                {filters.dateRange[1]}
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={filters.dateRange[0]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: [parseInt(e.target.value), prev.dateRange[1]],
                    }))
                  }
                  className="flex-1"
                />
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={filters.dateRange[1]}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: [prev.dateRange[0], parseInt(e.target.value)],
                    }))
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Orginal text Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Original
                </label>
                <select
                  value={
                    filters.hasOriginal === null ? "all" : filters.hasOriginal
                  }
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      hasOriginal:
                        e.target.value === "all"
                          ? null
                          : e.target.value === "true",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="true">With Original</option>
                  <option value="false">Without Original</option>
                </select>
              </div>

              {/* Commentary Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentary
                </label>
                <select
                  value={
                    filters.hasCommentary === null
                      ? "all"
                      : filters.hasCommentary
                  }
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      hasCommentary:
                        e.target.value === "all"
                          ? null
                          : e.target.value === "true",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="true">With Commentary</option>
                  <option value="false">Without Commentary</option>
                </select>
              </div>

              {/* Public Domain Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access
                </label>
                <select
                  value={
                    filters.publicDomain === null ? "all" : filters.publicDomain
                  }
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      publicDomain:
                        e.target.value === "all"
                          ? null
                          : e.target.value === "true",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="true">Public Domain</option>
                  <option value="false">In Copyright</option>
                </select>
              </div>
            </div>

            {/* Translation Languages Filter */}
            {allTranslationLanguages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Translation Languages
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTranslationLanguages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleTranslationLanguage(lang)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        filters.translationLanguages.includes(lang)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                {filters.translationLanguages.length > 0 && (
                  <button
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        translationLanguages: [],
                      }))
                    }
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear language filters
                  </button>
                )}
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Editions List */}
      <div className="space-y-4">
        {filteredEditions.map((edition) => (
          <div
            key={edition.editionId}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4" />
                    Published
                  </div>
                  <div className="text-gray-900">{edition.publishedDate}</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4" />
                    Editor(s)
                  </div>
                  <div className="text-gray-900">
                    {edition.editors.join(", ")}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <FileText className="w-4 h-4" />
                    Manuscripts
                  </div>
                  <div className="text-gray-900 text-sm">
                    {edition.manuscripts.join(", ")}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Publisher
                  </div>
                  <div className="text-gray-900">{edition.publisher}</div>
                  {edition.isbn && (
                    <div className="text-sm text-gray-600 mt-1">
                      ISBN: {edition.isbn}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      edition.hasOriginal
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {edition.hasOriginal ? "✓ Original" : "✗ No Original"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      edition.hasCommentary
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {edition.hasCommentary ? "✓ Commentary" : "✗ No Commentary"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      edition.translationLanguages.length > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {edition.translationLanguages.length > 0
                      ? "✓ Translation"
                      : "✗ No Translation"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      edition.publicDomain
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {edition.publicDomain ? "Public Domain" : "In Copyright"}
                  </span>
                </div>

                {edition.translationLanguages.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Globe className="w-4 h-4" />
                      Translations
                    </div>
                    <div className="text-gray-900 text-sm">
                      {edition.translationLanguages.join(", ")}
                    </div>
                  </div>
                )}

                {edition.reviews.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      Published Reviews
                    </div>
                    <div className="space-y-1">
                      {edition.reviews.map((review, idx) => (
                        <div key={idx}>
                          {review.link ? (
                            <a
                              href={review.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                            >
                              {review.source}{" "}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-sm text-gray-900">
                              {review.source}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  {edition.publisherLink && (
                    <a
                      href={edition.publisherLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Publisher Page <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {edition.pdfLink && (
                    <a
                      href={edition.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      Download PDF <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredEditions.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-600">
              No editions match the selected filters
            </p>
            <button
              onClick={() =>
                setFilters({
                  hasCommentary: null,
                  translationLanguages: [],
                  publicDomain: null,
                  dateRange: [minYear, maxYear],
                })
              }
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TextDetailPage;
