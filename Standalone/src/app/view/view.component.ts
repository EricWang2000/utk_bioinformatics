import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../file.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css',
})
export class ViewComponent {
  name: string = '';
  cif: string;
  pdb: string;
  tar: string;
  data: string;
  constructor(
    private fileService: FileService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.name = params.get('name') || 'e';
    });
    this.check();
  }

  check() {
    this.fileService.viewPage(this.name).subscribe((res: any) => {
   
      this.tar = res.tar_file;
      this.cif = res.cif_file;
      this.pdb = res.pdb_file;
    });
  }
  goto(file: string) {
    this.router.navigate([`/file/${file}`]);
  }
  download(filename: string) {
    this.fileService.viewFile(filename).subscribe({
      next: (res: any) => {
        this.data = res.data;
  
        const blob = new Blob([this.data], { type: 'application/octet-stream' }); // Adjust MIME type as needed

        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Create a download link
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; // Set the filename for download
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      
    });
  }
}
