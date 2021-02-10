import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  // Fields
  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ];

  /**
   * Inform if any new ingredient added to the ingredients array
   * return the new ingredient array
   */
  ingredientsChanged = new Subject<Ingredient[]>();
  // Fire when edit ingredient
  startedEditing = new Subject<number>()

  // Constructor
  constructor() { }

  // Methods
  getIngredients() {
    // Return only a copy of the ingredients array
    return this.ingredients.slice();
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  addIngredient(ingredient: Ingredient) {
    const existingIngredient = this.ingredients
      .find(el => el.name.toLowerCase() === ingredient.name.toLowerCase());
    if (existingIngredient) {
      existingIngredient.amount += parseInt(ingredient.amount.toString());
      this.ingredientsChanged.next(this.ingredients.slice());
    } else {
      this.ingredients.push(ingredient);
      this.ingredientsChanged.next(this.ingredients.slice());
    }
  }

  addIngredients(ingredients: Ingredient[]) {
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
