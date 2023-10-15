const express = require('express');
const recipeController = require('../controllers/recipe.js');
const userController = require('.././controllers/user.js');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const config = require('../config');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      try {
        
        fs.lstatSync(`./public/${req.user.user_id}/images`).isDirectory();
      } catch {
      
        fs.mkdirSync(`./public/${req.user.user_id}/images`, { recursive: true });
      }
  
      callback(null, `./public/${req.user.user_id}/images`);
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    }
  });
  
  const allowedFileTypes = (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const upload = multer({ storage: storage, fileFilter: allowedFileTypes });

router.post('/api/create-account', userController.createAccount);
router.put('/api/create-account/:id', config.tokenVerification, upload.single("image"), userController.updateAccount);
router.post('/api/login', userController.login);
router.get('/api/account/:id', userController.getUserById);

router.get('/api/recipes', recipeController.getRecipes);
router.get('/api/my-recipes', config.tokenVerification, recipeController.getMyRecipes);
router.get('/api/recipes/:id', config.tokenVerification, recipeController.getRecipeById);
router.post('/api/recipes', config.tokenVerification, upload.single("recipeImage"), recipeController.createRecipe);
router.delete('/api/recipes/:id', config.tokenVerification, recipeController.deleteRecipe);
router.put('/api/recipes/:id', config.tokenVerification, upload.single("recipeImage"), recipeController.editRecipe);
router.put('/api/recipes/:id/like', config.tokenVerification, recipeController.likeRecipe);
router.put('/api/recipes/:id/unlike', config.tokenVerification, recipeController.unlikeRecipe);

module.exports = router;