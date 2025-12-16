// api/routes/editions.js
const express = require("express");
const router = express.Router();
// Assuming your Mongoose Model is exported from the database folder
const Edition = require("../database/edition.model");

// --- 1. VIEW ALL ITEMS (GET /api/editions) ---
router.get("/", async (req, res) => {
  try {
    const editions = await Edition.find({});
    res.status(200).json(editions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching all editions", error: error.message });
  }
});

// --- 2. VIEW ONE ITEM (GET /api/editions/:editionId) ---
router.get("/:editionId", async (req, res) => {
  try {
    const edition = await Edition.findOne({ editionId: req.params.editionId });
    if (!edition) {
      return res.status(404).json({ message: "Edition not found" });
    }
    res.status(200).json(edition);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching edition by ID", error: error.message });
  }
});

// --- 3. ADD ONE ITEM (POST /api/editions) ---
router.post("/", async (req, res) => {
  // Mongoose validates against the EditionSchema
  const newEdition = new Edition(req.body);

  try {
    const savedEdition = await newEdition.save();
    res.status(201).json(savedEdition); // 201 Created
  } catch (error) {
    res.status(400).json({
      message: "Error adding new edition (Validation Failed)",
      error: error.message,
    });
  }
});

// --- 4. EDIT ONE ITEM (PUT /api/editions/:editionId) ---
router.put("/:editionId", async (req, res) => {
  try {
    const updatedEdition = await Edition.findOneAndUpdate(
      { editionId: req.params.editionId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEdition) {
      return res.status(404).json({ message: "Edition not found for update" });
    }
    res.status(200).json(updatedEdition);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating edition", error: error.message });
  }
});

// --- 5. DELETE ONE ITEM (DELETE /api/editions/:editionId) ---
router.delete("/:editionId", async (req, res) => {
  try {
    const result = await Edition.deleteOne({ editionId: req.params.editionId });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "Edition not found for deletion" });
    }

    res.status(200).json({
      message: `Edition with ID ${req.params.editionId} deleted successfully.`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting edition", error: error.message });
  }
});

module.exports = router;
