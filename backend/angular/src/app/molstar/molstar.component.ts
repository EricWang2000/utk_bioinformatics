import { AfterViewInit, Component } from '@angular/core';
declare var molstar: any;
@Component({
  selector: 'app-molstar',
  templateUrl: './molstar.component.html',
  styleUrls: ['./molstar.component.css']
})


export class MolstarComponent implements AfterViewInit {
  

    ngAfterViewInit(): void {
      if (typeof molstar === 'undefined') {
        console.error('Mol* library is not loaded.');
        return;
      }
      molstar.Viewer.create("app", {
        layoutIsExpanded: false,
        layoutShowControls: false,
        layoutShowRemoteState: false,
        layoutShowSequence: true,
        layoutShowLog: false,
        layoutShowLeftPanel: true,
        viewportShowExpand: true,
        viewportShowSelectionMode: false,
        viewportShowAnimation: false,
        pdbProvider: "rcsb",
        emdbProvider: "rcsb",
      }).then((viewer:any) => {
        const path = `http://localhost:4200/file/CbSAMT_1M6E_def20.pdb`;
        
        viewer.loadStructureFromUrl(path);
      });
    }
}
