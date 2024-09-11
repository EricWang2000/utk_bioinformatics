import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-viewfile',
  templateUrl: './viewfile.component.html',
  styleUrl: './viewfile.component.css'
})
export class ViewfileComponent implements OnInit {

  file : string = "";
  data : string = "";
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.file = params.get('file') || "e";
  });
  this.view()
}
  view() {
    this.http.get(`http://127.0.0.1:8000/${this.file}`).subscribe((result:any) =>{
      this.data = result.data

    
    });

  }

  downloadFile(): void {
    this.http.get(`http://127.0.0.1:8000/${this.file}`, { responseType: 'blob' }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.file}`;  // Use the file name from the route parameter
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }
}
