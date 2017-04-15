// Developed by hellomaccs
// 20161120
// Version 1.2

$(document).ready(function() {

	$('#mGrid').css('height', $('#content_main').height() + 'px');

	var myHeader = 'List of Codes';
	var gridHeader = [];
	var gridSearch = [];
	var gridData = [];
	var copyText = '';

	function csvToJSONHeader(csv) {
		i = csv.indexOf("\r\n");
		lines=csv.substring(0, i);
		result = [];
		headers=lines.split(",");

		for(j=1;j<headers.length;j++){
			obj = {};
			obj['field'] = headers[j];
			obj['caption'] = headers[j];
			if(j != headers.length-1) {
				obj['size'] = '100px';//(100/(headers.length-1))
			} else {
				obj['size'] = '100%';
			}
			obj['sortable'] = true;
			obj['resizable'] = true;
			result.push(obj);
		}

	  return jQuery.parseJSON(JSON.stringify(result));
	}

	function csvToJSONData(csv) {
		var result = Papa.parse(csv.trim(), { header: true });
		console.log(Object.keys(result).length);
		return result.data;
	}

	// call w2ui grid
	function createGrid() {
		$('#mGrid').w2grid({
	    name: 'mGrid',
	    header: myHeader,
	    selectType: 'cell',
	    menu: [
        { id: 1, text: 'Copy Text' }
			],
	    show: {
	      header : true,
	      toolbar: true,
	      footer: true,
	      lineNumbers: true
	  	},
	    columns: gridHeader,
	    searches: gridSearch,
	  	sortData: [{ field: 'recid', direction: 'ASC' }],
	    records: gridData,
	    onMenuClick: function(event) {
				// Copy to clipboard
				var clipboard = new Clipboard('#myCopy', {
			    text: function() {
			    	gmessage = w2ui['mGrid'].copy();
			    	if(gmessage.length > 20) {
			    		w2ui['mGrid'].status('Copied "' + gmessage.substring(0,20) + '..."');
			    	} else {
							w2ui['mGrid'].status('Copied "' + gmessage + '"');
			    	}
			      return gmessage;
			    }
				});
				$("#myCopy").click();
   	  }
		});
	}

	//input csv file location
	function updateGrid(file) {
		w2popup.open({
			body: '<div class="w2ui-centered w2ui-alert-msg" style="font-size: 13px;">Loading...</div>',
			width: 150,
			height: 70,
			modal: true
		});
		w2ui['mGrid'].status('Loading...');
		$.ajax({
			type: "GET",
			url: "assets/" + file + ".csv",
			dataType: "text",
			success: function(csvOutput) 
			{
				myHeader = file;
				gridHeader = csvToJSONHeader(csvOutput);
				gridSearch = jQuery.parseJSON(JSON.stringify(gridHeader).replace(/"size":"100%","sortable":true,"resizable":true/g, '"type": "text"').replace(/"size":"100px","sortable":true,"resizable":true/g, '"type": "text"'));
				gridData = csvToJSONData(csvOutput);
				w2ui['mGrid'].destroy();
				createGrid();
				w2ui['mGrid'].status('Completed');
				w2popup.close();
				$('#grid_mGrid_search_all').focus();
			}
		});
	}

	createGrid();

	// Drop-down List Function
	$(function () {
    $('#mBusiness').w2field('list', { items: mbusiness });
    $('#mService').w2field('list', { items: mService });
    $('#mCode').w2field('list', { items: mCode, match: 'contains' });
	});

	// mCode change event listener
	$('#mCode').on('change', function() {
		updateGrid(this.value);
	});

});