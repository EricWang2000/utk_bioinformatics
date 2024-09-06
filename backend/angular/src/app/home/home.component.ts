import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) {}
  res : any;
  ngOnInit(): void {
    this.http.get("http://127.0.0.1:8000/").subscribe((result: any) =>{
      this.res = result
      
    });
  }
  go(n:number){
    console.log(this.res[n].name)
    // let obj : this.res[n];
    let obj = this.res[n];
    this.router.navigate(['/name', obj.name], {queryParams: {tar_file:obj.tar_file,
                                                                  pdb_file:obj.pdb_file,
                                                                  cif_file:obj.cif_file}})
  }
}
