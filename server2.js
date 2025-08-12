
import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// Needed for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const dataFile = path.join(__dirname, "staff.json");


app.use(cors());
app.use(express.json());

// Helper functions
function readData() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]));
  }
  const data = fs.readFileSync(dataFile);
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

// GET all staff / by id
app.get("/api/staff", (req, res) => {
  const staff = readData();
  const { id } = req.query;

  if (id) {
    const employee = staff.find(e => e.id == id);
    return res.json(employee || {});
  }
  res.json(staff);
});

// POST add staff
app.post("/api/staff", (req, res) => {
  const staff = readData();
  const newStaff = req.body;
  newStaff.id = Date.now();
  staff.push(newStaff);
  writeData(staff);
  res.status(201).json(newStaff);
});

// PUT update staff
app.put("/api/staff", (req, res) => {
  const id = req.query.id; // <-- read query param
  const { name, role } = req.body;
  const staff = JSON.parse(fs.readFileSync("staff.json"));
  const index = staff.findIndex(s => s.id == id);

  if (index === -1) {
    return res.status(404).json({ error: "Staff not found" });
  }

  staff[index] = { ...staff[index], name, role };
  fs.writeFileSync("staff.json", JSON.stringify(staff, null, 2));
  res.json(staff[index]);
});

// DELETE staff
app.delete("/api/staff", (req, res) => {
  const id = req.query.id; // <-- read query param
  const staff = JSON.parse(fs.readFileSync("staff.json"));
  const index = staff.findIndex(s => s.id == id);

  if (index === -1) {
    return res.status(404).json({ error: "Staff not found" });
  }

  staff.splice(index, 1);
  fs.writeFileSync("staff.json", JSON.stringify(staff, null, 2));
  res.json({ message: "Staff deleted" });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
