import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Input() toggle: boolean;
  view = 'library';

  constructor() {
  }

  ngOnInit(): void {
  }

  setView(view: string): void {
    this.view = view;
  }

}
