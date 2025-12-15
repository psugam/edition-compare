// ============================================
// FILE: src/pages/SearchPage.jsx
// ============================================
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

import textsData from "../data/texts_new.json";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 9;

  /* ------------------------------------------
   * Derived data
   * ----------------------------------------*/

  const languages = useMemo(() => {
    return ["all", ...new Set(textsData.map((t) => t.originalLanguage))];
  }, []);

  const sortedTexts = useMemo(() => {
    return [...textsData].sort((a, b) => a.title.localeCompare(b.title));
  }, []);

  const filteredTexts = useMemo(() => {
    const q = searchTerm.toLowerCase();

    const filtered = sortedTexts.filter((text) => {
      const matchesSearch =
        text.title.toLowerCase().includes(q) ||
        text.titleOriginal.toLowerCase().includes(q) ||
        (text.titleTransliteration &&
          text.titleTransliteration.toLowerCase().includes(q)) ||
        text.authors.some((a) => a.toLowerCase().includes(q)) ||
        (text.genre && text.genre.toLowerCase().includes(q)) ||
        (text.literaryPeriod && text.literaryPeriod.toLowerCase().includes(q));

      const matchesLanguage =
        languageFilter === "all" || text.originalLanguage === languageFilter;

      return matchesSearch && matchesLanguage;
    });

    setCurrentPage(1);
    return filtered;
  }, [searchTerm, languageFilter, sortedTexts]);

  /* ------------------------------------------
   * Pagination
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
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  /* ------------------------------------------
   * Render
   * ----------------------------------------*/

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif mb-6">Search Classical Texts</h1>

      {/* Search / Filter */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border rounded px-3 py-2"
                placeholder="Iliad, Politeía, Epic, Archaic…"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Language</label>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l === "all" ? "All languages" : l}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {paginatedTexts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedTexts.map((text) => (
              <Link
                key={text.textId}
                to={`/new-text/${text.textId}`}
                className="bg-white border rounded-lg p-5 hover:shadow transition"
              >
                <BookOpen className="w-5 h-5 text-gray-400 mb-2" />

                <h3 className="font-semibold text-gray-900">{text.title}</h3>

                <p className="text-sm text-gray-600">
                  {text.titleOriginal}
                  {text.titleTransliteration && (
                    <span className="italic text-gray-500">
                      {" · "}
                      {text.titleTransliteration}
                    </span>
                  )}
                </p>

                <div className="mt-2 text-sm text-gray-700">
                  {text.authors.join(", ")}
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  {text.genre}
                  {text.literaryPeriod && ` · ${text.literaryPeriod}`}
                </div>

                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                  <span>
                    {text.originalLanguage} ({text.languageCode})
                  </span>
                  {text.date && <span>~{text.date}</span>}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={i} className="px-2">
                    …
                  </span>
                ) : (
                  <button
                    key={i}
                    onClick={() => goToPage(p)}
                    className={`px-3 py-1 rounded text-sm ${
                      p === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white border rounded-lg p-12 text-center">
          <p className="text-gray-600">No texts match your search</p>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
