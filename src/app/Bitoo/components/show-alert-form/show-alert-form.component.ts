import { Component, OnInit, Input, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-show-alert-form',
  templateUrl: './show-alert-form.component.html',
  styleUrls: ['./show-alert-form.component.scss'],
})
export class ShowAlertFormComponent implements OnInit {
  @Input() public validation: NgForm;
  @Input() public message: string;
  constructor() { }

  ngOnInit() {
  }

}

