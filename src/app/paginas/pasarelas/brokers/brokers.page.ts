import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-brokers',
  templateUrl: './brokers.page.html',
  styleUrls: ['./brokers.page.scss'],
})
export class BrokersPage implements OnInit {
    idNegocio: string;

  constructor(  private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
        .subscribe(params => {
              this.idNegocio = params.idNegocio;
            }
        );
  }

}
