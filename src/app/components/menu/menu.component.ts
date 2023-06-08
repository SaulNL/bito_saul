import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() { }

  openCat() {
    localStorage.removeItem('byCategorias');
    localStorage.setItem('isRedirected', 'false');
    this.router.navigate(['/tabs/categorias']);
  }
  openSug() {
    this.router.navigate(['/tabs/mis-sugerencias']);
  }

}
