
import './index.html';
import './styles.css';
//import 'kendo-ui-core/css/web/kendo.common.css';
//import 'kendo-ui-core/css/web/kendo.default.min.css';



//import * as _ from 'lodash';
import $ from "jquery";
//import 'kendo-ui';

import "@progress/kendo-ui/js/kendo.datepicker";

//import '@progress/kendo-ui';
//import '@progress/kendo-ui/css/common';



//import * as sdf from './detail/detail';

//const df = new sdf.DetailPage();

/*
function component() {
    let element = document.createElement('div');

    // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = _.join(['Hello', 'webpack4 3'], ' ');

    return element;
}

document.body.appendChild(component());
*/

//$(() => {
$('#inDate').kendoDatePicker();
console.log('loaded2');
window.location.href = '/page-dashboard/dashboard.html';
//});
