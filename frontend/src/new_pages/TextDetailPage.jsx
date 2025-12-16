// ============================================
// FILE: src/pages/TextDetailPage.jsx
// ============================================
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
  Book,
  Award,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from "lucide-react";

import textsData from "../data/texts_new.json";
import editionsData from "../data/editions_new.json";

// --- Helper Components for Filters ---

// A sleek custom multi-select component (simple version)
const MultiSelectFilter = ({ label, options, selected, onChange }) => {
  const isSelected = (option) => selected.includes(option);

  const toggleOption = (option) => {
    if (isSelected(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => toggleOption(option)}
            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
              isSelected(option)
                ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {option}
          </button>
        ))}
        {options.length === 0 && (
          <span className="text-sm text-gray-500 italic">N/A</span>
        )}
      </div>
    </div>
  );
};

// A sleek select component for boolean filters
const FilterSelect = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <select
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
        value={value === null ? "" : value.toString()}
        onChange={(e) =>
          onChange(e.target.value === "" ? null : e.target.value === "true")
        }
      >
        <option value="">Any</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>
  );
};

// --- Main Component ---

function TextDetailPage() {
  const { textId } = useParams();
  const text = textsData.find((t) => t.textId === textId);

  const editions = useMemo(
    () => editionsData.filter((e) => e.textId === textId),
    [textId]
  );

  const [showFilters, setShowFilters] = useState(true);
  const [expandedEditions, setExpandedEditions] = useState({});
  const [minYear, setMinYear] = useState(1400);
  const [maxYear, setMaxYear] = useState(2025);

  const [filters, setFilters] = useState({
    // Existing Filters
    hasOriginal: null,
    hasCommentary: null,
    hasApparatus: null,
    publicDomain: null,
    translationLanguages: [],
    dateRange: [1400, 2025],
    // New Filters
    hasTranslation: null,
    hasNotes: null,
    hasGlossary: null,
    hasIntroduction: null,
    hasBibliography: null,
    inPrint: null,
    completeEdition: null,
    editors: [],
  });

  // Calculate dynamic min/max years and set initial date range filter
  useEffect(() => {
    const years = editions
      .map((e) => parseInt(e.publishedDate))
      .filter(Boolean);
    if (years.length) {
      const min = Math.min(...years);
      const max = Math.max(...years);
      setMinYear(min);
      setMaxYear(max);
      setFilters((f) => ({ ...f, dateRange: [min, max] }));
    }
  }, [editions]);

  // Derive unique lists for multi-select filters
  const allTranslationLanguages = useMemo(() => {
    const s = new Set();
    editions.forEach((e) => e.translationLanguages?.forEach((l) => s.add(l)));
    return Array.from(s).sort();
  }, [editions]);

  const allEditors = useMemo(() => {
    const s = new Set();
    editions.forEach((e) => e.editors?.forEach((l) => s.add(l)));
    return Array.from(s).sort();
  }, [editions]);

  // Update dateRange in filters when the slider/input values change
  const handleDateRangeChange = (index, value) => {
    const newRange = [...filters.dateRange];
    // Ensure value is within the overall min/max bounds
    const year = Math.max(minYear, Math.min(maxYear, parseInt(value) || 0));
    newRange[index] = year;

    // Ensure min <= max
    if (newRange[0] > newRange[1]) {
      // Swap if min is set higher than max, or vice-versa
      newRange[index === 0 ? 1 : 0] = newRange[index];
    }

    setFilters((f) => ({ ...f, dateRange: newRange }));
  };

  // Main Filtering Logic
  const filteredEditions = useMemo(() => {
    return editions.filter((e) => {
      // Date Range Filter
      const y = parseInt(e.publishedDate);
      if (y < filters.dateRange[0] || y > filters.dateRange[1]) return false;

      // Simple Boolean Filters
      if (
        filters.hasOriginal !== null &&
        e.hasOriginalText !== filters.hasOriginal
      )
        return false;
      if (
        filters.hasCommentary !== null &&
        e.hasCommentary !== filters.hasCommentary
      )
        return false;
      if (
        filters.hasApparatus !== null &&
        e.hasApparatus !== filters.hasApparatus
      )
        return false;
      if (
        filters.publicDomain !== null &&
        e.publicDomain !== filters.publicDomain
      )
        return false;

      // NEW BOOLEAN FILTERS
      if (
        filters.hasTranslation !== null &&
        e.hasTranslation !== filters.hasTranslation
      )
        return false;
      if (filters.hasNotes !== null && e.hasNotes !== filters.hasNotes)
        return false;
      if (filters.hasGlossary !== null && e.hasGlossary !== filters.hasGlossary)
        return false;
      if (
        filters.hasIntroduction !== null &&
        e.hasIntroduction !== filters.hasIntroduction
      )
        return false;
      if (
        filters.hasBibliography !== null &&
        e.hasBibliography !== filters.hasBibliography
      )
        return false;
      if (filters.inPrint !== null && e.inPrint !== filters.inPrint)
        return false;
      if (
        filters.completeEdition !== null &&
        e.completeEdition !== filters.completeEdition
      )
        return false;

      // Multiselect: Translation Languages (must include AT LEAST one selected language)
      if (filters.translationLanguages.length) {
        if (
          !filters.translationLanguages.some((l) =>
            e.translationLanguages?.includes(l)
          )
        )
          return false;
      }

      // Multiselect: Editors (must include AT LEAST one selected editor)
      if (filters.editors.length) {
        if (!filters.editors.some((l) => e.editors?.includes(l))) return false;
      }

      return true;
    });
  }, [editions, filters]);

  const toggleEdition = (editionId) => {
    setExpandedEditions((prev) => ({
      ...prev,
      [editionId]: !prev[editionId],
    }));
  };

  const FeatureIcon = ({ has }) =>
    has ? (
      <Check className="w-4 h-4 text-green-600" />
    ) : (
      <X className="w-4 h-4 text-gray-400" />
    );

  // Function to reset all filters
  const resetFilters = () => {
    setFilters({
      hasOriginal: null,
      hasCommentary: null,
      hasApparatus: null,
      publicDomain: null,
      translationLanguages: [],
      dateRange: [minYear, maxYear],
      hasTranslation: null,
      hasNotes: null,
      hasGlossary: null,
      hasIntroduction: null,
      hasBibliography: null,
      inPrint: null,
      completeEdition: null,
      editors: [],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-sans">
      <Link
        to="/"
        className="inline-flex items-center gap-2 mb-8 text-indigo-600 hover:text-indigo-800 font-medium transition duration-150"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to search
      </Link>

      {/* Text Header - Sleek Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-lg">
        <h1 className="text-4xl font-serif text-gray-900 mb-2 font-bold">
          {text.title}
        </h1>

        <div className="text-2xl text-gray-600 mb-1 font-serif">
          {text.titleOriginal}
          {text.titleTransliteration && (
            <span className="italic text-gray-500 ml-3 text-xl">
              {text.titleTransliteration}
            </span>
          )}
        </div>

        {text.alternativeTitles?.length > 0 && (
          <p className="text-sm text-gray-500 mb-4 mt-2">
            Also known as: {text.alternativeTitles.join(", ")}
          </p>
        )}

        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-6 text-sm">
            {/* Author */}
            <div>
              <span className="font-semibold text-gray-700 block">
                Author(s):
              </span>
              <div className="mt-1 text-gray-900">
                {text.authors.join(", ")}
              </div>
              {text.authorsOriginal && (
                <div className="text-gray-500 text-xs">
                  {text.authorsOriginal.join(", ")}
                </div>
              )}
            </div>

            {/* Language */}
            <div>
              <span className="font-semibold text-gray-700 block">
                Language:
              </span>
              <div className="mt-1 text-gray-900">
                {text.originalLanguage} ({text.languageCode})
              </div>
              {text.dialect && (
                <div className="text-gray-600 text-xs">{text.dialect}</div>
              )}
            </div>

            {/* Genre */}
            <div>
              <span className="font-semibold text-gray-700 block">Genre:</span>
              <div className="mt-1 text-gray-900">{text.genre}</div>
              {text.subgenre?.length > 0 && (
                <div className="text-gray-600 text-xs">
                  {text.subgenre.join(", ")}
                </div>
              )}
            </div>

            {/* Date */}
            {text.date && (
              <div>
                <span className="font-semibold text-gray-700 block">Date:</span>
                <div className="mt-1 text-gray-900">~{text.date}</div>
              </div>
            )}

            {/* Literary Period */}
            {text.literaryPeriod && (
              <div>
                <span className="font-semibold text-gray-700 block">
                  Period:
                </span>
                <div className="mt-1 text-gray-900">{text.literaryPeriod}</div>
              </div>
            )}

            {/* Meter */}
            {text.meter && (
              <div>
                <span className="font-semibold text-gray-700 block">
                  Meter:
                </span>
                <div className="mt-1 text-gray-900">{text.meter}</div>
              </div>
            )}

            {/* Structure */}
            {text.structure && (
              <div className="col-span-2">
                <span className="font-semibold text-gray-700 block">
                  Structure:
                </span>
                <div className="mt-1 text-gray-900">
                  {text.structure.books && `${text.structure.books} books`}
                  {text.structure.verses &&
                    ` · ${text.structure.verses} verses`}
                  {text.structure.lines &&
                    text.structure.lines !== text.structure.verses &&
                    ` · ${text.structure.lines} lines`}
                  {text.structure.chapters &&
                    ` · ${text.structure.chapters} chapters`}
                </div>
              </div>
            )}
          </div>
        </div>

        {text.description && (
          <p className="mt-6 pt-6 border-t border-gray-200 text-gray-700 leading-relaxed text-base">
            {text.description}
          </p>
        )}

        {/* Manuscript Tradition and First Printed Edition in a single section */}
        {(text.manuscriptTradition || text.firstPrintedEdition) && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-xl text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Textual History
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {text.manuscriptTradition && (
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    Manuscript Tradition
                  </h4>
                  <div className="space-y-2">
                    <div className="text-gray-700">
                      <span className="font-medium text-gray-900">
                        Oldest manuscript:
                      </span>
                      <span className="ml-2">
                        {text.manuscriptTradition.oldestManuscript}
                      </span>
                      {text.manuscriptTradition.oldestManuscriptDate && (
                        <span className="text-gray-500 text-xs ml-2">
                          ({text.manuscriptTradition.oldestManuscriptDate})
                        </span>
                      )}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium text-gray-900">
                        Number of manuscripts:
                      </span>
                      <span className="ml-2">
                        {text.manuscriptTradition.numberOfManuscripts}
                      </span>
                    </div>
                    {text.manuscriptTradition.textualTransmission && (
                      <p className="mt-2 text-gray-600 leading-relaxed italic">
                        {text.manuscriptTradition.textualTransmission}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {text.firstPrintedEdition && (
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    First Printed Edition
                  </h4>
                  <div className="space-y-2">
                    <div className="text-gray-700">
                      <span className="font-medium text-gray-900">Year:</span>
                      <span className="ml-2">
                        {text.firstPrintedEdition.year}
                      </span>
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium text-gray-900">
                        Location:
                      </span>
                      <span className="ml-2">
                        {text.firstPrintedEdition.location || "N/A"}
                      </span>
                    </div>
                    <div className="text-gray-700">
                      <span className="font-medium text-gray-900">Editor:</span>
                      <span className="ml-2">
                        {text.firstPrintedEdition.editor || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filters Section - Modern Accordion Style */}
      <div className="mb-8">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold text-lg py-2 transition duration-150"
        >
          <Filter className="w-5 h-5" />
          {showFilters ? "Hide" : "Show"} Edition Filters (
          {filteredEditions.length} of {editions.length})
          {showFilters ? (
            <ChevronUp className="w-5 h-5 ml-1" />
          ) : (
            <ChevronDown className="w-5 h-5 ml-1" />
          )}
        </button>

        <button
          onClick={resetFilters}
          className="ml-4 text-sm text-gray-500 hover:text-gray-700 transition duration-150"
        >
          (Reset Filters)
        </button>

        {showFilters && (
          <div className="mt-4 bg-white border border-gray-200 rounded-xl p-6 shadow-lg space-y-6">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                Publication Date Range
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min={minYear}
                  max={maxYear}
                  value={filters.dateRange[0]}
                  onChange={(e) => handleDateRangeChange(0, e.target.value)}
                  className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-center focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="text-gray-500 text-lg">–</span>
                <input
                  type="number"
                  min={minYear}
                  max={maxYear}
                  value={filters.dateRange[1]}
                  onChange={(e) => handleDateRangeChange(1, e.target.value)}
                  className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-center focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="text-sm text-gray-500 ml-4">
                  ({minYear} - {maxYear})
                </span>
              </div>
            </div>

            {/* Boolean Filters (Features) Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 border-t pt-4">
              <FilterSelect
                label="Original Text"
                value={filters.hasOriginal}
                onChange={(v) => setFilters({ ...filters, hasOriginal: v })}
              />
              <FilterSelect
                label="Translation"
                value={filters.hasTranslation}
                onChange={(v) => setFilters({ ...filters, hasTranslation: v })}
              />
              <FilterSelect
                label="Commentary"
                value={filters.hasCommentary}
                onChange={(v) => setFilters({ ...filters, hasCommentary: v })}
              />
              <FilterSelect
                label="Apparatus"
                value={filters.hasApparatus}
                onChange={(v) => setFilters({ ...filters, hasApparatus: v })}
              />
              <FilterSelect
                label="Notes"
                value={filters.hasNotes}
                onChange={(v) => setFilters({ ...filters, hasNotes: v })}
              />
              <FilterSelect
                label="Glossary"
                value={filters.hasGlossary}
                onChange={(v) => setFilters({ ...filters, hasGlossary: v })}
              />
              <FilterSelect
                label="Introduction"
                value={filters.hasIntroduction}
                onChange={(v) => setFilters({ ...filters, hasIntroduction: v })}
              />
              <FilterSelect
                label="Bibliography"
                value={filters.hasBibliography}
                onChange={(v) => setFilters({ ...filters, hasBibliography: v })}
              />
            </div>

            {/* Boolean Filters (Status) Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4">
              <FilterSelect
                label="Public Domain"
                value={filters.publicDomain}
                onChange={(v) => setFilters({ ...filters, publicDomain: v })}
              />
              <FilterSelect
                label="In Print"
                value={filters.inPrint}
                onChange={(v) => setFilters({ ...filters, inPrint: v })}
              />
              <FilterSelect
                label="Complete Edition"
                value={filters.completeEdition}
                onChange={(v) => setFilters({ ...filters, completeEdition: v })}
              />
            </div>

            {/* Multi-select Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
              <MultiSelectFilter
                label="Translation Languages"
                options={allTranslationLanguages}
                selected={filters.translationLanguages}
                onChange={(v) =>
                  setFilters({ ...filters, translationLanguages: v })
                }
              />
              <MultiSelectFilter
                label="Editor(s)"
                options={allEditors}
                selected={filters.editors}
                onChange={(v) => setFilters({ ...filters, editors: v })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Editions List */}
      <div className="mb-4">
        <h2 className="text-3xl font-serif text-gray-900 mb-6">
          Available Editions
        </h2>
      </div>

      <div className="space-y-5">
        {filteredEditions.map((edition) => (
          <div
            key={edition.editionId}
            className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {edition.editionTitle}
                  </h3>
                  {edition.seriesName && (
                    <p className="text-sm text-indigo-600 font-medium">
                      {edition.seriesName}
                      {edition.seriesNumber && ` #${edition.seriesNumber}`}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleEdition(edition.editionId)}
                  className="text-gray-500 hover:text-indigo-600 ml-4 p-2 rounded-full hover:bg-indigo-50 transition"
                >
                  {expandedEditions[edition.editionId] ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm border-t pt-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-700">Published</div>
                    <div className="text-gray-900">{edition.publishedDate}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-700">Editor(s)</div>
                    <div
                      className="text-gray-900 truncate"
                      title={edition.editors.join(", ")}
                    >
                      {edition.editors.join(", ")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Book className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-700">Publisher</div>
                    <div
                      className="text-gray-900 truncate"
                      title={edition.publisher}
                    >
                      {edition.publisher}
                    </div>
                  </div>
                </div>

                {edition.translators?.length > 0 && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-700">
                        Translator(s)
                      </div>
                      <div
                        className="text-gray-900 truncate"
                        title={edition.translators.join(", ")}
                      >
                        {edition.translators.join(", ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Features Grid */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-x-4 gap-y-2 text-sm">
                  {[
                    { label: "Original Text", has: edition.hasOriginalText },
                    { label: "Translation", has: edition.hasTranslation },
                    { label: "Commentary", has: edition.hasCommentary },
                    { label: "Apparatus", has: edition.hasApparatus },
                    { label: "Notes", has: edition.hasNotes },
                    { label: "Glossary", has: edition.hasGlossary },
                    { label: "Introduction", has: edition.hasIntroduction },
                    { label: "Bibliography", has: edition.hasBibliography },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 text-gray-700"
                    >
                      <FeatureIcon has={feature.has} />
                      <span
                        className={
                          feature.has ? "font-medium" : "text-gray-500"
                        }
                      >
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Translation Languages and Status badges */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4">
                {edition.translationLanguages?.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">
                      Translations:
                    </span>
                    <span className="text-gray-600">
                      {edition.translationLanguages.join(", ")}
                    </span>
                  </div>
                )}

                {/* Status badges */}
                <div className="flex flex-wrap gap-2">
                  {edition.publicDomain && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Public Domain
                    </span>
                  )}
                  {edition.inPrint && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      In Print
                    </span>
                  )}
                  {edition.completeEdition && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                      Complete Edition
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedEditions[edition.editionId] && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-5">
                  {/* Manuscripts */}
                  {edition.manuscripts?.length > 0 && (
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900 mb-1">
                        Manuscripts Used:
                      </div>
                      <div className="text-gray-700 leading-relaxed">
                        {edition.manuscripts.join(", ")}
                      </div>
                    </div>
                  )}

                  {/* Translators (if not already shown in header) */}
                  {/* Already shown in header if translators exist, so no need to repeat. */}

                  {/* ISBN */}
                  {edition.isbn && (
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">ISBN:</span>
                      <span className="text-gray-700 ml-2">{edition.isbn}</span>
                    </div>
                  )}

                  {/* Public Domain Resources */}
                  {edition.publicDomainResource?.length > 0 && (
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900 mb-2">
                        Online Resources:
                      </div>
                      <ul className="space-y-1">
                        {edition.publicDomainResource.map((r, i) => (
                          <li key={i}>
                            <a
                              href={r.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 transition duration-150"
                            >
                              {r.source}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Reviews */}
                  {edition.reviews?.length > 0 && (
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Award className="w-4 h-4 text-indigo-500" />
                        Reviews:
                      </div>
                      <ul className="space-y-1">
                        {edition.reviews.map((r, i) => (
                          <li key={i}>
                            <a
                              href={r.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 transition duration-150"
                            >
                              {r.source}
                              {r.reviewer && ` (${r.reviewer})`}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Remarks */}
                  {edition.remarks && (
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900 mb-1">
                        Remarks:
                      </div>
                      <div className="text-gray-700 leading-relaxed italic border-l-2 border-indigo-200 pl-3 py-1">
                        {edition.remarks}
                      </div>
                    </div>
                  )}

                  {/* Publisher Link */}
                  {edition.publisherLink && (
                    <div>
                      <a
                        href={edition.publisherLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-medium transition duration-150"
                      >
                        View on publisher's website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredEditions.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500 shadow-md">
            <Filter className="w-8 h-8 mx-auto mb-3" />
            <p className="text-lg font-medium">
              No editions match your current filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition duration-150"
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
