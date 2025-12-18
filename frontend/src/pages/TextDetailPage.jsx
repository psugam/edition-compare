import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/axiosInstance";
import {
  ArrowLeft,
  Calendar,
  User,
  FileText,
  Globe,
  ExternalLink,
  Filter,
  Book,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Hash,
  Library,
  ShieldCheck,
  Map as MapIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Info,
  Tag,
} from "lucide-react";

// --- Minimalist Data Row ---
const DataField = ({ label, value, fullWidth = false }) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  )
    return null;
  return (
    <div
      className={`py-3 border-b border-gray-100 ${
        fullWidth ? "col-span-full" : ""
      }`}
    >
      <dt className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </dt>
      <dd className="text-sm text-gray-800 font-medium">
        {Array.isArray(value) ? value.join(", ") : value.toString()}
      </dd>
    </div>
  );
};

const BooleanFeature = ({ label, active }) => (
  <div className="flex items-center gap-2 py-1">
    {active ? (
      <Check className="w-4 h-4 text-green-600" />
    ) : (
      <X className="w-4 h-4 text-gray-300" />
    )}
    <span
      className={`text-xs font-semibold ${
        active ? "text-gray-800" : "text-gray-400"
      }`}
    >
      {label}
    </span>
  </div>
);

function TextDetailPage() {
  const { textId } = useParams();
  const [text, setText] = useState(null);
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEditions, setExpandedEditions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [textRes, editionsRes] = await Promise.all([
          api.get(`/api/texts/${textId}`),
          api.get("/api/editions"),
        ]);
        setText(textRes.data);
        const allEditions = Array.isArray(editionsRes.data)
          ? editionsRes.data
          : [];
        setEditions(allEditions.filter((e) => e.textId === textId));
      } catch (err) {
        setError(
          err.response?.data?.message || "Error accessing database record."
        );
      } finally {
        setLoading(false);
      }
    };
    if (textId) fetchData();
  }, [textId]);

  if (loading)
    return (
      <div className="p-20 text-center font-serif text-gray-400 italic">
        Loading Archive...
      </div>
    );
  if (error || !text)
    return (
      <div className="p-20 text-center text-red-700">
        {error || "Record not found."}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-gray-900 bg-white min-h-screen font-sans">
      <Link
        to="/search"
        className="inline-flex items-center gap-2 mb-10 text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Collection
      </Link>

      {/* --- WORK HEADER --- */}
      <header className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
          {text.title}
        </h1>
        <h2 className="text-2xl font-serif italic text-gray-500">
          {text.titleOriginal}
        </h2>
        {text.titleTransliteration && (
          <p className="text-gray-400 italic mt-1">
            {text.titleTransliteration}
          </p>
        )}
        <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
          <span className="bg-gray-100 px-2 py-1">{text.genre}</span>
          <span className="border-l pl-4 border-gray-300">
            {text.originalLanguage} ({text.languageCode})
          </span>
          <span className="border-l pl-4 border-gray-300">
            {text.literaryPeriod}
          </span>
        </div>
      </header>

      {/* --- WORK CONTENT --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pb-16 border-b border-gray-200">
        <div className="md:col-span-2 space-y-10">
          <section>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-300 mb-4">
              Work Description
            </h3>
            <p className="text-base leading-relaxed text-gray-700 font-serif whitespace-pre-wrap">
              {text.description ||
                "No archival summary available for this entry."}
            </p>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
            <DataField label="Primary Author(s)" value={text.authors} />
            <DataField label="Original Name(s)" value={text.authorsOriginal} />
            <DataField
              label="Attributed Authors"
              value={text.attributedAuthors}
            />
            <DataField
              label="Alternative Titles"
              value={text.alternativeTitles}
            />
            <DataField label="Composition Date" value={text.date} />
            <DataField label="Numeric Date" value={text.dateNumeric} />
            <DataField label="Date Uncertainty" value={text.dateUncertainty} />
            <DataField label="Dialect" value={text.dialect} />
            <DataField label="Sub-genre" value={text.subgenre} />
          </section>

          <section>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-300 mb-4">
              Structural Data
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-4 border-y border-gray-50">
              <div>
                <span className="text-[10px] font-bold text-gray-400 block uppercase">
                  Books
                </span>
                <span className="text-lg font-serif">
                  {text.structure?.books || "—"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 block uppercase">
                  Chapters
                </span>
                <span className="text-lg font-serif">
                  {text.structure?.chapters || "—"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 block uppercase">
                  Lines / Verses
                </span>
                <span className="text-lg font-serif">
                  {text.structure?.lines || text.structure?.verses || "—"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 block uppercase">
                  Meter
                </span>
                <span className="text-sm font-bold">{text.meter || "N/A"}</span>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-8 bg-gray-50 p-8 rounded">
          <section>
            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4 border-b pb-2">
              Archival Context
            </h3>
            <DataField
              label="Oldest Manuscript"
              value={text.manuscriptTradition?.oldestManuscript}
            />
            <DataField
              label="MS Date"
              value={text.manuscriptTradition?.oldestManuscriptDate}
            />
            <DataField
              label="MS Count"
              value={text.manuscriptTradition?.numberOfManuscripts}
            />
            <p className="text-xs italic text-gray-500 mt-2 leading-relaxed">
              {text.manuscriptTradition?.textualTransmission}
            </p>
          </section>

          <section>
            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4 border-b pb-2">
              First Printing
            </h3>
            <DataField label="Year" value={text.firstPrintedEdition?.year} />
            <DataField
              label="Location"
              value={text.firstPrintedEdition?.location}
            />
            <DataField
              label="Editor"
              value={text.firstPrintedEdition?.editor}
            />
          </section>

          <section>
            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4 border-b pb-2">
              Verification
            </h3>
            <div className="flex items-center gap-2 text-xs font-bold">
              {text.verifiedByAdmin ? (
                <ShieldCheck className="w-4 h-4 text-green-600" />
              ) : (
                <X className="w-4 h-4 text-gray-300" />
              )}
              <span className="uppercase tracking-tighter">
                Quality: {text.dataQuality}
              </span>
            </div>
          </section>
        </aside>
      </div>

      {/* --- EDITIONS LIST --- */}
      <section className="mt-20">
        <h2 className="text-2xl font-serif font-bold mb-10 border-b border-gray-900 pb-2 italic">
          Critical Editions & Translations
        </h2>

        <div className="divide-y divide-gray-200">
          {editions.map((ed) => (
            <div key={ed.editionId} className="py-10">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    {ed.publishedDate} — {ed.publisher}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {ed.editionTitle}
                  </h3>
                  {ed.editionSubtitle && (
                    <p className="text-sm italic text-gray-500 mb-4">
                      {ed.editionSubtitle}
                    </p>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                    <DataField label="Editor(s)" value={ed.editors} />
                    <DataField label="Translator(s)" value={ed.translators} />
                    <DataField label="Series" value={ed.seriesName} />
                    <DataField label="ISBN" value={ed.isbn} />
                  </div>
                </div>

                <div className="flex flex-col items-end min-w-[150px]">
                  <button
                    onClick={() =>
                      setExpandedEditions((prev) => ({
                        ...prev,
                        [ed.editionId]: !prev[ed.editionId],
                      }))
                    }
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                  >
                    {expandedEditions[ed.editionId]
                      ? "Less Data"
                      : "Full Apparatus"}
                    {expandedEditions[ed.editionId] ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {expandedEditions[ed.editionId] && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-12 bg-gray-50 p-8 rounded transition-all duration-300">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 border-b pb-1">
                      Features
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <BooleanFeature
                        label="Original Text"
                        active={ed.hasOriginalText}
                      />
                      <BooleanFeature
                        label="Translation"
                        active={ed.hasTranslation}
                      />
                      <BooleanFeature
                        label="Commentary"
                        active={ed.hasCommentary}
                      />
                      <BooleanFeature
                        label="Apparatus"
                        active={ed.hasApparatus}
                      />
                      <BooleanFeature
                        label="Introduction"
                        active={ed.hasIntroduction}
                      />
                      <BooleanFeature
                        label="Bibliography"
                        active={ed.hasBibliography}
                      />
                      <BooleanFeature
                        label="Glossary"
                        active={ed.hasGlossary}
                      />
                      <BooleanFeature label="Notes" active={ed.hasNotes} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 border-b pb-1">
                      Academic Specs
                    </h4>
                    <DataField label="Langs" value={ed.translationLanguages} />
                    <DataField
                      label="Apparatus"
                      value={`${ed.apparatusType} (${ed.apparatusLocation})`}
                    />
                    <DataField
                      label="Layout"
                      value={`${ed.columnLayout} Column`}
                    />
                    <DataField label="Manuscripts" value={ed.manuscripts} />
                    <DataField
                      label="Primary MSS"
                      value={ed.primaryManuscripts}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase text-gray-400 border-b pb-1">
                      Digital Access & Reviews
                    </h4>
                    {ed.publicDomainResource?.map((res, i) => (
                      <a
                        key={i}
                        href={res.link}
                        className="flex items-center gap-2 text-xs font-bold text-blue-800 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" /> {res.source}
                      </a>
                    ))}
                    {ed.reviews?.map((rev, i) => (
                      <div
                        key={i}
                        className="text-[11px] text-gray-500 italic border-l-2 pl-3 py-1"
                      >
                        "{rev.source}" — {rev.reviewer} ({rev.date})
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <DataField label="Remarks" value={ed.remarks} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TextDetailPage;
