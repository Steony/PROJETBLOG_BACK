const jwt = require("jsonwebtoken");

// Middleware d'authentification
const auth = async (req, res, next) => {
  try {
    // Vérifie si les cookies sont disponibles
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({ error: "Not Authorized." });
    }

    // Vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajoute les informations utilisateur décodées à la requête
    req.user = decoded;

    next(); // Passe au middleware suivant ou au contrôleur
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = { authenticate: auth };
