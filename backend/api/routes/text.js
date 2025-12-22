// api/routes/texts.js
const express = require("express");
const router = express.Router();
const Text = require("../database/text.model");

router.get("/", async (req, res) => {
  const { q, page = 1, limit = 10, language, genre, quality, minDate, maxDate } = req.query;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  try {
    let query = {};

    if (q) {
      const searchPattern = new RegExp(q, "i");
      query.$or = [
        { textId: searchPattern },
        { title: searchPattern },
        { authors: searchPattern },
      ];
    }
    
    if (language) query.originalLanguage = language;
    if (genre) query.genre = genre;
    if (quality) query.dataQuality = quality;
    if (minDate || maxDate) {
      query.date = {};
      if (minDate) query.date.$gte = parseInt(minDate, 10);
      if (maxDate) query.date.$lte = parseInt(maxDate, 10);
    }

    const allTexts = await Text.find(query);
    const count = allTexts.length;
    const totalPages = Math.ceil(count / limitNum);
    
    const texts = allTexts.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.status(200).json({
      texts,
      totalPages,
      currentPage: pageNum,
      totalTexts: count,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching texts", error: error.message });
  }
});

// --- GET FILTER OPTIONS (GET /api/texts/filter-options) ---
router.get("/filter-options", async (req, res) => {
  try {
    const [languages, genres, qualities, dateRange] = await Promise.all([
      Text.distinct("originalLanguage"),
      Text.distinct("genre"),
      Text.distinct("dataQuality"),
      Text.aggregate([
        {
          $group: {
            _id: null,
            min: { $min: "$date" },
            max: { $max: "$date" },
          },
        },
      ]),
    ]);

    res.status(200).json({
      languages: languages.sort(),
      genres: genres.sort(),
      qualities: qualities.sort(),
      dateRange: dateRange[0] || { min: null, max: null },
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching filter options",
        error: error.message,
      });
  }
});

// --- 2. VIEW ONE ITEM (GET /api/texts/:textId) ---
router.get("/:textId", async (req, res) => {
  try {
    const text = await Text.findOne({ textId: req.params.textId });
    if (!text) {
      return res.status(404).json({ message: "Text not found" });
    }
    res.status(200).json(text);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching text by ID", error: error.message });
  }
});

// --- 3. ADD ONE ITEM (POST /api/texts) ---
router.post("/", async (req, res) => {
  const newText = new Text(req.body);

  try {
    const savedText = await newText.save();
    res.status(201).json(savedText); // 201 Created
  } catch (error) {
    res.status(400).json({
      message: "Error adding new text (Validation Failed)",
      error: error.message,
    });
  }
});

// --- 4. EDIT ONE ITEM (PUT /api/texts/:textId) ---
router.put("/:textId", async (req, res) => {
  try {
    const updatedText = await Text.findOneAndUpdate(
      { textId: req.params.textId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedText) {
      return res.status(404).json({ message: "Text not found for update" });
    }
    res.status(200).json(updatedText);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating text", error: error.message });
  }
});

// --- 5. DELETE ONE ITEM (DELETE /api/texts/:textId) ---
router.delete("/:textId", async (req, res) => {
  try {
    const result = await Text.deleteOne({ textId: req.params.textId });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Text not found for deletion" });
    }

    res.status(200).json({
      message: `Text with ID ${req.params.textId} deleted successfully.`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting text", error: error.message });
  }
});

module.exports = router;
