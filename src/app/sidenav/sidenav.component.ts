import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Folder} from '../types';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Input() toggle: boolean;
  steamGames: Folder[] = [];
  view = 'library';

  constructor() {
  }

  ngOnInit(): void {
  }

  setView(view: string): void {
    this.view = view;
  }

  setSteamGames(games: Folder[]): void {
    this.steamGames = games;
  }
}
