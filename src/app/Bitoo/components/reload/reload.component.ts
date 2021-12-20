import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-reload',
  templateUrl: './reload.component.html',
  styleUrls: ['./reload.component.scss'],
})
export class ReloadComponent implements OnInit {
  @Output() public responder = new EventEmitter<any>();
  constructor() { }

  ngOnInit() { }

  public reload(event: any) {
    this.responder.emit({ active: false });
    setTimeout(() => {
      event.target.complete();
      this.responder.emit({ active: true });
    }, 2000);
  }
}
