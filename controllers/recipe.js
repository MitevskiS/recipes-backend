const recipe = require("../models/recipe");

module.exports = {
  createRecipe: async (req, res) => {
    try {
      const newRecipe = new recipe({
        recipeTitle: req.body.recipeTitle,
        recipeCategory: req.body.recipeCategory,
        prepTime: req.body.prepTime,
        numberOfPeople: req.body.numberOfPeople,
        shortDescription: req.body.shortDescription,
        description: req.body.description,
        // recipeImage: req.body.recipeImage,
        recipeImage: req.file.originalname,
        createdBy: req.user.user_id,
        creationDate: new Date(),
        likedBy: []
      });
      await newRecipe.save();

      res.status(200).send("Recipe successfully added in database");
    } catch (error) {
      res.status(400).send(error.message);
    }
  },

   getRecipes: async (req, res) => {
      const category = req.query?.category;
      const search = req.query?.search;
      const recipes = await recipe.find();
      if (recipes.length > 0) {
        if (category === 'freshAndNew') {
          const list = recipes.sort(
            (objA, objB) => Number(objA.creationDate) - Number(objB.creationDate),
          );
          res.send(list.slice(-3).reverse());
        } else if (category === 'mostPopular') {
          const list = recipes.sort(
            (objA, objB) => Number(objA.likedBy?.length) - Number(objB.likedBy?.length),
          );
          res.send(list.slice(-6).reverse());
        } else if (category && category !== 'freshAndNew' && category !== 'mostPopular') {
          const list = recipes.filter((item) => item.recipeCategory === category);
          res.send(list);
        } else if (search) {
          // let result = recipes.filter((item) => item.recipeTitle.toLowercase() === search.toLowercase());
          // let result = await recipe.findIndex((item) =>  item.recipeTitle.toLowerCase() === search.toLowerCase());
          let result = await recipe.find({ recipeTitle: search });
          if (result) {
            res.send(result);
          } else {
            res.send("Recipe not found");
          }
        } else {
          res.send(recipes);
        }
      } else {
        res.send([]);
      }
   },

   getMyRecipes: async (req, res) => {
    const recipes = await recipe.find({
      createdBy: req.user.user_id,
    });
    if (recipes.length > 0) {
      res.send(recipes);
    }
 },

   getRecipeById: async (req, res) => {
    let result = await recipe.findOne({ _id: req.params.id });
    if (result) {
      res.send(result);
    } else {
      res.send("Recipe not found");
    }
  },

   deleteRecipe: async (req, res) => {
    let result = await recipe.deleteOne({ _id: req.params.id });
    res.send(result);
   },

   editRecipe: async (req, res) => {
    let editedRecipe = await recipe.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.send(editedRecipe);
  },

  likeRecipe: async (req, res) => {
    let recipeObj = await recipe.findOne({ _id: req.params.id });
    let likedBy = [...recipeObj.likedBy];
    if (!likedBy.includes(req.user.user_id)) {
      likedBy.push(req.user.user_id);
    }
    await recipe.updateOne(
      { _id: req.params.id },
      { $set: {...req.body, likedBy } },
      { returnOriginal: false }
    );
    res.send(likedBy);
  },

  unlikeRecipe: async (req, res) => {
    let recipeObj = await recipe.findOne({ _id: req.params.id });
    let likedBy = [...recipeObj.likedBy];
    if (likedBy.includes(req.user.user_id)) {
      const item = likedBy.find((i) => i === req.user.user_id);
      const index = likedBy.indexOf(item);
      likedBy.splice(index, 1);
    }
    await recipe.updateOne(
      { _id: req.params.id },
      { $set: {...req.body, likedBy } },
      { returnOriginal: false }
    );
    res.send(likedBy);
  },
};
