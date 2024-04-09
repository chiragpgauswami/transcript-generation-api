const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { AssemblyAI } = require("assemblyai");
const translator = require("@vitalets/google-translate-api");

const app = express();

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, "abc.mp4");
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "video/mp4") {
      cb(null, true);
    } else {
      cb(new Error("Only .mp4 files are allowed"));
    }
  },
});

const assemblyAI = new AssemblyAI({
  apiKey: "ASSEMBLY_AI_API_KEY",
});

// Define a route to handle file uploads
app.post("/transcribe", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Path to the uploaded video file
    const videoPath = req.file.path;

    console.log("video path: ", videoPath);
    // Path to store the extracted audio file
    const audioPath = "uploads/audio.mp3";

    // Extract audio from video and convert it to MP3
    ffmpeg(videoPath)
      .outputOptions("-vn") // Extract only audio
      .audioCodec("libmp3lame") // Set the audio codec to MP3
      .save(audioPath)
      .on("end", async () => {
        console.log("Audio extraction and conversion to MP3 complete");
        // Transcribe audio using AssemblyAI
        const transcript = await transcribeAudio(audioPath);

        let transcriptEnglish = transcript;
        let transcriptHindi = ""; // Placeholder for translated text

        // Translate transcript to Hindi
        translator
          .translate(transcriptEnglish, { to: "hi" })
          .then((translation) => {
            transcriptHindi = translation.text;

            // Send final response
            res.json({
              success: true,
              transcriptEnglish: transcriptEnglish,
              transcriptHindi: transcriptHindi,
            });
          })
          .catch((error) => {
            console.error("Error translating to Hindi:", error);
            // Send response with only English transcript
            res.json({
              success: false,
              transcriptEnglish: transcriptEnglish,
              transcriptHindi: "",
            });
          });
      })
      .on("error", (err) => {
        console.error("Error extracting audio:", err);
        res.status(500).json({ error: "Error extracting audio" });
      });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Function to transcribe audio using AssemblyAI
async function transcribeAudio(audioPath) {
  try {
    const config = { audio_url: `${audioPath}` };
    const transcript = await assemblyAI.transcripts.create(config);
    return transcript.text;
  } catch (err) {
    console.error("Error transcribing audio:", err);
    throw err;
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
