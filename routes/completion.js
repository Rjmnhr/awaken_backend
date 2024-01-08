const router = require("express").Router();
const CompletionSchema = require("../models/completeion-model");

// Update video completion status
router.post("/update-video-completion", async (req, res) => {
  const { email, module, videoNo, status } = req.body;

  try {
    // Check if a document already exists for the given user, module, and videoNo
    const existingCompletion = await CompletionSchema.findOne({
      email,
      module,
      videoNo,
    });

    if (existingCompletion) {
      // If the document exists, update its status
      existingCompletion.status = status;
      const updatedCompletion = await existingCompletion.save();
      res.status(200).json(updatedCompletion);
    } else {
      // If the document doesn't exist, create a new one
      const userData = new CompletionSchema({
        email,
        module,
        videoNo,
        status,
      });

      const user = await userData.save();
      res.status(201).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/video-completion-status", async (req, res) => {
  const { module, videoNo, email } = req.body;

  try {
    // Find the corresponding completion status based on moduleName, numericVideoNumber, and email
    const completionStatus = await CompletionSchema.findOne({
      module,
      videoNo,
      email,
    });

    if (completionStatus) {
      res.status(200).json({ completed: completionStatus.status === "true" });
    } else {
      res.status(200).json({ error: "Completion status not found" });
    }
  } catch (error) {
    console.error("Error fetching completion status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
