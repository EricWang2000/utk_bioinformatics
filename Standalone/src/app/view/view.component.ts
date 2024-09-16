import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../file.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {
  name: string = "";
  cif: string;
  pdb: string;
  constructor (private fileservices: FileService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {this.name = params.get('name') || "e";});
    this.check()
  }
  
  check() {
    this.fileservices.viewPage(this.name).subscribe((res: any) =>{
      this.cif = res.cif_file
      this.pdb = res.pdb_file
    });
  }
  goto(file: string) {

    console.log('Navigating to:', `file/${file}`);
    this.router.navigate([
      `/file/${file}`
    ])
  }
}
