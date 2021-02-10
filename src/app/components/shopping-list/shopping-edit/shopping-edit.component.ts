import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from 'src/app/models/ingredient.model';
import { ShoppingListService } from 'src/app/services/shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('shoppingListForm', {static: false}) shoppingListForm: NgForm;
  ingredientEditingSubscription: Subscription;
  editMode = false;
  editedIngredientIndex: number;
  editedIngredient: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredientEditingSubscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editedIngredientIndex = index;
        this.editMode = true;
        this.editedIngredient = this.shoppingListService.getIngredient(index);
        this.shoppingListForm.setValue({
          name: this.editedIngredient.name,
          amount: this.editedIngredient.amount
        })
      }
    );
  }

  onSubmit(shoppingListForm: NgForm) {
    const newIngredient = shoppingListForm.form.value;
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editedIngredientIndex, newIngredient);
    } else {
      this.shoppingListService.addIngredient(newIngredient);
    }
    this.editMode = false;
    this.shoppingListForm.reset();
  }

  onClear() {
    this.editMode = false;
    this.shoppingListForm.reset();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editedIngredientIndex);
    this.onClear();
  }

  ngOnDestroy() {
    this.ingredientEditingSubscription.unsubscribe();
  }

}
