const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
    recipeTitle: String,
    recipeCategory: String,
    prepTime: Number,
    numberOfPeople: Number,
    shortDescription: String, 
    description: String,
    recipeImage: String,
    creationDate: Date,
    createdBy: String,
    likedBy: Array
});

module.exports = mongoose.model('recipe', recipeSchema);