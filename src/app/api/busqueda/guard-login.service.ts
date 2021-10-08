import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class GuardLoginService implements CanActivate {

  constructor(private router: Router) {

  }

  canActivate(route): boolean {
    const optionLogin = localStorage.getItem('optionLogin');
    if (optionLogin != null) {
      localStorage.removeItem('optionLogin');
    }
    return true;
  }
}
