import {Component, OnInit} from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-viewpage',
  templateUrl: './viewpage.component.html',
  styleUrl: './viewpage.component.css'
})
export class ViewpageComponent implements OnInit{
  
  
  constructor(private http: HttpClient, private route: ActivatedRoute) { }
  name : string = "";
  tar_file : string = "";
  pdb_file : string = "";
  cif_file : string = "";

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.name = params.get('name') || "?";
    });
    
    
    this.route.queryParams.subscribe(params => {
     
      this.tar_file = params['tar_file'] || "?";
      this.pdb_file = params['pdb_file'] || "?";
      this.cif_file = params['cif_file'] || "?";
      
    });
    
  }
  
}

