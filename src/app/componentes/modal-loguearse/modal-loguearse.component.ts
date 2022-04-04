import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-modal-loguearse',
  templateUrl: './modal-loguearse.component.html',
  styleUrls: ['./modal-loguearse.component.scss'],
})
export class ModalLoguearseComponent implements OnInit {

  constructor(
    private modalCtr: ModalController,
    private route: Router,
    ) { }

  ngOnInit() {}

  public cerrarModal() {
    this.modalCtr.dismiss();
  }

  toSignUp() {
    this.route.navigate(["/tabs/login/sign-up"]);
    this.modalCtr.dismiss();
  }

  
  login() {
    this.route.navigate(['/tabs/login']);
    this.modalCtr.dismiss();
}

}
