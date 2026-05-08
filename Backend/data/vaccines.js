const mongoose = require("mongoose");

const vaccineSchema = new mongoose.Schema({
    id: Number,
    name: String,
    use: String,
    dueWeeks: Number,
    priority: String
});

module.exports = mongoose.model("Vaccine", vaccineSchema);