
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() public message: string;
  @Input() public backButton: boolean;
  @Input() public closeButton: boolean;
  @Output() public closeResponse = new EventEmitter<any>();
  @Output() public backButtonResponse = new EventEmitter<any>();
  constructor() { }

  ngOnInit() { }

  public close() {
    this.closeResponse.emit();
  }
  public back() {
    this.backButtonResponse.emit();
  }
}

