import { Injectable } from "@angular/core";
import { Ingredient } from "../models/ingredient.model";
import { Recipe } from "../models/recipe.model";

@Injectable({
    providedIn: 'root'
})
export class RecipesDummyDataService {

    private recipesDummyData: Recipe[] = [
        new Recipe(
            "Pizza",
            "Pizza hot",
            "https://static.toiimg.com/thumb/56933159.cms?imgsize=686279&width=800&height=800",
            [
                new Ingredient("Chips", 1),
                new Ingredient("Bread", 2),
                new Ingredient("CocaCola", 1),
            ]
        ),
        new Recipe(
            "Burger",
            "Burger king",
            "https://pinchofyum.com/wp-content/uploads/Tofu-Burgers-Square.jpg",
            [
                new Ingredient("Tomato", 1),
                new Ingredient("Banana", 2)
            ]
        ),
        new Recipe(
            "Sushi",
            "Traditional Japanese dish",
            "https://www.riomare.com.mt/wp-content/uploads/2020/06/sushi.jpg",
            [
                new Ingredient("Onion", 2),
                new Ingredient("Hot sauce", 1)
            ]
        )
    ];

    getRecipesDummyData() {
        return this.recipesDummyData;
    }
}