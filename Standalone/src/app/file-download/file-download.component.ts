import { Component } from '@angular/core';
import { FileService } from './../file.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // For two-way binding

@Component({
  selector: 'file-download',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  template: `
    <input [(ngModel)]="filename" placeholder="Enter file name" />
    <button (click)="download()">Download</button>
  `,
})
export class FileDownloadComponent {
  filename: string = '';

  constructor(private fileService: FileService) {}

  download(): void {
    this.fileService.downloadFile(this.filename).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.filename;
        a.click();
      },
      (error) => console.error('Error downloading file', error)
    );
  }
}
