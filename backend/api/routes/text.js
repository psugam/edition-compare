// api/routes/texts.js
const express = require("express");
const router = express.Router();
const Text = require("../database/text.model");
const { adminOnly } = require("../middleware/auth"); // <--- IMPORT ADMIN MIDDLEWARE

// --- 1. VIEW ALL ITEMS (GET /api/texts) --- (Public)
router.get("/", async (req, res) => {
  // ... (logic remains the same)
  try {
    const texts = await Text.find({});
    res.status(200).json(texts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching all texts", error: error.message });
  }
});

// --- 2. VIEW ONE ITEM (GET /api/texts/:textId) --- (Public)
router.get("/:textId", async (req, res) => {
  // ... (logic remains the same)
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

// --- 3. ADD ONE ITEM (POST /api/texts) --- (PROTECTED)
router.post("/", adminOnly, async (req, res) => {
  // <--- ADMIN CHECK APPLIED HERE
  const newText = new Text(req.body);
  try {
    const savedText = await newText.save();
    res.status(201).json(savedText);
  } catch (error) {
    res.status(400).json({
      message: "Error adding new text (Validation Failed)",
      error: error.message,
    });
  }
});

// --- 4. EDIT ONE ITEM (PUT /api/texts/:textId) --- (PROTECTED)
router.put("/:textId", adminOnly, async (req, res) => {
  // <--- ADMIN CHECK APPLIED HERE
  // ... (logic remains the same)
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

// --- 5. DELETE ONE ITEM (DELETE /api/texts/:textId) --- (PROTECTED)
router.delete("/:textId", adminOnly, async (req, res) => {
  // <--- ADMIN CHECK APPLIED HERE
  // ... (logic remains the same)
  try {
    const result = await Text.deleteOne({ textId: req.params.textId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Text not found for deletion" });
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
