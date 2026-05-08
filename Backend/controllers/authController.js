
const User = require("../models/User");

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const user = await User.create({ name, email, password });

        res.json(user);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Signup failed" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const user = await User.findOne({ email, password });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json(user);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login failed" });
    }
};