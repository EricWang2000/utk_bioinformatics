import { Component } from '@angular/core';
import { FileService } from './../file.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // For two-way binding
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'file-download',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './file-download.component.html',
})
export class FileDownloadComponent {
  filename: string = '';  // Two-way binding to filename input
  downloadUrl: string | null = null;  // Download URL
  error: string | null = null;  // Error message

  constructor(private fileService: FileService) {}

  download(): void {
    this.error = null;  // Clear previous error
    this.downloadUrl = null;  // Reset download URL

    // Check if filename is provided
    if (!this.filename) {
      this.error = 'Please provide a valid file name';
      return;
    }

    // Call the service to download the file
    this.fileService.downloadFile(this.filename).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        this.downloadUrl = url;
      },
      error: (err) => {
        console.error('Error downloading file', err);
        this.error = 'Error downloading file. Please check the file name or try again later.';
      }
    });
  }
}
