/*const express = require("express");
const router = express.Router();

const { calculateAge, getVaccines } = require("../utils/vaccineLogic");

router.post("/vaccines", (req, res) => {
    try {
        const { name, birthDate, takenVaccines } = req.body;

        // Validation
        if (!name || !birthDate) {
            return res.status(400).json({
                error: "Name and Birth Date are required"
            });
        }

        // Calculate age
        const age = calculateAge(birthDate);

        // Get vaccines based on age
        let vaccines = getVaccines(age);

        // Remove already taken vaccines
        if (takenVaccines && takenVaccines.length > 0) {
            takenVaccines.forEach(id => {
                delete vaccines[id];
            });
        }

        res.json({
            name,
            age: age.toFixed(2),
            remainingVaccines: vaccines
        });

    } catch (error) {
        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

module.exports = router;*/
const express = require("express");
const router = express.Router();

const { getVaccines } = require("../controllers/vaccineController");

router.post("/", getVaccines);
router.post("/saveHospital", async (req, res) => {
    const { name, selectedHospital } = req.body;

    await User.findOneAndUpdate(
        { name },
        { selectedHospital },
        { new: true }
    );

    res.json({ message: "Hospital saved" });
});

module.exports = router;