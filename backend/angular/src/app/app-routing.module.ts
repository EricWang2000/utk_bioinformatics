import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewpageComponent } from './viewpage/viewpage.component';
import { AddpageComponent } from './addpage/addpage.component';
import { ViewfileComponent } from './viewfile/viewfile.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  

  // { path: 'name/:name?tar_file=:tar_file&pdb_file=:pdb_file&cif_file=:cif_file', component: ViewpageComponent},
  { path: 'name/:name', component: ViewpageComponent},
  { path: 'add', component: AddpageComponent },
  { path: 'file/:file', component: ViewfileComponent},
  { path: "", component: HomeComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
