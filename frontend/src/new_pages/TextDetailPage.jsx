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
} from "lucide-react";

import textsData from "../data/texts_new.json";
import editionsData from "../data/editions_new.json";

function TextDetailPage() {
  const { textId } = useParams();
  const text = textsData.find((t) => t.textId === textId);

  const editions = useMemo(
    () => editionsData.filter((e) => e.textId === textId),
    [textId]
  );

  const [showFilters, setShowFilters] = useState(true);
  const [minYear, setMinYear] = useState(1400);
  const [maxYear, setMaxYear] = useState(2025);

  const [filters, setFilters] = useState({
    hasOriginal: null,
    hasCommentary: null,
    hasApparatus: null,
    translationLanguages: [],
    publicDomain: null,
    dateRange: [1400, 2025],
  });

  /* ------------------------------------------
   * Date range from editions
   * ----------------------------------------*/
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

  const allTranslationLanguages = useMemo(() => {
    const s = new Set();
    editions.forEach((e) => e.translationLanguages.forEach((l) => s.add(l)));
    return Array.from(s).sort();
  }, [editions]);

  const filteredEditions = useMemo(() => {
    return editions.filter((e) => {
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

      if (filters.translationLanguages.length) {
        if (
          !filters.translationLanguages.some((l) =>
            e.translationLanguages.includes(l)
          )
        )
          return false;
      }

      const y = parseInt(e.publishedDate);
      if (y < filters.dateRange[0] || y > filters.dateRange[1]) return false;

      return true;
    });
  }, [editions, filters]);

  if (!text) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-lg">Text not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        to="/search"
        className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to search
      </Link>

      {/* Text Header */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-serif mb-1">{text.title}</h1>

        <p className="text-xl text-gray-600">
          {text.titleOriginal}
          {text.titleTransliteration && (
            <span className="italic text-gray-500">
              {" · "}
              {text.titleTransliteration}
            </span>
          )}
        </p>

        {text.alternativeTitles?.length > 0 && (
          <p className="mt-1 text-sm text-gray-500">
            Also known as: {text.alternativeTitles.join(", ")}
          </p>
        )}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
          <div>
            <strong>Author(s):</strong> {text.authors.join(", ")}
          </div>
          <div>
            <strong>Language:</strong> {text.originalLanguage} (
            {text.languageCode})
          </div>
          {text.dialect && (
            <div>
              <strong>Dialect:</strong> {text.dialect}
            </div>
          )}
          {text.meter && (
            <div>
              <strong>Meter:</strong> {text.meter}
            </div>
          )}
          <div>
            <strong>Genre:</strong> {text.genre}
            {text.subgenre?.length > 0 && ` · ${text.subgenre.join(", ")}`}
          </div>
          {text.literaryPeriod && (
            <div>
              <strong>Period:</strong> {text.literaryPeriod}
            </div>
          )}
          {text.date && (
            <div>
              <strong>Date:</strong> ~{text.date}
            </div>
          )}
        </div>

        {text.structure && (
          <div className="mt-4 text-sm text-gray-700">
            <strong>Structure:</strong>{" "}
            {text.structure.books && `${text.structure.books} books`}
            {text.structure.verses && ` · ${text.structure.verses} verses`}
          </div>
        )}

        {text.description && (
          <p className="mt-4 text-gray-700 leading-relaxed">
            {text.description}
          </p>
        )}

        {text.manuscriptTradition && (
          <div className="mt-6 text-sm text-gray-700">
            <h3 className="font-medium text-gray-900 mb-2">
              Manuscript Tradition
            </h3>
            <p>
              <strong>Oldest manuscript:</strong>{" "}
              {text.manuscriptTradition.oldestManuscript}
              {text.manuscriptTradition.oldestManuscriptDate &&
                ` (${text.manuscriptTradition.oldestManuscriptDate})`}
            </p>
            <p>
              <strong>Extent:</strong>{" "}
              {text.manuscriptTradition.numberOfManuscripts}
            </p>
            <p className="mt-1">
              {text.manuscriptTradition.textualTransmission}
            </p>
          </div>
        )}
      </div>

      {/* Editions */}
      <div className="space-y-4">
        {filteredEditions.map((edition) => (
          <div
            key={edition.editionId}
            className="bg-white border rounded-lg p-6"
          >
            <h3 className="text-lg font-medium">{edition.editionTitle}</h3>

            {edition.seriesName && (
              <p className="text-sm text-gray-500">{edition.seriesName}</p>
            )}

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2 text-sm">
                <p>
                  <Calendar className="inline w-4 h-4 mr-1" />
                  {edition.publishedDate}
                </p>
                <p>
                  <User className="inline w-4 h-4 mr-1" />
                  {edition.editors.join(", ")}
                </p>
                <p>
                  <FileText className="inline w-4 h-4 mr-1" />
                  {edition.manuscripts.join(", ")}
                </p>
                <p>
                  <strong>Publisher:</strong> {edition.publisher}
                </p>
                {edition.isbn && (
                  <p className="text-xs text-gray-500">ISBN: {edition.isbn}</p>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  {edition.hasOriginalText
                    ? "✓ Original text"
                    : "✗ No original text"}
                </p>
                <p>
                  {edition.translationLanguages.length
                    ? `✓ Translation (${edition.translationLanguages.join(
                        ", "
                      )})`
                    : "✗ No translation"}
                </p>
                <p>{edition.hasCommentary ? "✓ Commentary" : "✗ Commentary"}</p>
                <p>{edition.hasApparatus ? "✓ Apparatus" : "✗ Apparatus"}</p>
                <p>{edition.publicDomain ? "Public domain" : "In copyright"}</p>

                {edition.publicDomainResource?.length > 0 && (
                  <div className="mt-2">
                    <strong>Online resources:</strong>
                    <ul className="list-disc list-inside">
                      {edition.publicDomainResource.map((r, i) => (
                        <li key={i}>
                          <a
                            href={r.link}
                            target="_blank"
                            className="text-blue-600 hover:underline"
                          >
                            {r.source}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {edition.publisherLink && (
                  <a
                    href={edition.publisherLink}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-blue-600"
                  >
                    Publisher page
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TextDetailPage;
