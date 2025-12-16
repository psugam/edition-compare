// ============================================
// Text.js (Schema for the Text/Work Collection)
// ============================================
const mongoose = require("mongoose");

const TextSchema = new mongoose.Schema(
  {
    // Primary Identifier
    textId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    // Titles
    title: { type: String, required: true, trim: true },
    titleOriginal: { type: String, required: true, trim: true },
    titleTransliteration: { type: String, trim: true, default: null },
    alternativeTitles: { type: [String], default: [] },

    // Authorship
    authors: { type: [String], required: true },
    authorsOriginal: { type: [String], default: [] },
    attributedAuthors: { type: [String], default: [] },

    // Language and Origin
    originalLanguage: { type: String, required: true, trim: true },
    languageCode: { type: String, required: true, trim: true },
    dialect: { type: String, trim: true, default: null },

    // Date and Period
    date: { type: String, required: true, trim: true },
    dateNumeric: { type: Number, index: true }, // For efficient range filtering/sorting
    dateUncertainty: {
      type: String,
      enum: ["high", "medium", "low", null],
      default: null,
    },

    // Classification
    genre: { type: String, required: true, index: true, trim: true },
    subgenre: { type: [String], default: [] },
    literaryPeriod: { type: String, index: true, trim: true, default: null },

    // Structural Data
    structure: {
      books: { type: Number, default: null },
      lines: { type: Number, default: null },
      verses: { type: Number, default: null },
      chapters: { type: Number, default: null },
      cantos: { type: Number, default: null },
    },
    meter: { type: String, trim: true, default: null },

    // Descriptive Content
    description: { type: String, default: null },
    tags: { type: [String], index: true, default: [] },

    // Textual History
    manuscriptTradition: {
      oldestManuscript: { type: String, trim: true, default: null },
      oldestManuscriptDate: { type: String, trim: true, default: null },
      numberOfManuscripts: { type: String, trim: true, default: null },
      textualTransmission: { type: String, default: null },
    },
    firstPrintedEdition: {
      year: { type: Number, default: null },
      location: { type: String, trim: true, default: null },
      editor: { type: String, trim: true, default: null },
    },
    relatedTexts: { type: [String], default: [] }, // Array of other textIds
    partOfSeries: { type: String, trim: true, default: null },

    // Links
    wikiLink: { type: String, trim: true, default: null },
    externalLinks: [
      {
        name: { type: String, required: true, trim: true },
        url: { type: String, required: true, trim: true },
        type: { type: String, trim: true, default: "text" },
      },
    ],

    // Metadata
    verifiedByAdmin: { type: Boolean, default: false, index: true },
    dataQuality: {
      type: String,
      enum: ["high", "medium", "low", null],
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Text", TextSchema);
