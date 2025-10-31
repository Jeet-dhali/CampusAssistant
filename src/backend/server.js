import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { OPENAI_API_KEY } from "./apiKey.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// Load local data (you can replace with a DB later)
const professors = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "profesors.json"), "utf8"));
const timetable = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "timetable.json"), "utf8"));

// Route to chat with the assistant
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const context = `
    Here is the campus data:
    Professors: ${JSON.stringify(professors)}
    Timetable: ${JSON.stringify(timetable)}
    Question: ${question}
    Respond like a helpful campus assistant.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI campus assistant." },
        { role: "user", content: context }
      ]
    });

    res.json({ answer: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () =>
  console.log(`🚀 Server running on port ${5000}`)
);
