import { Component } from '@angular/core';
import {Folder} from './types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SoulExplorer';
  toggleSidenav = false;
  view = 'library';

  sideNavToggle(): void {
    this.toggleSidenav = !this.toggleSidenav;
  }
}
