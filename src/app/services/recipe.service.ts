import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Recipe } from '../models/recipe.model';
import { User } from '../models/user.model';
import { RecipesDummyDataService } from './recipes-dummy-data.service';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  /**
   * Inform if any new recipe added to the recipes array
   * return the new recipes array
   */
  recipesChanged = new Subject<Recipe[]>();
  loggedInUser: User;

  constructor(
    private http: HttpClient,
    private recipesDummyDataService: RecipesDummyDataService
  ) { }

  private API = 'https://recipe-book-e9093-default-rtdb.firebaseio.com/';

  // Fields
  private recipes: Recipe[] = this.recipesDummyDataService.getRecipesDummyData();

  storeRecipes() {
    this.http.put(this.API + 'recipes.json', this.recipes).subscribe();
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.API + 'recipes.json').pipe(
      tap((recipes: Recipe[]) => {
        this.setRecipes(recipes);
      })
    ).subscribe();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    // Return a copy of recipes array
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
