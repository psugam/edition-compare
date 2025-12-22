import React, { useState, useEffect } from "react";

const emptyState = {
    textId: "",
    title: "",
    titleOriginal: "",
    titleTransliteration: "",
    alternativeTitles: [],
    authors: [],
    authorsOriginal: [],
    attributedAuthors: [],
    originalLanguage: "",
    languageCode: "",
    dialect: "",
    date: "",
    dateNumeric: null,
    dateUncertainty: "low",
    genre: "",
    subgenre: [],
    literaryPeriod: "",
    structure: { books: null, lines: null, verses: null, chapters: null, cantos: null },
    meter: "",
    description: "",
    tags: [],
    manuscriptTradition: {
      oldestManuscript: "",
      oldestManuscriptDate: "",
      numberOfManuscripts: "",
      textualTransmission: "",
    },
    firstPrintedEdition: { year: null, location: "", editor: "" },
    relatedTexts: [],
    partOfSeries: "",
    wikiLink: "",
    externalLinks: [],
    verifiedByAdmin: false,
    dataQuality: "medium",
};


const EditTextForm = ({ onSubmit, isLoading, initialData, onCancel }) => {
  const [formData, setFormData] = useState(emptyState);

  useEffect(() => {
    if (initialData) {
        // Deep merge to ensure all keys from emptyState are present
        const mergedData = {
            ...emptyState,
            ...initialData,
            structure: { ...emptyState.structure, ...(initialData.structure || {}) },
            manuscriptTradition: { ...emptyState.manuscriptTradition, ...(initialData.manuscriptTradition || {}) },
            firstPrintedEdition: { ...emptyState.firstPrintedEdition, ...(initialData.firstPrintedEdition || {}) },
            // Ensure arrays are not null
            alternativeTitles: initialData.alternativeTitles || [],
            authors: initialData.authors || [],
            authorsOriginal: initialData.authorsOriginal || [],
            attributedAuthors: initialData.attributedAuthors || [],
            subgenre: initialData.subgenre || [],
            tags: initialData.tags || [],
            relatedTexts: initialData.relatedTexts || [],
            externalLinks: initialData.externalLinks || [],
        };
      setFormData(mergedData);
    }
  }, [initialData]);


  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === "checkbox" ? checked : value;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
       // Handle cases where value is empty string for number fields
      if ((child === 'year' || child === 'dateNumeric' || Object.keys(emptyState.structure).includes(child)) && finalValue === '') {
        finalValue = null;
      }
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: finalValue },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: finalValue,
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
    setFormData({ ...formData, [field]: [...(formData[field] || []), newVal] });
  };

  const removeField = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="max-w-5xl w-full mx-auto p-6 space-y-8 bg-white text-gray-800 rounded-lg shadow-2xl overflow-y-auto max-h-[90vh]"
    >
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-indigo-800">Edit Text: <span className="font-mono">{formData.textId}</span></h1>
        <button type="button" onClick={onCancel} className="text-2xl text-gray-500 hover:text-gray-800">&times;</button>
      </div>

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
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
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
              value={formData.titleTransliteration || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Wiki Link{" "}
            <input
              name="wikiLink"
              value={formData.wikiLink || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
        </div>

        <div>
          <span className="block font-medium mb-1">Alternative Titles</span>
          {(formData.alternativeTitles || []).map((val, i) => (
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
              {(formData[field] || []).map((val, i) => (
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
              value={formData.originalLanguage}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Language Code*{" "}
            <input
              name="languageCode"
              required
              value={formData.languageCode}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Dialect{" "}
            <input
              name="dialect"
              value={formData.dialect || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Genre*{" "}
            <input
              name="genre"
              required
              value={formData.genre}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <div>
            <span className="block font-medium mb-1">Subgenre</span>
            {(formData.subgenre || []).map((val, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={val}
                  onChange={(e) =>
                    handleArrayChange(i, e.target.value, "subgenre")
                  }
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeField("subgenre", i)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField("subgenre")}
              className="text-xs font-bold text-blue-600"
            >
              + ADD SUBGENRE
            </button>
          </div>
          <label>
            Period{" "}
            <input
              name="literaryPeriod"
              value={formData.literaryPeriod || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Series{" "}
            <input
              name="partOfSeries"
              value={formData.partOfSeries || ''}
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
              value={formData.date}
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
              value={formData.dateNumeric || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </label>
          <label>
            Date Uncertainty
            <select
              name="dateUncertainty"
              value={formData.dateUncertainty || 'low'}
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
                value={formData.structure[unit] || ''}
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
            value={formData.meter || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </label>
      </div>

       {/* 4. TAGS and RELATED TEXTS */}
      <div className="border-l-4 border-teal-600 pl-4 space-y-4">
        <h2 className="text-xl font-bold text-teal-800 uppercase tracking-tighter">
          IV. Tags & Relations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <span className="block font-medium mb-1">Tags</span>
                {(formData.tags || []).map((val, i) => (
                <div key={i} className="flex gap-2 mb-2">
                    <input
                    value={val}
                    onChange={(e) =>
                        handleArrayChange(i, e.target.value, "tags")
                    }
                    className="flex-1 p-2 border rounded"
                    />
                    <button
                    type="button"
                    onClick={() => removeField("tags", i)}
                    className="text-red-500"
                    >
                    ✕
                    </button>
                </div>
                ))}
                <button
                type="button"
                onClick={() => addField("tags")}
                className="text-xs font-bold text-teal-600"
                >
                + ADD TAG
                </button>
            </div>
            <div>
                <span className="block font-medium mb-1">Related Text IDs</span>
                {(formData.relatedTexts || []).map((val, i) => (
                <div key={i} className="flex gap-2 mb-2">
                    <input
                    value={val}
                    onChange={(e) =>
                        handleArrayChange(i, e.target.value, "relatedTexts")
                    }
                    className="flex-1 p-2 border rounded"
                    />
                    <button
                    type="button"
                    onClick={() => removeField("relatedTexts", i)}
                    className="text-red-500"
                    >
                    ✕
                    </button>
                </div>
                ))}
                <button
                type="button"
                onClick={() => addField("relatedTexts")}
                className="text-xs font-bold text-teal-600"
                >
                + ADD RELATED TEXT
                </button>
            </div>
        </div>
      </div>

      {/* 5. TEXTUAL HISTORY & LINKS */}
      <div className="border-l-4 border-amber-600 pl-4 space-y-4">
        <h2 className="text-xl font-bold text-amber-800 uppercase tracking-tighter">
          V. Textual History & Metadata
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <fieldset className="border p-4 rounded space-y-2">
            <legend className="font-bold px-2">Manuscript Tradition</legend>
            <label className="block text-xs">
              Oldest MS{" "}
              <input
                name="manuscriptTradition.oldestManuscript"
                value={formData.manuscriptTradition.oldestManuscript || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block text-xs">
              Oldest Date{" "}
              <input
                name="manuscriptTradition.oldestManuscriptDate"
                value={formData.manuscriptTradition.oldestManuscriptDate || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block text-xs">
              # of Manuscripts{" "}
              <input
                name="manuscriptTradition.numberOfManuscripts"
                value={formData.manuscriptTradition.numberOfManuscripts || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block text-xs">
              Transmission Info{" "}
              <textarea
                name="manuscriptTradition.textualTransmission"
                value={formData.manuscriptTradition.textualTransmission || ''}
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
                value={formData.firstPrintedEdition.year || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block text-xs">
              Location{" "}
              <input
                name="firstPrintedEdition.location"
                value={formData.firstPrintedEdition.location || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              />
            </label>
            <label className="block text-xs">
              Editor{" "}
              <input
                name="firstPrintedEdition.editor"
                value={formData.firstPrintedEdition.editor || ''}
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
            value={formData.description || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded h-32"
          />
        </label>

        {/* EXTERNAL LINKS (Object Array) */}
        <div>
          <span className="block font-medium mb-1">External Links</span>
          {(formData.externalLinks || []).map((link, i) => (
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
              value={formData.dataQuality || 'medium'}
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


      {/* JSON PREVIEW SECTION */}
      <section className="mt-8">
        <h3 className="font-bold text-gray-700 uppercase tracking-wider mb-2">
          Data Preview (JSON)
        </h3>
        <pre className="bg-gray-900 text-indigo-400 p-4 rounded-lg overflow-x-auto text-xs max-h-60">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </section>

      <div className="flex gap-4">
        <button
            type="button"
            onClick={onCancel}
            className="w-1/3 bg-gray-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-gray-600"
        >
            Cancel
        </button>
        <button
            type="submit"
            disabled={isLoading}
            className="w-2/3 bg-indigo-700 text-white py-3 rounded-xl font-bold text-lg hover:bg-indigo-800 shadow-xl transition-all uppercase"
        >
            {isLoading ? "Updating in Archive..." : "Update Work Entry"}
        </button>
      </div>
    </form>
    </div>
  );
};

export default EditTextForm;
