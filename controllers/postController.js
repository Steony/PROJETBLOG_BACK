const Post = require("../models/post");
const User = require("../models/user");
const mongoose = require("mongoose");

// Récupérer tous les posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "username");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts", error);
    res
      .status(500)
      .json({
        message: "Erreur serveur lors de la récupération des posts",
        error: error.message,
      });
  }
};

// Créer un nouveau post
const createPost = async (req, res) => {
  try {
    const { text } = req.body;

    // Utilisation de l'ID utilisateur dans req.userId
    const userRecord = await User.findById(req.userId);
    if (!userRecord) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const newPost = new Post({
      text,
      user: userRecord._id, // Associer l'utilisateur au post
      username: userRecord.username,
    });

    // Sauvegarder le post
    const savedPost = await newPost.save();

    // Ajouter le post à la liste des posts de l'utilisateur
    userRecord.posts.push(savedPost._id);
    await userRecord.save();

    res.status(201).json(savedPost); // Retourner le post créé
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    res
      .status(400)
      .json({
        message: "Erreur lors de la création du post",
        error: error.message,
      });
  }
};

// Mettre à jour un post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // Vérifier si l'utilisateur est le propriétaire du post
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    post.text = text;
    await post.save(); // Sauvegarder le post modifié

    res.status(200).json(post); // Retourner le post mis à jour
  } catch (error) {
    console.error("Erreur lors de la mise à jour du post:", error);
    res
      .status(400)
      .json({
        message: "Erreur lors de la mise à jour du post",
        error: error.message,
      });
  }
};

// Supprimer un post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // Vérifier si l'utilisateur est le propriétaire du post
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    await post.remove(); // Supprimer le post
    const user = await User.findById(post.user);

    if (user) {
      user.posts.pull(post._id); // Retirer le post de la liste de l'utilisateur
      await user.save();
    }

    res.status(200).json({ message: "Post supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du post:", error);
    res
      .status(400)
      .json({
        message: "Erreur lors de la suppression du post",
        error: error.message,
      });
  }
};

// Ajouter un like à un post
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }

    // Vérifier si l'utilisateur a déjà liké le post
    if (post.likes.includes(req.userId)) {
      return res.status(400).json({ message: "Vous avez déjà liké ce post" });
    }

    // Ajouter l'ID de l'utilisateur aux likes du post
    post.likes.push(req.userId);
    await post.save(); // Sauvegarder les changements

    res.status(200).json(post); // Retourner le post mis à jour
  } catch (error) {
    console.error("Erreur lors de l'ajout du like:", error);
    res
      .status(400)
      .json({
        message: "Erreur lors de l'ajout du like",
        error: error.message,
      });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
};
