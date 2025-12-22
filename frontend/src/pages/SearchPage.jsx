import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Feather,
  LayoutGrid,
  Zap,
  Calendar,
  Loader2,
} from "lucide-react";
import api from "../utils/axiosInstance";

const ITEMS_PER_PAGE = 9;

function SearchPage() {
  // Data States
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Filter & Search States
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [languageFilter, setLanguageFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [dataQualityFilter, setDataQualityFilter] = useState("all");
  const [minDateFilter, setMinDateFilter] = useState("");
  const [maxDateFilter, setMaxDateFilter] = useState("");

  // Options State (Metadata from server)
  const [languageOptions, setLanguageOptions] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);
  const [dataQualityOptions, setDataQualityOptions] = useState([]);
  const [dateRange, setDateRange] = useState({ min: null, max: null });

  // 1. Fetch filter options once on mount
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await api.get("/api/texts/filter-options");
        setLanguageOptions(response.data.languages || []);
        setGenreOptions(response.data.genres || []);
        setDataQualityOptions(response.data.qualities || []);
        if (response.data.dateRange) {
          setDateRange(response.data.dateRange);
          // FIX: Do NOT set minDateFilter/maxDateFilter here.
          // Keeping them empty allows the "All" view to show all records.
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchFilterOptions();
  }, []);

  // 2. Main Data Fetching Logic
  // Using useCallback to prevent unnecessary re-renders
  const fetchTexts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });

      if (searchTerm) params.append("q", searchTerm);
      if (languageFilter !== "all") params.append("language", languageFilter);
      if (genreFilter !== "all") params.append("genre", genreFilter);
      if (dataQualityFilter !== "all")
        params.append("quality", dataQualityFilter);
      if (minDateFilter !== "") params.append("minDate", minDateFilter);
      if (maxDateFilter !== "") params.append("maxDate", maxDateFilter);

      const response = await api.get(`/api/texts?${params.toString()}`);
      setTexts(response.data.texts || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching texts:", error);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    languageFilter,
    genreFilter,
    dataQualityFilter,
    minDateFilter,
    maxDateFilter,
  ]);

  useEffect(() => {
    fetchTexts();
  }, [fetchTexts]);

  /* ------------------------------------------
   * Handlers (Resetting page to 1 on filter change)
   * ----------------------------------------*/
  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleFilterChange = (setter, value) => {
    setCurrentPage(1);
    setter(value);
  };

  const resetFilters = () => {
    setInputValue("");
    setSearchTerm("");
    setLanguageFilter("all");
    setGenreFilter("all");
    setDataQualityFilter("all");
    setMinDateFilter("");
    setMaxDateFilter("");
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ------------------------------------------
   * Pagination Helper
   * ----------------------------------------*/
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      if (totalPages > 1) pages.push(totalPages);
    }
    return [...new Set(pages)]; // Remove duplicates
  };

  /* ------------------------------------------
   * Sub-Components
   * ----------------------------------------*/
  const FilterSelect = ({ label, icon, value, onChange, options }) => (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
        {icon}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => handleFilterChange(onChange, e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-indigo-500 transition appearance-none bg-white"
      >
        <option value="all">All {label}s</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans">
      <h1 className="text-4xl font-serif text-gray-900 mb-8 font-bold">
        Classical Texts Search
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-lg">
        {/* Search Bar Row */}
        <div className="flex flex-col lg:flex-row justify-between items-end gap-4 mb-6 pb-6 border-b">
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Library
            </label>
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-12 w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-indigo-500 transition"
                placeholder="Title, Author, or Keyword..."
              />
              <button
                onClick={handleSearch}
                className="ml-3 px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-md"
              >
                Search
              </button>
            </div>
          </div>
          <button
            onClick={resetFilters}
            className="flex items-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition shadow-md whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset All</span>
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FilterSelect
            label="Language"
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
            label="Quality"
            icon={<Zap className="w-4 h-4 text-indigo-500" />}
            value={dataQualityFilter}
            onChange={setDataQualityFilter}
            options={dataQualityOptions}
          />
          <div className="col-span-1">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              Date Range
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="From"
                value={minDateFilter}
                onChange={(e) =>
                  handleFilterChange(setMinDateFilter, e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
              />
              <span className="text-gray-400">→</span>
              <input
                type="number"
                placeholder="To"
                value={maxDateFilter}
                onChange={(e) =>
                  handleFilterChange(setMaxDateFilter, e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <h2 className="text-2xl font-serif text-gray-800 mb-6">
        {loading
          ? "Loading library..."
          : `${texts.length} Result${texts.length !== 1 ? "s" : ""} Found`}
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">
            Fetching classical records...
          </p>
        </div>
      ) : texts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {texts.map((text) => (
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
                  </p>
                  <div className="space-y-1 text-sm text-gray-700 mb-3">
                    <div className="flex items-center gap-2">
                      <Feather className="w-4 h-4 text-gray-500" />
                      <span>{text.originalLanguage}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="w-4 h-4 text-gray-500" />
                      <span className="truncate">
                        {text.genre}{" "}
                        {text.literaryPeriod && `· ${text.literaryPeriod}`}
                      </span>
                    </div>
                  </div>
                  {text.description && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-snug">
                      {text.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between items-center text-sm">
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
                  <span className="text-indigo-600 font-medium">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${p}`}
                    onClick={() => goToPage(p)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      p === currentPage
                        ? "bg-indigo-600 text-white"
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
                className="p-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center shadow-md">
          <Search className="w-8 h-8 mx-auto mb-3 text-gray-400" />
          <p className="text-xl font-medium text-gray-700">No texts found.</p>
          <p className="text-gray-500 mt-2">
            Adjust your search or clear filters to see more.
          </p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
