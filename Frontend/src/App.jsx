import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_RECIPES, ADD_RECIPE, DELETE_RECIPE, UPDATE_RECIPE } from "./graphql";

const App = () => {
  const { loading, error, data, refetch } = useQuery(GET_RECIPES);
  const [addRecipe] = useMutation(ADD_RECIPE);
  const [deleteRecipe] = useMutation(DELETE_RECIPE);
  const [updateRecipe] = useMutation(UPDATE_RECIPE);

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    category: "",
    ingredients: "",
    instructions: "",
    popularity: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddRecipe = async () => {
    await addRecipe({
      variables: {
        ...formData,
        ingredients: formData.ingredients.split(",").map((i) => i.trim()),
        popularity: parseInt(formData.popularity),
      },
    });
    refetch();
    setFormData({
      id: "",
      title: "",
      category: "",
      ingredients: "",
      instructions: "",
      popularity: 0,
    });
  };

  const handleDeleteRecipe = async (id) => {
    await deleteRecipe({ variables: { id } });
    refetch();
  };

  const handleUpdateRecipe = async () => {
    await updateRecipe({
      variables: {
        id: formData.id,
        title: formData.title || undefined,
        category: formData.category || undefined,
        ingredients: formData.ingredients || undefined,
        instructions: formData.instructions || undefined,
        popularity: formData.popularity ? parseInt(formData.popularity) : undefined,
      },
    });
    refetch();
    setFormData({
      id: "",
      title: "",
      category: "",
      ingredients: "",
      instructions: "",
      popularity: 0,
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Recipe Manager</h1>

      {/* Recipe Form */}
      <div>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="ingredients"
          placeholder="Ingredients (comma-separated)"
          value={formData.ingredients}
          onChange={handleInputChange}
        />
        <textarea
          name="instructions"
          placeholder="Instructions"
          value={formData.instructions}
          onChange={handleInputChange}
        ></textarea>
        <input
          type="number"
          name="popularity"
          placeholder="Popularity"
          value={formData.popularity}
          onChange={handleInputChange}
        />
        <button onClick={handleAddRecipe}>Add Recipe</button>
        <button onClick={handleUpdateRecipe}>Update Recipe</button>
      </div>

      {/* Recipe List */}
      <ul>
        {data.recipes.map((recipe) => (
          <li key={recipe.id}>
            <h2>{recipe.title}</h2>
            <p>Category: {recipe.category}</p>
            <p>Ingredients: {recipe.ingredients.join(", ")}</p>
            <p>Instructions: {recipe.instructions}</p>
            <p>Popularity: {recipe.popularity}</p>
            <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
            <button onClick={() => setFormData(recipe)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
