import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  recipeId: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.recipeId = +params['id'];
        if (params['id'] != null) {
          this.editMode = params['id'];
        }
        // Init form whenever the route change
        this.initForm();
      }
    );
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.recipeId);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9][0-9]*$/)
              ])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  get ingredientsControls() {
    return (<FormArray> this.recipeForm.get('ingredients')).controls;
  }

  onSubmit() {
    const newRecipe = new Recipe(
      this.recipeForm.get('name').value,
      this.recipeForm.get('description').value,
      this.recipeForm.get('imagePath').value,
      this.recipeForm.get('ingredients').value,
    );

    if (this.editMode) {
      this.recipeService.updateRecipe(this.recipeId, newRecipe);
    } else {
      this.recipeService.addRecipe(newRecipe);
    }

    this.router.navigate(['recipes']);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }

  onAddIngredient() {
    (<FormArray> this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9][0-9]*$/)
        ])
      })
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray> this.recipeForm.get('ingredients')).removeAt(index);
  }

}
