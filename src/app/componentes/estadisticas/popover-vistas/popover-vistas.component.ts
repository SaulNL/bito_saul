import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-popover-vistas',
  templateUrl: './popover-vistas.component.html',
  styleUrls: ['./popover-vistas.component.scss'],
})
export class PopoverVistasComponent implements OnInit {

  @Input() public vistasQR: number;
  @Input() public vistasURL: number;

  constructor() { }

  ngOnInit() {}

}
