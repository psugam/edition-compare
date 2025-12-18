import React, { useState } from "react";

const TextForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    textId: "",
    title: "",
    titleOriginal: "",
    titleTransliteration: "",
    alternativeTitles: [""],
    authors: [""],
    authorsOriginal: [""],
    attributedAuthors: [""],
    originalLanguage: "",
    languageCode: "",
    dialect: "",
    date: "",
    dateNumeric: "",
    dateUncertainty: "low",
    genre: "",
    subgenre: [""],
    literaryPeriod: "",
    structure: { books: "", lines: "", verses: "", chapters: "", cantos: "" },
    meter: "",
    description: "",
    tags: [""],
    manuscriptTradition: {
      oldestManuscript: "",
      oldestManuscriptDate: "",
      numberOfManuscripts: "",
      textualTransmission: "",
    },
    firstPrintedEdition: { year: "", location: "", editor: "" },
    relatedTexts: [""],
    partOfSeries: "",
    wikiLink: "",
    externalLinks: [{ name: "", url: "", type: "text" }],
    verifiedByAdmin: false,
    dataQuality: "medium",
  });

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleArrayChange = (index, value, field) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const handleObjArrayChange = (index, field, subfield, value) => {
    const newArr = [...formData[field]];
    newArr[index][subfield] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addField = (field, isObj = false, template = "") => {
    const newVal = isObj ? { ...template } : "";
    setFormData({ ...formData, [field]: [...formData[field], newVal] });
  };

  const removeField = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="max-w-5xl mx-auto p-6 space-y-12 bg-white text-gray-800"
    >
      {/* 1. TITLES & IDENTITY */}
      <div className="border-l-4 border-indigo-600 pl-4 space-y-4">
        <h2 className="text-xl font-bold text-indigo-800 uppercase tracking-tighter">
          I. Identity & Titles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <label>
            Text ID*{" "}
            <input
              name="textId"
              required
              value={formData.textId}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Title (EN)*{" "}
            <input
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Original Title*{" "}
            <input
              name="titleOriginal"
              required
              value={formData.titleOriginal}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Transliteration{" "}
            <input
              name="titleTransliteration"
              value={formData.titleTransliteration}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Wiki Link{" "}
            <input
              name="wikiLink"
              value={formData.wikiLink}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
        </div>

        <div>
          <span className="block font-medium mb-1">Alternative Titles</span>
          {formData.alternativeTitles.map((val, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                value={val}
                onChange={(e) =>
                  handleArrayChange(i, e.target.value, "alternativeTitles")
                }
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeField("alternativeTitles", i)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addField("alternativeTitles")}
            className="text-xs font-bold text-indigo-600"
          >
            + ADD TITLE
          </button>
        </div>
      </div>

      {/* 2. AUTHORSHIP & CLASSIFICATION */}
      <div className="border-l-4 border-blue-600 pl-4 space-y-4">
        <h2 className="text-xl font-bold text-blue-800 uppercase tracking-tighter">
          II. Authorship & Context
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {["authors", "authorsOriginal", "attributedAuthors"].map((field) => (
            <div key={field}>
              <span className="block font-medium capitalize mb-1">
                {field.replace(/([A-Z])/g, " $1")}
              </span>
              {formData[field].map((val, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    value={val}
                    onChange={(e) =>
                      handleArrayChange(i, e.target.value, field)
                    }
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeField(field, i)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addField(field)}
                className="text-xs font-bold text-blue-600 uppercase"
              >
                + Add
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded">
          <label>
            Language*{" "}
            <input
              name="originalLanguage"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Language Code*{" "}
            <input
              name="languageCode"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Dialect{" "}
            <input
              name="dialect"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Genre*{" "}
            <input
              name="genre"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Period{" "}
            <input
              name="literaryPeriod"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Series{" "}
            <input
              name="partOfSeries"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
        </div>
      </div>

      {/* 3. CHRONOLOGY & STRUCTURE */}
      <div className="border-l-4 border-purple-600 pl-4 space-y-4">
        <h2 className="text-xl font-bold text-purple-800 uppercase tracking-tighter">
          III. Chronology & Structure
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label>
            Date (String)*{" "}
            <input
              name="date"
              required
              onChange={handleChange}
              placeholder="e.g. 1st Century BC"
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Numeric Year{" "}
            <input
              type="number"
              name="dateNumeric"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Date Uncertainty
            <select
              name="dateUncertainty"
              value={formData.dateUncertainty}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="">Unknown</option>
            </select>
          </label>
        </div>
        <div className="bg-purple-50 p-4 rounded grid grid-cols-2 md:grid-cols-5 gap-2">
          {Object.keys(formData.structure).map((unit) => (
            <label key={unit} className="capitalize">
              {unit}
              <input
                type="number"
                name={`structure.${unit}`}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </label>
          ))}
        </div>
        <label className="block">
          Metrical Form{" "}
          <input
            name="meter"
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>
      </div>

      {/* 4. TEXTUAL HISTORY & LINKS */}
      <div className="border-l-4 border-amber-600 pl-4 space-y-4">
        <h2 className="text-xl font-bold text-amber-800 uppercase tracking-tighter">
          IV. Textual History & Metadata
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <fieldset className="border p-4 rounded space-y-2">
            <legend className="font-bold px-2">Manuscript Tradition</legend>
            <label className="block text-xs">
              Oldest MS{" "}
              <input
                name="manuscriptTradition.oldestManuscript"
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block text-xs">
              Oldest Date{" "}
              <input
                name="manuscriptTradition.oldestManuscriptDate"
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block text-xs">
              # of Manuscripts{" "}
              <input
                name="manuscriptTradition.numberOfManuscripts"
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block text-xs">
              Transmission Info{" "}
              <textarea
                name="manuscriptTradition.textualTransmission"
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
          </fieldset>
          <fieldset className="border p-4 rounded space-y-2">
            <legend className="font-bold px-2">First Printed Edition</legend>
            <label className="block text-xs">
              Year{" "}
              <input
                type="number"
                name="firstPrintedEdition.year"
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block text-xs">
              Location{" "}
              <input
                name="firstPrintedEdition.location"
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block text-xs">
              Editor{" "}
              <input
                name="firstPrintedEdition.editor"
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
          </fieldset>
        </div>

        <label className="block font-medium">
          Description{" "}
          <textarea
            name="description"
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
          />
        </label>

        {/* EXTERNAL LINKS (Object Array) */}
        <div>
          <span className="block font-medium mb-1">External Links</span>
          {formData.externalLinks.map((link, i) => (
            <div key={i} className="flex gap-2 mb-2 bg-gray-50 p-2 rounded">
              <input
                placeholder="Name"
                value={link.name}
                onChange={(e) =>
                  handleObjArrayChange(
                    i,
                    "externalLinks",
                    "name",
                    e.target.value
                  )
                }
                className="w-1/4 p-2 border rounded"
              />
              <input
                placeholder="URL"
                value={link.url}
                onChange={(e) =>
                  handleObjArrayChange(
                    i,
                    "externalLinks",
                    "url",
                    e.target.value
                  )
                }
                className="flex-1 p-2 border rounded"
              />
              <input
                placeholder="Type"
                value={link.type}
                onChange={(e) =>
                  handleObjArrayChange(
                    i,
                    "externalLinks",
                    "type",
                    e.target.value
                  )
                }
                className="w-1/4 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeField("externalLinks", i)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              addField("externalLinks", true, {
                name: "",
                url: "",
                type: "text",
              })
            }
            className="text-xs font-bold text-amber-600"
          >
            + ADD LINK
          </button>
        </div>

        <div className="flex items-center gap-10 bg-amber-50 p-4 rounded">
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input
              type="checkbox"
              name="verifiedByAdmin"
              checked={formData.verifiedByAdmin}
              onChange={handleChange}
              className="h-5 w-5"
            />{" "}
            Verified by Admin
          </label>
          <label>
            Data Quality
            <select
              name="dataQuality"
              value={formData.dataQuality}
              onChange={handleChange}
              className="ml-2 p-2 border rounded"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-700 text-white py-5 rounded-xl font-black text-xl hover:bg-indigo-800 shadow-xl transition-all uppercase"
      >
        {isLoading ? "Saving to Archive..." : "Create Work Entry"}
      </button>
    </form>
  );
};

export default TextForm;
