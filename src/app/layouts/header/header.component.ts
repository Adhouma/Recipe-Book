import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuthenticated = false;
  userSubscription: Subscription;

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(
      (user: User) => {
      if (user) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    });
  }

  onSaveData() {
    this.recipeService.storeRecipes();
  }

  onFetchData() {
    this.recipeService.fetchRecipes();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}
