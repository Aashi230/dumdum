const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/hostelDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const complaintSchema = new mongoose.Schema({
    name: String,
    campusId: String,
    room: String,
    type: String,
    description: String,
    status: {
        type: String,
        default: "Pending"
    }
});

const Complaint = mongoose.model("Complaint", complaintSchema);

// Home route
app.get("/", (req, res) => {
    res.send("Backend is working 🚀");
});

// Submit Complaint
app.post("/complaint", async (req, res) => {
    try {
        const complaint = new Complaint(req.body);
        await complaint.save();

        res.json({
            success: true,
            id: complaint._id
        });
    } catch (err) {
        console.log(err);
        res.json({ success: false });
    }
});

// Track Complaint
app.get("/complaint/:id", async (req, res) => {
    const data = await Complaint.findById(req.params.id);

    if (!data) return res.json({ success: false });

    res.json({ success: true, data });
});
// Update Status
app.put("/complaint/:id", async (req, res) => {
    try {
        await Complaint.findByIdAndUpdate(req.params.id, {
            status: req.body.status
        });

        res.json({ success: true });
    } catch {
        res.json({ success: false });
    }
});

// Start Server
app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});