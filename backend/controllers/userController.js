const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const { checkBody } = require("../modules/checkBody");

// Route pour créer un nouveau compte

exports.signup = async (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    return res.json({ result: false, error: "Missing or empty fields!" });
  }

  try {
    // Vérifier si un utilisateur existe déjà avec ce nom d'utilisateur
    const existingUser = await User.findOne({
      username: { $regex: new RegExp(req.body.username, "i") },
    });

    if (existingUser) {
      return res.json({ result: false, error: "User already exists!" });
    }

    // Hachage du mot de passe
    const hash = bcrypt.hashSync(req.body.password, 10);

    // Création d'un nouvel utilisateur
    const newUser = new User({
      username: req.body.username,
      password: hash,
    });

    // Sauvegarder l'utilisateur dans la base de données
    const savedUser = await newUser.save();

    // Création du token avec l'id et le username
    const token = jwt.sign(
      {
        id: savedUser.id,
        username: savedUser.username, // Inclure le username dans le token
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Retourner la réponse avec le token et les données utilisateur
    res.json({ result: true, token, data: savedUser });
  } catch (error) {
    console.error(
      "Erreur lors de la création de l'utilisateur:",
      error.message
    );
    res.status(500).json({ result: false, error: error.message });
  }
};

// Route pour se connecter (signin)
exports.signin = async (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    return res.json({ result: false, error: "Missing or empty fields!" });
  }

  try {
    const user = await User.findOne({
      username: { $regex: new RegExp(req.body.username, "i") },
    });

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      // Création du token avec l'id et le username
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );
      res.json({ result: true, token, data: user });
    } else {
      res.json({
        result: false,
        error: "User not found or incorrect password",
      });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la connexion de l'utilisateur:",
      error.message
    );
    res.status(500).json({ result: false, error: error.message });
  }
};
