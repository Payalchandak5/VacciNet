const Vaccine = require("../data/vaccines");

function calculateAgeInWeeks(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    const diffTime = today - birth;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
}

function formatDue(dueWeeks) {
    if (dueWeeks === 0) return "At birth";
    if (dueWeeks < 52) return `${dueWeeks} weeks`;
    return `${Math.floor(dueWeeks / 52)} years`;
}

exports.getVaccines = async (req, res) => {
    try {
        const { name, birthDate, takenVaccines = [] } = req.body;

        const ageWeeks = calculateAgeInWeeks(birthDate);

        // ✅ Fetch from DB
        let vaccineList = await Vaccine.find({
            dueWeeks: { $lte: ageWeeks }
        });

        // ✅ Remove taken
        vaccineList = vaccineList.filter(v => !takenVaccines.includes(v.id));

        let remainingVaccines = {};

        vaccineList.forEach(v => {
            remainingVaccines[v.id] = {
                name: v.name,
                use: v.use,
                due: formatDue(v.dueWeeks),
                priority: v.priority || "low"
            };
        });

        res.json({ name, ageWeeks, remainingVaccines });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};