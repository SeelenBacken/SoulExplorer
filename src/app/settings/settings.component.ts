import {Component, NgZone, OnInit} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {IpcRenderer} from 'electron';

interface Folder {
  label: string;
  filePath: string;
  folderSize: number;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  steamFolders: Folder[];
  public renderer: IpcRenderer;

  constructor(private electronServiceInstance: ElectronService, private ngZone: NgZone) {
    this.steamFolders = [{label: '', filePath: '', folderSize: 1}];
    this.renderer = electronServiceInstance.ipcRenderer;

    this.renderer.on('addSteamLibrary', (event, args) => {
      this.ngZone.run(() => {
        this.steamFolders[args.folderNumber] = {label: args.folderPath, filePath: args.folderPath, folderSize: args.folderNumber};
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

}
