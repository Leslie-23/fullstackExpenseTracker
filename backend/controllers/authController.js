const firebaseAdmin = require("firebase-admin");
const User = require("../models/User");

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await firebaseAdmin.auth().createUser({
      email,
      password,
    });

    const newUser = new User({
      uid: userRecord.uid,
      email: userRecord.email,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await firebaseAdmin.auth().getUserByEmail(email);
    const user = await User.findOne({ uid: userRecord.uid });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
