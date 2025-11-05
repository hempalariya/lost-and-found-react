import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import User from "../models/User.js";

const userToken = (user) =>{
  return jwt.sign({id: user._id}, process.env.SECRET, {expiresIn: "1d"})
}

const createUser = async (req, res) => {
  try {
    const { userName, email, number, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userName,
      email,
      number,
      password: hashedPassword,
    });
    const token = userToken(newUser)
    res.status(201).json({newUser, token, message: "registration successful"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  const users = await User.find({});
  
  res.status(200).json(users);
};

const getUser = async (req, res) => {
  console.log(req);
};

const loginUser = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(400).json({ message: "Invalid Credentials" });
    const token = userToken(user)
    res.status(200).json({user, token, message: "Login successful"});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createUser, getUsers, getUser, loginUser };
