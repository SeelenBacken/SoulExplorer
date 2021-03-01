import {Component, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {IpcRenderer} from 'electron';
import {Folder} from '../types';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  @Output() steamGames: EventEmitter<Folder[]> = new EventEmitter();
  @Input() LibraryPaths: string[];

  public steamFolders: Folder[];
  public renderer: IpcRenderer;

  constructor(private electronServiceInstance: ElectronService, private ngZone: NgZone) {
    this.steamFolders = [{label: '', filePath: '', folderSize: 1}];
    this.renderer = electronServiceInstance.ipcRenderer;

    this.renderer.on('addSteamLibrary', (event, args) => {
      this.ngZone.run(() => {
        this.steamFolders[args.folderNumber - 1] = {label: args.folderPath, filePath: args.folderPath, folderSize: args.folderNumber};
      });
    });

    this.renderer.on('scannedSteamLibraries', (event, args) => {
      this.ngZone.run(() => {
        this.steamGames.emit(args);
      });
    });
  }

  ngOnInit(): void {
  }

  addNewLibrary(): void {
    this.steamFolders.push({label: '', filePath: '', folderSize: this.steamFolders.length + 1});
  }

  openLibraryFolder(folderNumber: number): void {
    this.renderer.send('openNewLibrary', folderNumber);
  }

  onScanLibraries(): void {
    this.renderer.send('scanSteamLibraries', this.steamFolders);
  }

}
