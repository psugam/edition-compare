// ============================================
// FILE: src/pages/SearchPage.jsx
// ============================================
import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  Feather,
  LayoutGrid,
  Zap,
  Calendar,
  Loader2, // Added for loading state
} from "lucide-react";

// 1. Updated Imports
import api from "../utils/axiosInstance";

function SearchPage() {
  // 2. New Data States
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter States
  const [languageFilter, setLanguageFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [dataQualityFilter, setDataQualityFilter] = useState("all");
  const [minDateFilter, setMinDateFilter] = useState(null);
  const [maxDateFilter, setMaxDateFilter] = useState(null);

  const ITEMS_PER_PAGE = 9;

  // 3. Fetch Data from Backend
  useEffect(() => {
    const fetchTexts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/texts");
        // Assuming your backend returns the array directly or in a .data property
        setTexts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching texts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTexts();
  }, []);

  /* ------------------------------------------
   * Derived data and Filter Options
   * ----------------------------------------*/

  const sortedTexts = useMemo(() => {
    return [...texts].sort((a, b) => a.title.localeCompare(b.title));
  }, [texts]); // Dependency updated to texts

  // Calculate unique filter options
  const languageOptions = useMemo(() => {
    return [...new Set(texts.map((t) => t.originalLanguage))].sort();
  }, [texts]);

  const genreOptions = useMemo(() => {
    return [...new Set(texts.map((t) => t.genre).filter(Boolean))].sort();
  }, [texts]);

  const dataQualityOptions = useMemo(() => {
    return [...new Set(texts.map((t) => t.dataQuality).filter(Boolean))].sort();
  }, [texts]);

  const dateRange = useMemo(() => {
    const dates = texts
      .map((t) => t.dateNumeric)
      .filter((d) => typeof d === "number");
    if (dates.length === 0) return { min: null, max: null };
    return { min: Math.min(...dates), max: Math.max(...dates) };
  }, [texts]);

  // Set initial date filter bounds based on data
  useEffect(() => {
    if (dateRange.min !== null) {
      setMinDateFilter(dateRange.min);
    }
    if (dateRange.max !== null) {
      setMaxDateFilter(dateRange.max);
    }
  }, [dateRange]);

  /* ------------------------------------------
   * Reset Feature
   * ----------------------------------------*/
  const resetFilters = () => {
    setSearchTerm("");
    setLanguageFilter("all");
    setGenreFilter("all");
    setDataQualityFilter("all");
    setMinDateFilter(dateRange.min);
    setMaxDateFilter(dateRange.max);
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ------------------------------------------
   * Filtering Logic
   * ----------------------------------------*/

  const filteredTexts = useMemo(() => {
    const q = searchTerm.toLowerCase();

    return sortedTexts.filter((text) => {
      const matchesSearch =
        text.title.toLowerCase().includes(q) ||
        text.titleOriginal.toLowerCase().includes(q) ||
        (text.titleTransliteration &&
          text.titleTransliteration.toLowerCase().includes(q)) ||
        text.authors.some((a) => a.toLowerCase().includes(q)) ||
        (text.genre && text.genre.toLowerCase().includes(q)) ||
        (text.literaryPeriod && text.literaryPeriod.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (languageFilter !== "all" && text.originalLanguage !== languageFilter)
        return false;

      if (genreFilter !== "all" && text.genre !== genreFilter) return false;

      if (dataQualityFilter !== "all" && text.dataQuality !== dataQualityFilter)
        return false;

      const currentMin = minDateFilter === null ? dateRange.min : minDateFilter;
      const currentMax = maxDateFilter === null ? dateRange.max : maxDateFilter;

      if (
        typeof text.dateNumeric === "number" &&
        currentMin !== null &&
        currentMax !== null
      ) {
        if (text.dateNumeric < currentMin || text.dateNumeric > currentMax)
          return false;
      }

      return true;
    });
  }, [
    searchTerm,
    languageFilter,
    genreFilter,
    dataQualityFilter,
    minDateFilter,
    maxDateFilter,
    sortedTexts,
    dateRange,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    languageFilter,
    genreFilter,
    dataQualityFilter,
    minDateFilter,
    maxDateFilter,
  ]);

  /* ------------------------------------------
   * Pagination Logic
   * ----------------------------------------*/

  const totalPages = Math.ceil(filteredTexts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTexts = filteredTexts.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const max = 5;

    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) pages.push("...");

      if (totalPages > 1) {
        if (pages[pages.length - 1] !== totalPages) {
          pages.push(totalPages);
        }
      }
    }
    return pages.filter((p, i, self) => i === 0 || p !== self[i - 1]);
  };

  /* ------------------------------------------
   * Render Components
   * ----------------------------------------*/

  const FilterSelect = ({ label, icon, value, onChange, options }) => (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        {icon}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out appearance-none"
      >
        <option value="all">All {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );

  const DateInput = ({ label, value, onChange }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      <input
        type="number"
        min={dateRange.min}
        max={dateRange.max}
        value={value === null ? "" : value}
        onChange={(e) => {
          const numValue = parseInt(e.target.value);
          if (e.target.value === "") {
            onChange(null);
          } else if (!isNaN(numValue)) {
            onChange(numValue);
          }
        }}
        className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-indigo-500 focus:border-indigo-500"
        placeholder={label}
      />
    </div>
  );

  /* ------------------------------------------
   * Main Render
   * ----------------------------------------*/

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans">
      <h1 className="text-4xl font-serif text-gray-900 mb-8 font-bold">
        Classical Texts Search
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex justify-between items-end mb-6 pb-6 border-b border-gray-200">
          <div className="flex-1 mr-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search by Title, Author, or Keyword
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                placeholder="e.g., Iliad, Plato, Epic, Roman History..."
              />
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition duration-150 shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FilterSelect
            label="Original Language"
            icon={<Feather className="w-4 h-4 text-indigo-500" />}
            value={languageFilter}
            onChange={setLanguageFilter}
            options={languageOptions}
          />

          <FilterSelect
            label="Genre"
            icon={<LayoutGrid className="w-4 h-4 text-indigo-500" />}
            value={genreFilter}
            onChange={setGenreFilter}
            options={genreOptions}
          />

          <FilterSelect
            label="Data Quality"
            icon={<Zap className="w-4 h-4 text-indigo-500" />}
            value={dataQualityFilter}
            onChange={setDataQualityFilter}
            options={dataQualityOptions}
          />

          <div className="col-span-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Date Range (Approx. Year BCE/CE)
            </label>
            <div className="flex items-center space-x-2">
              <DateInput
                label={`Min (${dateRange.min || "N/A"})`}
                value={minDateFilter}
                onChange={setMinDateFilter}
              />
              <span className="text-gray-500 text-lg">→</span>
              <DateInput
                label={`Max (${dateRange.max || "N/A"})`}
                value={maxDateFilter}
                onChange={setMaxDateFilter}
              />
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-serif text-gray-800 mb-6">
        {loading
          ? "Loading library..."
          : `${filteredTexts.length} ${
              filteredTexts.length === 1 ? "Text" : "Texts"
            } Found`}
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">
            Fetching classical records...
          </p>
        </div>
      ) : paginatedTexts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTexts.map((text) => (
              <Link
                key={text.textId}
                to={`/text/${text.textId}`}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 transform hover:scale-[1.01] flex flex-col justify-between"
              >
                <div>
                  <BookOpen className="w-6 h-6 text-indigo-500 mb-3" />

                  <h3 className="text-xl font-semibold text-gray-900 mb-1 font-serif">
                    {text.title}
                  </h3>

                  <p className="text-sm text-gray-600 italic mb-3">
                    {text.titleOriginal}
                    {text.titleTransliteration && (
                      <span className="text-gray-400 ml-2">
                        {" | "}
                        {text.titleTransliteration}
                      </span>
                    )}
                  </p>

                  <div className="space-y-1 text-sm text-gray-700 mb-3">
                    <div className="flex items-center gap-2">
                      <Feather className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{text.originalLanguage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">
                        {text.genre}
                        {text.literaryPeriod && ` · ${text.literaryPeriod}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">Approx. {text.date}</span>
                    </div>
                  </div>

                  {text.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-snug">
                      {text.description}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      text.dataQuality === "high"
                        ? "bg-green-100 text-green-700"
                        : text.dataQuality === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    Quality: {text.dataQuality}
                  </span>
                  <span className="text-indigo-600 font-medium hover:text-indigo-800 transition duration-150">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-1 mt-10">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={i} className="px-3 py-2 text-sm text-gray-500">
                    …
                  </span>
                ) : (
                  <button
                    key={i}
                    onClick={() => goToPage(p)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      p === currentPage
                        ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-md">
          <Search className="w-8 h-8 mx-auto mb-3 text-gray-400" />
          <p className="text-xl font-medium text-gray-700">
            No texts found matching your current filters.
          </p>
          <p className="text-gray-500 mt-2">
            Try adjusting your search term or filters.
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
