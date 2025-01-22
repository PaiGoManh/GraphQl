const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");
const { buildSchema } = require("graphql");
require("dotenv").config();

const app = express();
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Mongoose Models
const Recipe = mongoose.model("Recipe", {
  title: String,
  category: String,
  ingredients: [String],
  instructions: String,
  popularity: Number,
});

// GraphQL Schema
const schema = buildSchema(`
  type Recipe {
    id: ID!
    title: String!
    category: String!
    ingredients: [String!]!
    instructions: String!
    popularity: Int!
  }

  type Query {
    recipes: [Recipe!]!
    recipe(id: ID!): Recipe
    popularRecipes: [Recipe!]!
  }

  type Mutation {
    addRecipe(
      title: String!,
      category: String!,
      ingredients: [String!]!,
      instructions: String!,
      popularity: Int!
    ): Recipe

    updateRecipe(
      id: ID!,
      title: String,
      category: String,
      ingredients: [String!],
      instructions: String,
      popularity: Int
    ): Recipe

    deleteRecipe(id: ID!): Recipe
  }
`);

// Resolvers
const root = {
  recipes: async () => await Recipe.find(),
  recipe: async ({ id }) => await Recipe.findById(id),
  popularRecipes: async () => await Recipe.find().sort({ popularity: -1 }).limit(5),

  addRecipe: async ({ title, category, ingredients, instructions, popularity }) => {
    const newRecipe = new Recipe({ title, category, ingredients, instructions, popularity });
    return await newRecipe.save();
  },

  updateRecipe: async ({ id, title, category, ingredients, instructions, popularity }) => {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { title, category, ingredients, instructions, popularity },
      { new: true }
    );
    return updatedRecipe;
  },

  deleteRecipe: async ({ id }) => {
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    return deletedRecipe;
  },
};

// GraphQL Endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});
