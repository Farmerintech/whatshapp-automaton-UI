import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/UserModel.js";

const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email is already registered
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({ username, email, password: hashedPassword });

    // Generate token
    const token = generateToken(user);

    res.json({ token, user: { id: user.id, username, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate token
    const token = generateToken(user);

    res.json({ token, user: { id: user.id, username: user.username, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};
