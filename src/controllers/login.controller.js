import jwt from "jsonwebtoken";
import db from "../models/index.js";
console.log('hh',Object.keys(db));
const { User } = db;
export default async function login(req, res) {
    const { email, password } = req.body;
    console.log(email, password)
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    if (req.body.remember) {
        const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, { expiresIn: "30d" });
        res.json({ token, user });
    } else {
        const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, { expiresIn: "10h" });
        res.json({ token, user });
    }
}
