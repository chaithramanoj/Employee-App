// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection (replace <username>, <password>, <dbname>)
mongoose.connect("YOUR_MONGODB_ATLAS_URI", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ DB Connection Error:", err));

// Schema & Model
const employeeSchema = new mongoose.Schema({
  name: String,
  designation: String,
  location: String,
  salary: Number
});

const Employee = mongoose.model("Employee", employeeSchema);

// ------------------ API Routes ------------------

// Get all employees
app.get("/api/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Get one employee
app.get("/api/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Add new employee
app.post("/api/employees", async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.json(newEmployee);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// Update employee
app.put("/api/employees/:id", async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmployee) return res.status(404).json({ error: "Employee not found" });
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// Delete employee
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ------------------ Serve Frontend ------------------
app.use(express.static(path.join(__dirname, "dist")));  // or "build"

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ------------------ Start Server ------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
