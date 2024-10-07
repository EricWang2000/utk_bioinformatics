import { Component } from '@angular/core';
import { FileService } from './../file.service';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'file-upload',
  standalone: true,
  templateUrl: './file-upload.component.html', // Reference to the HTML file
  styleUrls: ['./file-upload.component.css'], // Reference to the CSS file
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule], // Import CommonModule and HttpClientModule
})
export class FileUploadComponent {
  selectedFile: File | null = null; // The file to be uploaded
  name: string = ''; // Name field from the form
  pattern: string = ''; // Pattern field from the form
  statusMessage: string = ''; // Status message (success or error)

  constructor(private fileService: FileService, private router: Router) {}

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Store the selected file
    }
  }

  // Handle file upload
  upload(): void {
    if (this.selectedFile && this.name) {
      const formData = new FormData();
      formData.append('file', this.selectedFile); // Add the file to the form data
      formData.append('name', this.name); // Add the name field
      formData.append('pattern', this.pattern); // Add the pattern field
      console.log(this.selectedFile.name.endsWith('pdb'));
      if (this.selectedFile.name.endsWith('.zip')) {
        this.fileService.uploadFile(formData).subscribe(
          (result: any) => {
            const tar = result.name;
            // Handle success as needed (Django might redirect or render a template)
            this.statusMessage = 'File uploaded successfully!'; // Assuming success
            this.router.navigate(['/name', result.name], {
              queryParams: {
                tar_file: result.tar_file,
                unzipped: result.unzipped,
                pdb_file: result.pdb_file,
                cif_file: result.cif_file,
              },
            });
          },
          (error) => {
            // Handle error response (Django might return an error page)
            this.statusMessage = 'Error uploading file.';
            console.error(error);
          }
        );
      }
      else {
        this.fileService.uploadFile(formData).subscribe(
          (result: any) => {
            this.router.navigate(['/id', result.task_id])
      });
    };
    
    } else {
      this.statusMessage = 'Please fill in all fields and select a file.';
    }
  }
}
