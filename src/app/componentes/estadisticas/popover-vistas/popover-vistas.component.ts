import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover-vistas',
  templateUrl: './popover-vistas.component.html',
  styleUrls: ['./popover-vistas.component.scss'],
})
export class PopoverVistasComponent implements OnInit {

  @Input() public visitasQR: number;
  @Input() public visitasURL: number;

  constructor() { }

  ngOnInit() {
    if (isNaN(Number(this.visitasQR))) {
      this.visitasQR = 0;
    }

    if (isNaN(Number(this.visitasURL))) {
      this.visitasURL = 0;
    }
  }

}
