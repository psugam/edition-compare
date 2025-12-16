// ============================================
// Edition.js (Schema for the Edition Collection)
// ============================================
const mongoose = require("mongoose");

const EditionSchema = new mongoose.Schema(
  {
    // Primary Identifier & Foreign Key
    editionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    textId: {
      // FOREIGN KEY referencing the Text collection
      type: String,
      required: true,
      index: true,
      ref: "Text",
    },

    // Titles
    editionTitle: { type: String, required: true, trim: true },
    editionSubtitle: { type: String, trim: true, default: null },

    // Series Information
    seriesName: { type: String, trim: true, default: null },
    seriesNumber: { type: String, trim: true, default: null },
    volumeNumber: { type: Number, default: null },
    totalVolumes: { type: Number, default: null },

    // Publication Details
    publishedDate: { type: String, required: true, trim: true, index: true }, // Year or full date string
    newEditionsDate: { type: [String], default: [] },
    pageCount: { type: Number, default: null },

    // Contributors
    editors: { type: [String], default: [] },
    translators: { type: [String], default: [] },
    contributors: { type: [String], default: [] },

    // Textual Features
    manuscripts: { type: [String], default: [] },
    primaryManuscripts: { type: [String], default: [] },

    // Translation & Content
    hasOriginalText: { type: Boolean, required: true },
    hasTranslation: { type: Boolean, required: true }, // Derived but kept for simplicity/speed
    translationLanguages: { type: [String], default: [] },
    translationType: {
      type: String,
      enum: ["prose", "verse", null],
      default: null,
    },
    hasFacingTranslation: { type: Boolean, default: false },

    hasCommentary: { type: Boolean, default: false },
    commentaryType: { type: String, trim: true, default: null },
    commentaryLanguage: { type: String, trim: true, default: null },
    commentaryLength: {
      type: String,
      enum: ["brief", "moderate", "extensive", null],
      default: null,
    },

    hasApparatus: { type: Boolean, default: false },
    apparatusType: { type: String, trim: true, default: null },
    apparatusLocation: { type: String, trim: true, default: null },

    // Paratextual Components
    hasNotes: { type: Boolean, default: false },
    notesType: { type: String, trim: true, default: null },
    hasGlossary: { type: Boolean, default: false },
    hasIntroduction: { type: Boolean, default: false },
    hasBibliography: { type: Boolean, default: false },

    // Scope and Visuals
    completeEdition: { type: Boolean, default: true },
    partsIncluded: { type: String, default: null }, // e.g., "Books I - III" if not complete
    illustrations: { type: Boolean, default: false },
    maps: { type: Boolean, default: false },

    // Formatting
    lineNumbering: { type: Boolean, default: false },
    lineNumberingInterval: { type: Number, default: null },
    paragraphNumbering: { type: Boolean, default: false },
    columnLayout: {
      type: String,
      enum: ["single", "double", null],
      default: "single",
    },

    // Publisher & Legality
    publisher: { type: String, required: true, trim: true },
    publisherLink: { type: String, trim: true, default: null },
    isbn: { type: String, trim: true, default: null },

    publicDomain: { type: Boolean, default: false },
    publicDomainResource: [
      {
        source: { type: String, trim: true, required: true },
        link: { type: String, trim: true, required: true },
      },
    ],
    copyright: { type: String, default: null },
    license: { type: String, default: null },
    openAccess: { type: Boolean, default: false },
    inPrint: { type: Boolean, default: false },

    // Additional Features
    reviews: [
      {
        source: { type: String, trim: true, required: true },
        reviewer: { type: String, trim: true, default: null },
        date: { type: String, trim: true, default: null },
        link: { type: String, trim: true, default: null },
      },
    ],
    distinguishingFeatures: { type: [String], default: [] },
    remarks: { type: String, default: null },

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

module.exports = mongoose.model("Edition", EditionSchema);
