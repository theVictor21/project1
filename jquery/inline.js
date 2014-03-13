var jq=jQuery.noConflict();
var selKey="";

function init(){
	alert("init");
	heijunka.listAlSchedulelKeys();
	
} //end init


jq('#scheduleEntryPage').on('pagebeforeshow', function(){
	jq('textarea').textinput({ theme: "c" });
	jq('select').selectmenu({ theme: "c" });
	jq('input').textinput({ theme: "c" });
	jq('button').button({ theme: "b" });
});

jq('#navTOScheduleEntryPageBtn').on('click', function(){
	//alert("btn click");
	jq.mobile.changePage( "#scheduleEntryPage", { transition: "slide"} );
	
	jq('#scheduleNameInputNew').val("");
	jq('#workCenterInputNew').val("");
	jq('#dailyAvailHrsInputNew').val("");
	jq('#startDateInputNew').val("");
	jq('#startTimeInputNew').val("");
	jq('.workOrderTextarea').val("");
	jq('.materialTextarea').val("");
	jq('.seqInput').val("");
	jq('.setupInput').val("");
	jq('.runrateInput').val("");
	jq('.qtyInput').val("");		
});


jq('#newScheduleSaveBtn').click(function(){
	//alert("newScheduleSaveBtn btn click");
	heijunka.saveNewSchedule();
	jq.mobile.changePage( "#mainPage", { transition: "slide"} );
	heijunka.listAlSchedulelKeys();
});

/*jq('#printViewBtn').click(function(){
	jq.mobile.changePage( "#printViewPage", { transition: "slide"} );
});*/



jq('#scheduleListview').on('click', 'li', function(){
	selKey = jq(this).text();
	console.log(selKey);
	//var strLength = jq(this).text().length-1;
	//selectedKey = "Schedule"+jq(this).text().slice(0,strLength);
	//console.log(selectedKey+""+strLength);
	//heijunka.calculateDailyTarget(selectedKey);
	heijunka.alternatingJobsDailyTarget(selKey.trim());
	
});



jq("#newScheduleAddARowBtn").click(function(){
	var newStep;
	jq("#newScheduleTbl > tbody > tr").each(function(index) {
		//alert(index + ': ' + jq(this).text());
		newStep = index + 2;
	});

	var row= jq("<tr class='dynRow'>");
	jq("<td>").html("<h2>"+newStep+"</h2>").appendTo(row);
	jq("<td>").html("<textarea class='materialTextarea' maxlength='255'></textarea>").appendTo(row);
	jq("<td>").html("<textarea class='workOrderTextarea' maxlength='255'></textarea>").appendTo(row);
	jq("<td>").html("<input class='seqInput' type='text'></input>").appendTo(row);
	jq("<td>").html("<select class='cubeSelect' name='select-choice-1' id='select-choice-1'><option value='Cube 1'>Cube 1</option><option value='Cube 2'>Cube 2</option></select>").appendTo(row);
	jq("<td>").html("<input class='numPosInput' type='number'></input>").appendTo(row);
	jq("<td>").html("<input class='setupInput' type='number'></input>").appendTo(row);
	jq("<td>").html("<input class='runrateInput' type='number'></input>").appendTo(row);
	jq("<td>").html("<input class='qtyInput' type='number'></input>").appendTo(row);

	
	row.appendTo("#newScheduleTblTbody");

	jq('textarea').textinput({ theme: "c" });
	jq('select').selectmenu({ theme: "c" });
	jq('input').textinput({ theme: "c" });
	jq('button').button({ theme: "b" });
});  //end newScheduleAddARowBtn


jq("#newScheduleDeleteARowBtn").click(function(){
	var lastRow=0;
	jq("#newScheduleTbl > tbody > tr").each(function(index) {
		lastRow++;
	});
	console.log(lastRow);
	jq("#newScheduleTbl > tbody").find("tr").eq(lastRow-1).remove();
	//jq("#newScheduleTbl > tbody").find("tr").eq(0).remove();
});  //end newScheduleDeleteARowBtn

jq("#editScheduleBtn").click(function(){
	console.log(selKey);
	heijunka.poppulateEditSchedule(selKey);
	jq.mobile.changePage( "#scheduleEntryPage", { transition: "slide"} );
});  //end editScheduleBtn




















jq('#newCombiBtn').on('click', function(){
	jq.mobile.changePage( "#newCombiFormPage", { transition: "slide"} );
});







jq('#combiListview').on('click', 'li', function(){
	var strLength = jq(this).text().length-1;
	selectedCombiObj = jq(this).text().slice(0,strLength);
	jq('#stdWorkNameLbl').text(selectedCombiObj);
	combinationSheet.getSelectedCombi(selectedCombiObj);
});

jq('#backtocombinationSheetPageBtn').on('click', function(){
	combinationSheet.clearLayout(function(){
		jq.mobile.changePage( "#combinationSheetPage", { transition: "slide"} );	
	});
	
});





jq('#navUpdateCombiSheetBtn').click(function(){
	//alert("selectedCombiObj");
	jq.mobile.changePage( "#updateCombiSheetPage", { transition: "slide"} );
	combinationSheet.populateUpdateCombiSheet(selectedCombiObj);
	
});

jq('#saveUpdateCombiSheetBtn').click(function(){
	combinationSheet.clearLayout(function(){
		jq.mobile.changePage( "#mainPage", { transition: "slide"} );	
	});
	combinationSheet.UpdateCombiSheet(selectedCombiObj);
	
});

