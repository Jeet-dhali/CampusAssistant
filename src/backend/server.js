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

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// Load local data (you can replace with a DB later)
const facultyData = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "profesors.json"), "utf8"));
const timetable = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "timetable.json"), "utf8"));

// Route to chat with the assistant
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    // Turn timetable into a readable table-like text
    const formattedTimetable = Object.entries(timetable.timetable)
      .map(([day, slots]) => {
        const classes = slots
          .map(s => `- ${s.time}: ${s.course}`)
          .join("\n");
        return `${day}:\n${classes}`;
      })
      .join("\n\n");

    //format faculty data 
    const formattedFaculty = facultyData.faculty
        .map(f => {
            return `📘 ${f.course_title} (${f.course_code})\n- Group 1: ${f.faculty_group_1}\n- Group 2: ${f.faculty_group_2}`;
        })
        .join("\n\n");



    const context = `
You are a smart AI campus assistant.
Here is the student's timetable data:

${formattedTimetable}

Here is the Faculty Data:

${formattedFaculty}

Now answer the student's question: "${question}"

If the question is about which class they have tomorrow, 
use today's real day (from your system date) and find the next day in the timetable.
If tomorrow has no entry, say "No classes tomorrow." If the question is about faculty members use the 
faculty data to answer the students question.
Only use the above data — do not guess.
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
