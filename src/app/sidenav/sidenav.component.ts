import {Component, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';
import {Folder} from '../types';
import {ElectronService} from 'ngx-electron';
import {IpcRenderer} from 'electron';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  @Input() toggle: boolean;
  steamGames: Folder[] = [];
  steamGamePaths: string[] = [];
  view = 'library';
  public renderer: IpcRenderer;

  constructor(electronServiceInstance: ElectronService, private ngZone: NgZone) {
    this.renderer = electronServiceInstance.ipcRenderer;

    this.renderer.on('setSteamLibraries', (event, args) => {
      this.ngZone.run(() => {
        this.steamGames = args;
        for (const library of args) {
          console.log('checking Path');
          if (!this.steamGamePaths.includes(library.filePath)) {
            this.steamGamePaths.push(library.filePath);
            console.log(this.steamGamePaths);
          }
        }
      });
    });
  }

  ngOnInit(): void {
    this.renderer.send('loadSteamLibraries');
  }

  setView(view: string): void {
    this.view = view;
  }

  setSteamGames(libraries: Folder[]): void {
    this.steamGames = libraries;
    console.log('Steam Games Set');
    for (const lib of libraries) {
      if (!this.steamGamePaths.includes(lib.filePath)) {
        this.steamGamePaths.push(lib.filePath);
      }
    }
    this.renderer.send('saveSteamLibrary', libraries);
  }
}
