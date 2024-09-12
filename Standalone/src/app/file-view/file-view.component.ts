import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../file.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-file-view',
  standalone: true,
  templateUrl: './file-view.component.html',
  styleUrl: './file-view.component.css',
  imports: [CommonModule],
})
export class FileViewComponent implements OnInit{
  filename: string = '';
  data: string = '';
  statusMessage: string = ''; 
  constructor (private fileservices: FileService, private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {this.filename = params.get('file') || "e";});
    this.check()
  }
  
  check() {
    this.fileservices.viewFile(this.filename).subscribe((res: any) =>{
      this.data = res.data
     
    if (this.data == "M" ) {
      this.statusMessage = 'File Missing.';
    } else if (this.data == "Z") {
      this.statusMessage = 'Can not view zip file.';
    }
  })
}

    
  

  
  
}
