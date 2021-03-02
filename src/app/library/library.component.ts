import {Component, Input, OnInit} from '@angular/core';
import {Folder} from '../types';
import {ElectronService} from 'ngx-electron';
import {IpcRenderer} from 'electron';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  @Input() steamLibrary: Folder[];
  public renderer: IpcRenderer;

  constructor(electronServiceInstance: ElectronService) {
    this.renderer = electronServiceInstance.ipcRenderer;
  }

  ngOnInit(): void {
  }

  onExe(path: string): void {
    this.renderer.send('startExe', path);
  }

}
