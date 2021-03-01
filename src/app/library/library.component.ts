import {Component, Input, OnInit} from '@angular/core';
import {Folder} from '../types';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  @Input() steamLibrary: Folder[];

  constructor() { }

  ngOnInit(): void {
  }

}
