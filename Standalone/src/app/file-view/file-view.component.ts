import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../file.service';

@Component({
  selector: 'app-file-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-view.component.html',
  styleUrl: './file-view.component.css',
})
export class FileViewComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private fileService: FileService
  ) {}
  file: string | null = null;
  data: string | null = null;
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.file = params.get('file') || 'e';
    });
    this.view();
  }
  view() {
    this.fileService.viewFile(this.file).subscribe((result: any) => {
      this.data = result.data;
    });
  }
}
