import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Check, X, Filter, RefreshCw, BookOpen, Globe } from "lucide-react";
import api from "../utils/axiosInstance";

const DetailItem = ({ label, value, isLink = false, to = "#" }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;

  const renderValue = () => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (isLink) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-600 hover:underline"
        >
          {value}
        </a>
      );
    }
    return value;
  };

  return (
    <div className="py-2">
      <p className="text-xs text-gray-500 uppercase font-semibold">{label}</p>
      <p className="text-md text-gray-800">{renderValue()}</p>
    </div>
  );
};

const EditionCard = ({ edition }) => {
  const features = [
    { label: "Original Text", value: edition.hasOriginalText },
    { label: "Translation", value: edition.hasTranslation },
    { label: "Facing Translation", value: edition.hasFacingTranslation },
    { label: "Commentary", value: edition.hasCommentary },
    { label: "Apparatus", value: edition.hasApparatus },
    { label: "Introduction", value: edition.hasIntroduction },
    { label: "Glossary", value: edition.hasGlossary },
    { label: "Bibliography", value: edition.hasBibliography },
    { label: "Public Domain", value: edition.publicDomain },
    { label: "Open Access", value: edition.openAccess },
  ];

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <h4 className="font-bold text-lg text-emerald-800">
        {edition.editionTitle}
      </h4>
      {edition.editionSubtitle && (
        <p className="text-sm italic text-gray-600 -mt-1">
          {edition.editionSubtitle}
        </p>
      )}
      <p className="text-sm text-gray-500 mt-1">
        by {edition.editors.join(", ")} ({edition.publishedDate})
      </p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <DetailItem label="Publisher" value={edition.publisher} />
        <DetailItem label="ISBN" value={edition.isbn} />
        <DetailItem label="Page Count" value={edition.pageCount} />
        <DetailItem label="Translation Type" value={edition.translationType} />
        <DetailItem
          label="Commentary Length"
          value={edition.commentaryLength}
        />
        <DetailItem label="License" value={edition.license} />
      </div>

      <div className="mt-3 pt-3 border-t">
        <h5 className="text-xs font-semibold uppercase text-gray-500 mb-2">
          Features
        </h5>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {features.map((feat) => (
            <div key={feat.label} className="flex items-center text-sm">
              {feat.value ? (
                <Check className="w-4 h-4 text-green-600 mr-1 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-red-500 mr-1 flex-shrink-0" />
              )}
              <span className="text-gray-700">{feat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {edition.publicDomainResource?.length > 0 &&
        edition.publicDomainResource[0].link && (
          <div className="mt-3">
            <a
              href={edition.publicDomainResource[0].link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-600 hover:underline font-medium"
            >
              View Public Domain Resource
            </a>
          </div>
        )}
    </div>
  );
};

const TextDetailPage = () => {
  const { textId } = useParams();
  const [text, setText] = useState(null);
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    searchTerm: "",
    hasTranslation: "all",
    hasCommentary: "all",
    publicDomain: "all",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchTextAndEditions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch text details and related editions in parallel
        const [textResponse, editionsResponse] = await Promise.all([
          api.get(`/api/texts/${textId}`),
          api.get(`/api/editions/text/${textId}`),
        ]);

        if (textResponse.data) {
          setText(textResponse.data);
          setEditions(editionsResponse.data || []); // Ensure editions is an array
        } else {
          setError("Text not found.");
        }
      } catch (err) {
        const message = err.response?.data?.message || "Failed to fetch data.";
        setError(message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTextAndEditions();
  }, [textId]);

  const filteredEditions = useMemo(() => {
    return editions.filter((edition) => {
      const searchTermLower = filters.searchTerm.toLowerCase();
      if (
        filters.searchTerm &&
        !edition.editionTitle.toLowerCase().includes(searchTermLower) &&
        !edition.editors.some((e) => e.toLowerCase().includes(searchTermLower))
      ) {
        return false;
      }

      if (
        filters.hasTranslation !== "all" &&
        String(edition.hasTranslation) !== filters.hasTranslation
      ) {
        return false;
      }
      if (
        filters.hasCommentary !== "all" &&
        String(edition.hasCommentary) !== filters.hasCommentary
      ) {
        return false;
      }
      if (
        filters.publicDomain !== "all" &&
        String(edition.publicDomain) !== filters.publicDomain
      ) {
        return false;
      }

      return true;
    });
  }, [editions, filters]);

  if (loading) {
    return <div className="text-center p-10">Loading text details...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!text) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 my-8">
      <header className="border-b pb-4 mb-6">
        <h1 className="text-4xl font-bold text-gray-800">{text.title}</h1>
        <p className="text-xl text-gray-600 italic">
          {text.titleOriginal} ({text.titleTransliteration})
        </p>
        {text.alternativeTitles?.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            Also known as: {text.alternativeTitles.join(", ")}
          </p>
        )}
      </header>

      <main className="space-y-8">
        {/* Description & Core Details */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-lg text-gray-700 leading-relaxed">
            {text.description}
          </p>

          <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Authorship */}
            <div>
              <h3 className="font-bold text-emerald-700 mb-2">Authorship</h3>
              <DetailItem label="Authors" value={text.authors} />
              <DetailItem
                label="Original Author(s)"
                value={text.authorsOriginal}
              />
              <DetailItem
                label="Attributed Authors"
                value={text.attributedAuthors}
              />
            </div>

            {/* Language & Origin */}
            <div>
              <h3 className="font-bold text-emerald-700 mb-2">
                Language & Origin
              </h3>
              <DetailItem
                label="Original Language"
                value={text.originalLanguage}
              />
              <DetailItem label="Language Code" value={text.languageCode} />
              <DetailItem label="Dialect" value={text.dialect} />
              <DetailItem label="Date" value={text.date} />
              <DetailItem
                label="Date Uncertainty"
                value={text.dateUncertainty}
              />
            </div>

            {/* Classification */}
            <div>
              <h3 className="font-bold text-emerald-700 mb-2">
                Classification
              </h3>
              <DetailItem label="Genre" value={text.genre} />
              <DetailItem label="Subgenre" value={text.subgenre} />
              <DetailItem label="Literary Period" value={text.literaryPeriod} />
              <DetailItem label="Part of Series" value={text.partOfSeries} />
            </div>

            {/* Structure */}
            {text.structure && (
              <div>
                <h3 className="font-bold text-emerald-700 mb-2">Structure</h3>
                <DetailItem label="Books" value={text.structure.books} />
                <DetailItem label="Lines" value={text.structure.lines} />
                <DetailItem label="Verses" value={text.structure.verses} />
                <DetailItem label="Chapters" value={text.structure.chapters} />
                <DetailItem label="Cantos" value={text.structure.cantos} />
                <DetailItem label="Meter" value={text.meter} />
              </div>
            )}
          </div>
        </section>

        {/* Textual History */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4 ">
            Textual History
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {text.manuscriptTradition && (
              <div>
                <h3 className="font-bold text-emerald-700 mb-2">
                  Manuscript Tradition
                </h3>
                <DetailItem
                  label="Oldest Manuscript"
                  value={text.manuscriptTradition.oldestManuscript}
                />
                <DetailItem
                  label="Oldest Manuscript Date"
                  value={text.manuscriptTradition.oldestManuscriptDate}
                />
                <DetailItem
                  label="Number of Manuscripts"
                  value={text.manuscriptTradition.numberOfManuscripts}
                />
                <DetailItem
                  label="Textual Transmission"
                  value={text.manuscriptTradition.textualTransmission}
                />
              </div>
            )}
            {text.firstPrintedEdition && (
              <div>
                <h3 className="font-bold text-emerald-700 mb-2">
                  First Printed Edition
                </h3>
                <DetailItem
                  label="Year"
                  value={text.firstPrintedEdition.year}
                />
                <DetailItem
                  label="Location"
                  value={text.firstPrintedEdition.location}
                />
                <DetailItem
                  label="Editor"
                  value={text.firstPrintedEdition.editor}
                />
              </div>
            )}
          </div>
        </section>

        {/* Links & Tags */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-4 ">
            Resources & Metadata
          </h2>
          <DetailItem label="Wiki Link" value={text.wikiLink} isLink={true} />
          {text.relatedTexts?.length > 0 && (
            <div className="py-2">
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Related Texts
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {text.relatedTexts.map((id) => (
                  <Link
                    key={id}
                    to={`/texts/${id}`}
                    className="text-emerald-600 hover:underline"
                  >
                    {id}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {text.tags?.length > 0 && (
            <div className="py-2">
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Tags
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {text.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <DetailItem label="Data Quality" value={text.dataQuality} />
          <DetailItem label="Verified by Admin" value={text.verifiedByAdmin} />
        </section>

        {/* Editions Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-emerald-600" />
            Available Editions ({filteredEditions.length})
          </h2>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div className="lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by title or editor...
                </label>
                <input
                  type="text"
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="e.g., Pharr, Loeb..."
                />
              </div>
              {[
                {
                  name: "hasTranslation",
                  label: "Translation",
                  icon: <Globe className="w-4 h-4 text-gray-500" />,
                },
                {
                  name: "hasCommentary",
                  label: "Commentary",
                  icon: <BookOpen className="w-4 h-4 text-gray-500" />,
                },
                {
                  name: "publicDomain",
                  label: "Public Domain",
                  icon: <Filter className="w-4 h-4 text-gray-500" />,
                },
              ].map((f) => (
                <div key={f.name}>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    {f.icon} {f.label}
                  </label>
                  <select
                    name={f.name}
                    value={filters[f.name]}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-md bg-gray-50"
                  >
                    <option value="all">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              ))}
              <button
                onClick={() =>
                  setFilters({
                    searchTerm: "",
                    hasTranslation: "all",
                    hasCommentary: "all",
                    publicDomain: "all",
                  })
                }
                className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 p-2 rounded-md hover:bg-gray-300 font-medium"
              >
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          {/* Editions List */}
          <div className="space-y-4">
            {filteredEditions.map((edition) => (
              <EditionCard key={edition.editionId} edition={edition} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default TextDetailPage;
