import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pop-over-visits',
  templateUrl: './pop-over-visits.component.html',
  styleUrls: ['./pop-over-visits.component.scss'],
})
export class PopOverVisitsComponent implements OnInit {
@Input() public visitsByQr: number;
@Input() public visitsByUrl: number;
  constructor() { }

  ngOnInit() {}

}
