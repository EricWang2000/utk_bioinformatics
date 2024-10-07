import { Component, OnInit } from '@angular/core';
import { FileService } from './../file.service';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'file-upload',
  standalone: true,
  templateUrl: './fasta.component.html', // Reference to the HTML file
  styleUrls: ['./fasta.component.css'], // Reference to the CSS file
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule], // Import CommonModule and HttpClientModule
})
export class FastaComponent implements OnInit {
  selectedFile: File | null = null; // The file to be uploaded
  name: string = ''; // Name field from the form
  pattern: string = ''; // Pattern field from the form
  statusMessage: string = ''; // Status message (success or error)

  constructor(
    private fileService: FileService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // Handle file selection
  startTime: number;
  hour: number;
  minute: number;
  percent: number | null = null;
  output : string | null=null;
  finished : boolean = false;
  status : string | null=null;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.name = params.get('id') || 'e';
    });
    this.startTime = Date.now();
    console.log(this.name);
  }
  stuff() {
    this.fileService.progress(this.name).subscribe((res: any) => {
      // console.log(res);

      this.status = res["state"]
      if (this.status == "PENDING"){
        this.status = "IN PROGRESS"
      }
     
      if (res["state"] == 'SUCCESS'){
        this.finished = true;
   
        this.output = res['progress']['result'];
      
      } 

    
    });
    
  }
}
