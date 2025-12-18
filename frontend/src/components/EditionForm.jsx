import React, { useState } from "react";

const EditionForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    // Primary Identifier & Foreign Key
    editionId: "",
    textId: "",
    // Titles
    editionTitle: "",
    editionSubtitle: "",
    // Series Information
    seriesName: "",
    seriesNumber: "",
    volumeNumber: "",
    totalVolumes: "",
    // Publication Details
    publishedDate: "",
    newEditionsDate: [""],
    pageCount: "",
    // Contributors
    editors: [""],
    translators: [""],
    contributors: [""],
    // Textual Features
    manuscripts: [""],
    primaryManuscripts: [""],
    // Translation & Content
    hasOriginalText: false,
    hasTranslation: false,
    translationLanguages: [""],
    translationType: "prose", // enum
    hasFacingTranslation: false,
    // Commentary
    hasCommentary: false,
    commentaryType: "",
    commentaryLanguage: "",
    commentaryLength: "moderate", // enum
    // Apparatus
    hasApparatus: false,
    apparatusType: "",
    apparatusLocation: "",
    // Paratextual Components
    hasNotes: false,
    notesType: "",
    hasGlossary: false,
    hasIntroduction: false,
    hasBibliography: false,
    // Scope and Visuals
    completeEdition: true,
    partsIncluded: "",
    illustrations: false,
    maps: false,
    // Formatting
    lineNumbering: false,
    lineNumberingInterval: "",
    paragraphNumbering: false,
    columnLayout: "single", // enum
    // Publisher & Legality
    publisher: "",
    publisherLink: "",
    isbn: "",
    publicDomain: false,
    publicDomainResource: [{ source: "", link: "" }],
    copyright: "",
    license: "",
    openAccess: false,
    inPrint: false,
    // Additional Features
    reviews: [{ source: "", reviewer: "", date: "", link: "" }],
    distinguishingFeatures: [""],
    remarks: "",
    // Metadata
    verifiedByAdmin: false,
    dataQuality: "medium", // enum
  });

  // --- Handlers ---

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handler for simple string arrays (editors, translators, etc.)
  const handleArrayChange = (index, value, field) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayField = (field) =>
    setFormData({ ...formData, [field]: [...formData[field], ""] });

  const removeArrayField = (field, index) =>
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });

  // Handler for arrays of objects (publicDomainResource, reviews)
  const handleObjectArrayChange = (index, field, key, value) => {
    const newArr = [...formData[field]];
    newArr[index][key] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addObjectArrayField = (field, template) =>
    setFormData({ ...formData, [field]: [...formData[field], template] });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="max-w-6xl mx-auto space-y-12 text-sm p-6 bg-white shadow-lg rounded-lg"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* SECTION 1: IDENTIFICATION */}
        <section className="space-y-4 border-b pb-6 md:border-b-0 lg:border-r lg:pr-6">
          <h3 className="font-bold text-emerald-700 uppercase tracking-wider border-b pb-1">
            1. Identification
          </h3>
          <label className="block">
            Edition ID*{" "}
            <input
              name="editionId"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </label>
          <label className="block">
            Text (Work) ID*{" "}
            <input
              name="textId"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              placeholder="Link to Text collection"
            />
          </label>
          <label className="block">
            Edition Title*{" "}
            <input
              name="editionTitle"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </label>
          <label className="block">
            Subtitle
            <input
              name="editionSubtitle"
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </label>
        </section>

        {/* SECTION 2: SERIES & PUBLICATION */}
        <section className="space-y-4 border-b pb-6 md:border-b-0 lg:border-r lg:pr-6">
          <h3 className="font-bold text-emerald-700 uppercase tracking-wider border-b pb-1">
            2. Series & Publication
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <label>
              Series Name{" "}
              <input
                name="seriesName"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </label>
            <label>
              Series #{" "}
              <input
                name="seriesNumber"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label>
              Vol #{" "}
              <input
                type="number"
                name="volumeNumber"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </label>
            <label>
              Total Vols{" "}
              <input
                type="number"
                name="totalVolumes"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </label>
          </div>
          <label className="block">
            Publisher*{" "}
            <input
              name="publisher"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </label>
          <label className="block">
            Pub. Date*{" "}
            <input
              name="publishedDate"
              required
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </label>
          <label className="block">
            ISBN{" "}
            <input
              name="isbn"
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </label>
        </section>

        {/* SECTION 3: CONTRIBUTORS */}
        <section className="space-y-4 pb-6">
          <h3 className="font-bold text-emerald-700 uppercase tracking-wider border-b pb-1">
            3. Contributors
          </h3>
          {["editors", "translators", "contributors"].map((field) => (
            <div key={field} className="space-y-1">
              <span className="font-medium capitalize">{field}</span>
              {formData[field].map((val, i) => (
                <div key={i} className="flex gap-1">
                  <input
                    value={val}
                    onChange={(e) =>
                      handleArrayChange(i, e.target.value, field)
                    }
                    className="flex-1 p-1 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField(field, i)}
                    className="text-red-500 px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField(field)}
                className="text-xs text-blue-600 font-bold"
              >
                + Add {field}
              </button>
            </div>
          ))}
        </section>
      </div>

      <hr />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* SECTION 4: TEXTUAL CONTENT & FEATURES */}
        <section className="space-y-6">
          <h3 className="font-bold text-emerald-700 uppercase tracking-wider border-b pb-1">
            4. Textual Features & Content
          </h3>

          <div className="grid grid-cols-2 gap-4 bg-emerald-50 p-4 rounded-lg">
            {[
              "hasOriginalText",
              "hasTranslation",
              "hasFacingTranslation",
              "hasCommentary",
              "hasApparatus",
              "hasNotes",
              "hasGlossary",
              "hasIntroduction",
              "hasBibliography",
              "completeEdition",
              "illustrations",
              "maps",
              "lineNumbering",
              "paragraphNumbering",
              "openAccess",
              "inPrint",
            ].map((check) => (
              <label key={check} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={check}
                  checked={formData[check]}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="capitalize">
                  {check.replace("has", "").replace(/([A-Z])/g, " $1")}
                </span>
              </label>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              Translation Type
              <select
                name="translationType"
                value={formData.translationType}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="prose">Prose</option>
                <option value="verse">Verse</option>
                <option value="">None</option>
              </select>
            </label>
            <label className="block">
              Column Layout
              <select
                name="columnLayout"
                value={formData.columnLayout}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="">None</option>
              </select>
            </label>
          </div>
        </section>

        {/* SECTION 5: COMPLEX ARRAYS & LEGAL */}
        <section className="space-y-6">
          <h3 className="font-bold text-emerald-700 uppercase tracking-wider border-b pb-1">
            5. Legal & Additional Features
          </h3>

          <label className="block">
            License{" "}
            <input
              name="license"
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            />
          </label>

          <div className="space-y-4">
            <span className="font-bold">Public Domain Resources</span>
            {formData.publicDomainResource.map((res, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-2 border p-2 rounded relative"
              >
                <input
                  placeholder="Source"
                  value={res.source}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      i,
                      "publicDomainResource",
                      "source",
                      e.target.value
                    )
                  }
                  className="p-2 border rounded"
                />
                <input
                  placeholder="URL"
                  value={res.link}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      i,
                      "publicDomainResource",
                      "link",
                      e.target.value
                    )
                  }
                  className="p-2 border rounded"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField("publicDomainResource", i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                addObjectArrayField("publicDomainResource", {
                  source: "",
                  link: "",
                })
              }
              className="text-xs text-blue-600 font-bold"
            >
              + Add Resource
            </button>
          </div>

          <label className="block">
            Remarks / Notes
            <textarea
              name="remarks"
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1 h-20"
            />
          </label>
        </section>
      </div>

      <hr />

      {/* SECTION 6: REVIEWS & QUALITY */}
      <section className="space-y-4 bg-slate-50 p-6 rounded-xl">
        <h3 className="font-bold text-emerald-700 uppercase tracking-wider border-b pb-1">
          6. Critical Reviews & Metadata
        </h3>
        {formData.reviews.map((rev, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-2 border-b pb-2 items-end"
          >
            <label className="text-xs">
              Source{" "}
              <input
                value={rev.source}
                onChange={(e) =>
                  handleObjectArrayChange(
                    i,
                    "reviews",
                    "source",
                    e.target.value
                  )
                }
                className="w-full p-1 border rounded"
              />
            </label>
            <label className="text-xs">
              Reviewer{" "}
              <input
                value={rev.reviewer}
                onChange={(e) =>
                  handleObjectArrayChange(
                    i,
                    "reviews",
                    "reviewer",
                    e.target.value
                  )
                }
                className="w-full p-1 border rounded"
              />
            </label>
            <label className="text-xs">
              Date{" "}
              <input
                value={rev.date}
                onChange={(e) =>
                  handleObjectArrayChange(i, "reviews", "date", e.target.value)
                }
                className="w-full p-1 border rounded"
              />
            </label>
            <div className="flex items-center gap-2">
              <label className="text-xs flex-1">
                Link{" "}
                <input
                  value={rev.link}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      i,
                      "reviews",
                      "link",
                      e.target.value
                    )
                  }
                  className="w-full p-1 border rounded"
                />
              </label>
              <button
                type="button"
                onClick={() => removeArrayField("reviews", i)}
                className="text-red-500 pt-4"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addObjectArrayField("reviews", {
              source: "",
              reviewer: "",
              date: "",
              link: "",
            })
          }
          className="text-xs text-blue-600 font-bold"
        >
          + Add Review Entry
        </button>

        <div className="flex gap-8 pt-6">
          <label className="flex items-center space-x-2 font-bold bg-white p-3 border rounded shadow-sm">
            <input
              type="checkbox"
              name="verifiedByAdmin"
              checked={formData.verifiedByAdmin}
              onChange={handleChange}
              className="h-5 w-5"
            />
            <span>Verified by Admin</span>
          </label>
          <label className="block flex-1">
            Data Quality Status
            <select
              name="dataQuality"
              value={formData.dataQuality}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>
      </section>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-800 shadow-lg transform transition active:scale-95"
      >
        {isLoading ? "Synchronizing Edition..." : "Finalize Edition Entry"}
      </button>
    </form>
  );
};

export default EditionForm;
