import { gql } from "@apollo/client";

export const GET_RECIPES = gql`
  query {
    recipes {
      id
      title
      category
      ingredients
      instructions
      popularity
    }
  }
`;

export const ADD_RECIPE = gql`
  mutation AddRecipe(
    $title: String!
    $category: String!
    $ingredients: [String!]!
    $instructions: String!
    $popularity: Int!
  ) {
    addRecipe(
      title: $title
      category: $category
      ingredients: $ingredients
      instructions: $instructions
      popularity: $popularity
    ) {
      id
      title
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id) {
      id
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation UpdateRecipe(
    $id: ID!
    $title: String
    $category: String
    $ingredients: [String!]
    $instructions: String
    $popularity: Int
  ) {
    updateRecipe(
      id: $id
      title: $title
      category: $category
      ingredients: $ingredients
      instructions: $instructions
      popularity: $popularity
    ) {
      id
      title
    }
  }
`;
