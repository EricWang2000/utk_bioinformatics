import { Component } from '@angular/core';
import { FileService } from './../file.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // For two-way binding
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'file-download',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './file-download.component.html',
})
export class FileDownloadComponent {
  filename: string = '';  // Two-way binding to filename input
  downloadUrl: string | null = null;  // Download URL
  error: string | null = null;  // Error message
  data: any;

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
    this.fileService.viewFile(this.filename).subscribe({
      next: (res: any) => {
        this.data = res.data;
  
        const blob = new Blob([this.data], { type: 'application/octet-stream' }); // Adjust MIME type as needed

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a download link
        const a = document.createElement('a');
        a.href = url;
        a.download = this.filename; // Set the filename for download
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading file', err);
        this.error = 'Error downloading file. Please check the file name or try again later.';
      }
    });
  }
}
