import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { IpcRenderer } from 'electron';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.css']
})
export class MainToolbarComponent implements OnInit {

  @Output() toggle: EventEmitter<any> = new EventEmitter();
  public renderer: IpcRenderer;

  constructor(private electronServiceInstance: ElectronService) {
    this.renderer = this.electronServiceInstance.ipcRenderer;
  }

  ngOnInit(): void {
  }

  onClose(): void {
    this.renderer.send('exit');
  }

  onMinimize(): void {
    this.renderer.send('minimize');
  }

  onMaximize(): void {
    this.renderer.send('maximize');
  }

  onToggleSidenav(): void {
    this.toggle.emit(null);
  }

}
