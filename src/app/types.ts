export interface Game {
  name: string;
  folderPath: string;
  exes: Exe[];
}

export interface Folder {
  label: string;
  filePath: string;
  folderSize: number;
  scanned?: boolean;
  games?: Game[];
}

export interface Exe {
  filePath: string;
  label: string;
}
