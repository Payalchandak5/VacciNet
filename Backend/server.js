const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const connectDB = require("./config/db");
const vaccineRoutes = require("./routes/vaccineRoutes");
const authRoutes = require("./routes/authRoutes");

// ✅ ADD THIS
const Vaccine = require("./data/vaccines");

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vaccines", vaccineRoutes);

// ✅ Connect DB
connectDB();

// ✅ INSERT DEFAULT VACCINES
async function seedVaccines() {

    const count = await Vaccine.countDocuments();

    if (count === 0) {

        await Vaccine.insertMany([
  {
    "id": 1,
    "name": "BCG",
    "use": "Protection against Tuberculosis",
    "dueWeeks": 0,
    "priority": "high"
  },
  {
    "id": 2,
    "name": "Hepatitis B",
    "use": "Protection against Hepatitis B infection",
    "dueWeeks": 0,
    "priority": "high"
  },
  {
    "id": 3,
    "name": "OPV-0",
    "use": "Protection against Polio",
    "dueWeeks": 0,
    "priority": "high"
  },
  {
    "id": 4,
    "name": "Pentavalent-1",
    "use": "Protection against Diphtheria, Pertussis, Tetanus, Hepatitis B, Hib",
    "dueWeeks": 6,
    "priority": "high"
  },
  {
    "id": 5,
    "name": "OPV-1",
    "use": "Protection against Polio",
    "dueWeeks": 6,
    "priority": "high"
  },
  {
    "id": 6,
    "name": "Rotavirus-1",
    "use": "Protection against Rotavirus diarrhea",
    "dueWeeks": 6,
    "priority": "medium"
  },
  {
    "id": 7,
    "name": "PCV-1",
    "use": "Protection against Pneumococcal diseases",
    "dueWeeks": 6,
    "priority": "medium"
  },
  {
    "id": 8,
    "name": "Pentavalent-2",
    "use": "Second dose for DPT, Hepatitis B, Hib",
    "dueWeeks": 10,
    "priority": "high"
  },
  {
    "id": 9,
    "name": "OPV-2",
    "use": "Second dose Polio vaccine",
    "dueWeeks": 10,
    "priority": "high"
  },
  {
    "id": 10,
    "name": "Rotavirus-2",
    "use": "Second dose Rotavirus vaccine",
    "dueWeeks": 10,
    "priority": "medium"
  },
  {
    "id": 11,
    "name": "Pentavalent-3",
    "use": "Third dose for DPT, Hepatitis B, Hib",
    "dueWeeks": 14,
    "priority": "high"
  },
  {
    "id": 12,
    "name": "OPV-3",
    "use": "Third dose Polio vaccine",
    "dueWeeks": 14,
    "priority": "high"
  },
  {
    "id": 13,
    "name": "Rotavirus-3",
    "use": "Third dose Rotavirus vaccine",
    "dueWeeks": 14,
    "priority": "medium"
  },
  {
    "id": 14,
    "name": "IPV",
    "use": "Inactivated Polio Vaccine",
    "dueWeeks": 14,
    "priority": "high"
  },
  {
    "id": 15,
    "name": "Measles-Rubella-1",
    "use": "Protection against Measles and Rubella",
    "dueWeeks": 36,
    "priority": "high"
  },
  {
    "id": 16,
    "name": "Japanese Encephalitis-1",
    "use": "Protection against Japanese Encephalitis",
    "dueWeeks": 36,
    "priority": "low"
  },
  {
    "id": 17,
    "name": "DPT Booster-1",
    "use": "Booster for Diphtheria, Pertussis, Tetanus",
    "dueWeeks": 72,
    "priority": "medium"
  },
  {
    "id": 18,
    "name": "OPV Booster",
    "use": "Booster dose for Polio",
    "dueWeeks": 72,
    "priority": "medium"
  },
  {
    "id": 19,
    "name": "Measles-Rubella-2",
    "use": "Second dose against Measles and Rubella",
    "dueWeeks": 72,
    "priority": "high"
  },
  {
    "id": 20,
    "name": "DPT Booster-2",
    "use": "Second booster for Diphtheria, Pertussis, Tetanus",
    "dueWeeks": 260,
    "priority": "medium"
  },
  {
    "id": 21,
    "name": "Td",
    "use": "Protection against Tetanus and Diphtheria",
    "dueWeeks": 520,
    "priority": "medium"
  },
  {
    "id": 22,
    "name": "HPV",
    "use": "Protection against Human Papillomavirus",
    "dueWeeks": 624,
    "priority": "medium"
  }
]);

        console.log("✅ Vaccines Inserted");
    } else {
        console.log("✅ Vaccines already exist");
    }
}

// ✅ CALL FUNCTION
seedVaccines();

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});