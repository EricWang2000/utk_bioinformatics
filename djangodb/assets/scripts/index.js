// import { Viewer } from "molstar/build/viewer/molstar"

import Alpine from "alpinejs";
import '../styles/molstar.css'

window.htmx = require("htmx.org");

window.Alpine =Alpine

Alpine.start()

molstar.Viewer.create('app', {
    layoutIsExpanded: false,
    layoutShowControls: false,
    layoutShowRemoteState: false,
    layoutShowSequence: true,
    layoutShowLog: false,
    layoutShowLeftPanel: true,

    viewportShowExpand: true,
    viewportShowSelectionMode: false,
    viewportShowAnimation: false,

    pdbProvider: 'rcsb',
    emdbProvider: 'rcsb',
}).then(viewer => {
    viewer.loadPdb('7bv2');
    viewer.loadEmdb('EMD-30210', { detail: 6 });
});