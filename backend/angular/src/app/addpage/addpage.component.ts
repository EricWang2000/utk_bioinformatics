import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-addpage',
  templateUrl: './addpage.component.html',
  styleUrl: './addpage.component.css',
})
export class AddpageComponent {
  constructor(private http: HttpClient, private router: Router) {}

  name: string = '';
  file: File | null = null;
  
  
  pdb_file: string = "";
  cif_file: string = "";
 
  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];  // Get the first file
    } else {
      console.error('No file selected.');
      this.file = null;  // Set file to null if no file is selected
    }
  }
  save(name : string, file : File | null)
  {
    if (!file) {
      console.error("No file selected.");
      return; // Prevent further execution if file is null
    }

    let formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    console.log(name)
    console.log(file)
    
    this.http.post("http://127.0.0.1:8000/add/", formData).subscribe((result: any )=>{

      
      this.router.navigate(['/name', result.name], {queryParams: {tar_file:result.tar_file,
                                                                  pdb_file:result.pdb_file,
                                                                  cif_file:result.cif_file}})
      
    });
  }
}
