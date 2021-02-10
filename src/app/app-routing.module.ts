import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { RecipeDetailsComponent } from './components/recipes/recipe-details/recipe-details.component';
import { RecipeEditComponent } from './components/recipes/recipe-edit/recipe-edit.component';
import { RecipeStartComponent } from './components/recipes/recipe-start/recipe-start.component';
import { RecipesComponent } from './components/recipes/recipes.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { AuthGuardService } from './services/auth-guard.service';

// App routes
const appRoutes: Routes = [
    {
        path: 'recipes', component: RecipesComponent, canActivate: [AuthGuardService], children: [
            { path: '', component: RecipeStartComponent },
            { path: 'new', component: RecipeEditComponent },
            { path: ':id', component: RecipeDetailsComponent },
            { path: ':id/edit', component: RecipeEditComponent },
        ]
    },
    { path: 'shopping-list', component: ShoppingListComponent, canActivate: [AuthGuardService] },
    { path: 'auth', component: AuthComponent },
    { path: '', redirectTo: 'recipes', pathMatch: 'full' },
    { path: '**', redirectTo: 'recipes' }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}