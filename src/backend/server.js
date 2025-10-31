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

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173",
    "https://campusassistant.onrender.com"
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

// read local data
const facultyData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "profesors.json"), "utf8")
);
const timetable = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "timetable.json"), "utf8")
);
const messTimetable = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "mess.json"), "utf8")
);

// req body
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  try {
    const now = new Date();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    const today = daysOfWeek[now.getDay()];
    const tomorrow = daysOfWeek[(now.getDay() + 1) % 7];

    // format timetable
    const formattedTimetable = timetable.groups
      .map(groupData => {
        const group = groupData.group;
        const timetableEntries = Object.entries(groupData.timetable)
          .map(([day, slots]) => {
            const classes = slots
              .map(s => `  - ${s.time}: ${s.course}`)
              .join("\n");
            return `${day}:\n${classes}`;
          })
          .join("\n\n");

        return `Group ${group} Timetable:\n\n${timetableEntries}`;
      })
      .join("\n\n============================\n\n");

    // format faculty data
    const formattedFaculty = facultyData.faculty
      .map(f => {
        return `📘 ${f.course_title} (${f.course_code})\n- Group 1: ${f.faculty_group_1}\n- Group 2: ${f.faculty_group_2}`;
      })
      .join("\n\n");

    // format mess data
    const formattedMessTimetable = Object.entries(messTimetable)
      .map(([day, meals]) => {
        const mealList = Object.entries(meals)
          .map(([mealType, meal]) => `  - ${mealType}: ${meal}`)
          .join("\n");
        return `${day}:\n${mealList}`;
      })
      .join("\n\n");

    const context = `
Current Date: ${now.toDateString()}
Today is ${today}. Tomorrow is ${tomorrow}.

You are a smart AI campus assistant.
Here is the student's timetable data:

${formattedTimetable}

Here is the Faculty Data:

${formattedFaculty}

Here is the Mess Time Table Data:

${formattedMessTimetable}

Now answer the student's question: "${question}"

If the question is about which class they have tomorrow, 
use today's real day (from your system date) and find the next day in the timetable.
If tomorrow has no entry, say "No classes tomorrow." 
If the question is about faculty members use the faculty data.
If it's about mess food timetable, use the mess timetable.
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

const frontendPath = path.join(__dirname, "../frontend/build");
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
