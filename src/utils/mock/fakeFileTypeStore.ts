import { v4 as uuid } from 'uuid';
import { FileType } from '../../types/FileType';

const fileTypes: FileType[] = [
  {
    language: "printscript 1.1",
    extension: "prs",
  },
  {
    language: "printscript 1.0",
    extension: "prs",
  },
];

export class FakeFileTypeStore {
  private readonly fileTypes: FileType[] = [];

  constructor() {
    this.fileTypes = fileTypes;
  }

  getFileTypes(): FileType[] {
    return this.fileTypes;
  }
}
