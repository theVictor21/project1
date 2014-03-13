/*
Copyright 2013 Victor Enriquez.
Distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

ProductionSchedulingAlternatingJobsV4
*/

function heijunka() {

}

heijunka.listAlSchedulelKeys = function (){
	var keys = [];
	for (var key in localStorage){
		var schKeys = key.substr(0,8);
		
		if(schKeys == "Schedule"){
			var orgKey = key.slice(8);
			console.log(orgKey);
			keys.push(orgKey);
		} else{};
   		
	}
	populateScheduleListview(keys);
}

function populateScheduleListview(records){
	var list = "";
	jq("#scheduleListview").empty();
	jq.each(records, function(i, record){
		list += '<li><a href="+#printViewPage">';
    		list += record;
    		list += '</a></li>';
		console.log(list);
	});

	jq("#scheduleListview").append(list);
	jq("#scheduleListview").listview('refresh');
} //end populateScheduleListview


heijunka.saveNewSchedule = function (){
	var workOrder = [];
	var woDetail = [];

	var workCenter = jq('#workCenterInputNew').val();
	var dailyAvailHrs = jq('#dailyAvailHrsInputNew').val();
	var startDate = jq('#startDateInputNew').val();
	var startTime = jq('#startTimeInputNew').val();
	var monDtHrs = jq('#monDtHrsInputNew').val();
	var tueDtHrs = jq('#tueDtHrsInputNew').val();
	var wedDtHrs = jq('#wedDtHrsInputNew').val();
	var thuDtHrs = jq('#thuDtHrsInputNew').val();
	var friDtHrs = jq('#friDtHrsInputNew').val();
	var satDtHrs = jq('#satDtHrsInputNew').val();

	jq('#newScheduleTbl > tbody  > tr').each(function(){
		var priority= jq(this).find('h2').html();
		var material= jq(this).find('textarea').eq(0).val();
		var workOrder= jq(this).find('textarea').eq(1).val();
		var seq= jq(this).find('input').eq(0).val();
		var cube = jq(this).find('select').eq(0).val();
		var numPos= jq(this).find('input').eq(1).val();
		var setup= jq(this).find('input').eq(2).val();
		var runRate = jq(this).find('input').eq(3).val();
		var qty = jq(this).find('input').eq(4).val();

		

		woDetail.push({
			"priority" : priority,
			"workOrder" : workOrder,
			"material" : material,
			"seq" : seq,
			"cube" : cube,
			"numPos" : numPos,
			"setup" : setup,
			"runRate" : runRate,
			"qty" : qty
		});
	});
	
	workOrder.push({
			"workCenter" : workCenter,
			"dailyAvailHrs" : dailyAvailHrs, 
			"startDate" : startDate,
			"startTime" : startTime,
			"monPlnDtHrs" : monDtHrs,
			"tuePlnDtHrs" : tueDtHrs,
			"wedPlnDtHrs" : wedDtHrs,
			"thuPlnDtHrs" : thuDtHrs,
			"friPlnDtHrs" : friDtHrs,
			"satPlnDtHrs" : satDtHrs,
			"woDetail": woDetail
			});
	
	var scheduleName = "Schedule"+jq('#scheduleNameInputNew').val();
	window.localStorage.setItem(scheduleName, JSON.stringify(workOrder));
	console.log("saveNewSchedule "+scheduleName+" "+ JSON.stringify(workOrder));
} //end saveNewSchedule





heijunka.alternatingJobsDailyTarget = function (key){
	jq("#scheduleListTbody").empty();
	jq("#monDiv").empty();
	jq("#tueDiv").empty();
	jq("#wedDiv").empty();
	jq("#thuDiv").empty();
	jq("#friDiv").empty();
	jq("#satDiv").empty();


	jq('#workCenterLbl').text("");
	jq('#dailyAvailHrsLbl').text("");
	jq('#dateLbl').text("");
	jq('#timeLbl').text("");

	var selSchedule ="";
	selSchedule = window.localStorage.getItem("Schedule"+key);
	console.log(selSchedule );
	console.log(key);
	var woArray =[];
	var cube1Array = [];
	var cube2Array = [];
	var dailyAvailHrs=0;

	var json = JSON.parse(selSchedule);
	console.log(json);
	var jsonLength = json.length;
	for (var i=0; i< jsonLength; i++){
		dailyAvailHrs = parseFloat(json[i].dailyAvailHrs);
		var workCenter = json[i].workCenter;
		var startDate = json[i].startDate;
		var startTime = json[i].startTime;
		var monPlnDtHrs = json[i].monPlnDtHrs;
		var tuePlnDtHrs = json[i].tuePlnDtHrs;
		var wedPlnDtHrs = json[i].wedPlnDtHrs;
		var thuPlnDtHrs = json[i].thuPlnDtHrs;
		var friPlnDtHrs = json[i].friPlnDtHrs;
		var satPlnDtHrs = json[i].satPlnDtHrs;
		var sTimeDecimalHr = parseFloat(startTime.substr(0,2)) + (parseFloat(startTime.substr(3,2))/60);
		
		jq("#monDtTb").html(monPlnDtHrs);
		jq("#tueDtTb").html(tuePlnDtHrs);
		jq("#wedDtTb").html(wedPlnDtHrs);
		jq("#thuDtTb").html(thuPlnDtHrs);
		jq("#friDtTb").html(friPlnDtHrs);
		jq("#satDtTb").html(satPlnDtHrs);
		

		jq('#scheduleNameLbl').text(key.slice(8));
		jq('#workCenterLbl').text(workCenter);
		jq('#dailyAvailHrsLbl').text(dailyAvailHrs);
		jq('#dateLbl').text(startDate);
		jq('#timeLbl').text(startTime);

		var woDetail = json[i].woDetail;
		var priority =0;
		for(var j=0; j < woDetail.length; j++){
			var mat = woDetail[j].material;
			var seq = woDetail[j].seq;
			var cube = woDetail[j].cube;
			var numPos = parseFloat(woDetail[j].numPos);
			var setup = parseFloat(woDetail[j].setup);
			var runRate = parseFloat(woDetail[j].runRate);
			var qty = parseFloat(woDetail[j].qty);
			var woNum = woDetail[j].workOrder;


			//POPULATE SCHEDULE LIST
			priority++
			var rowSch = jq('<tr>');
			jq('<td>').html("<h5>"+priority+"</h5>").appendTo(rowSch);
			jq('<td>').html("<h5>"+mat+"</h5>").appendTo(rowSch);
			jq('<td>').html("<h5>"+woNum+"</h5>").appendTo(rowSch);
			jq('<td>').html("<h5>"+seq+"</h5>").appendTo(rowSch);
			jq('<td>').html("<h5>"+cube+"</h5>").appendTo(rowSch);
			jq('<td>').html("<h5>"+numPos+"</h5>").appendTo(rowSch);
			jq('<td>').html("<h5>"+setup+"</h5>").appendTo(rowSch);
			jq('<td>').html("<h5>"+runRate+"</h5>").appendTo(rowSch);
			jq('<td>').html("<h5>"+qty+"</h5>").appendTo(rowSch);
			rowSch.appendTo("#scheduleListTbody");
			
			// Create cube1 and cube2 array
			var posDur = setup/numPos;
			if(cube == "Cube 1"){
				for(var p=0; p<numPos; p++){
					cube1Array.push({
						"woNum" : woNum,
						"pn" : mat,
						"cube" : cube,
						"setup" : setup,
						"posDur" : posDur,
						"seq" : seq,
						"startTime" : 0,
						"run" : 0
					});
				} //end loop

				//Adjustment to count setup piece (qty-1)
				if(setup == 0.1){
					console.log(setup);
					for(var q=0; q < qty; q++){
						var r =parseFloat(runRate);
						cube1Array.push({
							"woNum" : woNum,
							"pn" : mat,
							"cube" :cube,
							"setup" : 0,
							"posDur" : 0,
							"seq" : seq,
							"startTime" : 0,
							"run" : r
						});
					} //end loop
				} else{
					for(var q=0; q < qty-1; q++){
						var r =parseFloat(runRate);
						cube1Array.push({
							"woNum" : woNum,
							"pn" : mat,
							"cube" :cube,
							"setup" : 0,
							"posDur" : 0,
							"seq" : seq,
							"startTime" : 0,
							"run" : r
						});
					} //end loop
				}
	
				

			} else{
				for(var p=0; p<numPos; p++){
					cube2Array.push({
						"woNum" : woNum,
						"pn" : mat,
						"cube" : cube,
						"setup" : setup,
						"posDur" : posDur,
						"seq" : seq,
						"startTime" : 0,
						"run" : 0
					});
				}

				//Adjustment to count setup piece (qty-1)
				for(var q=0; q < qty-1; q++){
					var r =parseFloat(runRate);
					cube2Array.push({
						"woNum" : woNum,
						"pn" : mat,
						"cube" :cube,
						"setup" : 0,
						"posDur" : 0,
						"seq" : seq,
						"startTime" : 0,
						"run" : r
					});
				} //end loop
			}
		} //end 2nd loop
		
	} //end 1st loop

	console.log(cube1Array);
	console.log(cube2Array);

	var c1 = cube1Array.length;
	var c2 = cube2Array.length;
	console.log(c1+" "+c2);

	//var woArray = $.map(cube1Array, function(v, i) { return [v, cube2Array[i]]; });
	var i=0;
	if(c1>=c2){
		woArray = jq.map(cube1Array, function(v, i) {
			console.log(i);
			if(i<c2){
				 //console.log( [v, cube2Array[i]]);
				 return [v, cube2Array[i]];
			} else{
				//console.log( [cube1Array[i]]);
				return [cube1Array[i]];
			}
		});
	} else{
		woArray = jq.map(cube2Array, function(v, i) {
			console.log(i);
			if(i<c1){
				 //console.log( [v, cube1Array[i]]);
				 return [v, cube1Array[i]];
			} else{
				//console.log( [cube2Array[i]]);
				return [cube2Array[i]];
			}
		});	
	}

	//Add start time to the beginning of an array
	woArray.unshift({
		"woNum" : 0,
		"cube" : 0,
		"setup" : 0,
		"posDur" : 0,
		"seq" : seq,
		"startTime" : sTimeDecimalHr,
		"run" : 0
	});

	console.log(woArray);


	//console.log(woArray);
	var rowM= jq("<tr>");
	var rowT= jq("<tr>");
	var rowW= jq("<tr>");
	var rowR= jq("<tr>");
	var rowF= jq("<tr>");
	var rowS= jq("<tr>");
	var cumHours=0;
	var cumRun=0;

	var Mcount=0;
	var Tcount=0;
	var Wcount=0;
	var Rcount=0;
	var Fcount=0;
	var Scount=0;

	var McountSu=0;
	var TcountSu=0;
	var WcountSu=0;
	var RcountSu=0;
	var FcountSu=0;
	var ScountSu=0;

	for (var i=0; i< woArray.length; i++){
		var su = parseFloat(woArray[i].setup);
		var posDur = parseFloat(woArray[i].posDur);
		var cube = woArray[i].cube;
		var run = parseFloat(woArray[i].run);
		var se = woArray[i].seq;
		var wo = woArray[i].woNum;
		var pn = woArray[i].pn;
		var st = woArray[i].startTime;
		//console.log(woArray);
		//console.log(wo+" "+su+" "+run);

		cumHours += posDur + run + st;
		//cumRun = cumRun + run;
		console.log("cumHours "+cumHours);

		var monHrs = parseFloat(cumHours);
		var tueHrs = parseFloat(cumHours)+parseFloat(monPlnDtHrs)-parseFloat(dailyAvailHrs*1);
		var wedHrs = parseFloat(cumHours)+parseFloat(monPlnDtHrs)+parseFloat(tuePlnDtHrs)-parseFloat(dailyAvailHrs*2);
		var thuHrs = parseFloat(cumHours)+parseFloat(monPlnDtHrs)+parseFloat(tuePlnDtHrs)+parseFloat(wedPlnDtHrs)-parseFloat(dailyAvailHrs*3);
		var friHrs = parseFloat(cumHours)+parseFloat(monPlnDtHrs)+parseFloat(tuePlnDtHrs)+parseFloat(wedPlnDtHrs)+parseFloat(thuPlnDtHrs)-parseFloat(dailyAvailHrs*4);
		var satHrs = parseFloat(cumHours)+parseFloat(monPlnDtHrs)+parseFloat(tuePlnDtHrs)+parseFloat(wedPlnDtHrs)+parseFloat(thuPlnDtHrs)+parseFloat(friPlnDtHrs)-parseFloat(dailyAvailHrs*5);
		//console.log("tuesHrs "+tueHrs);

		
		if(cumHours<=(dailyAvailHrs-monPlnDtHrs)){
			Mcount++
			if(posDur == 0.1){McountSu++}
			if(run>0){
				
				jq("<div class='dataBox'>").html("<h5>PN#: "+pn+"</h5>"+"<h5>"+"Std ("+run.toFixed(1)+")"+"</h5>"+"<h5>"+"Cum Hrs "+"("+monHrs.toFixed(1)+")"+"</h5>").appendTo("#monDiv");
			} else{
				if(run==0 && wo==0){
					jq("<div class='dataBox'>").html("<h5>"+"Start Time "+"("+st+")"+"</h5>").appendTo("#monDiv");
				} else{
					jq("<div class='dataBoxSu'>").html("<h5>PN#: "+pn+"</h5>"+"<h5>"+cube+" "+"SU "+"("+posDur.toFixed(1)+") "+" Seq "+"("+se+")"+"</h5>"+"<h5>"+"Cum Hrs "+"("+monHrs.toFixed(1)+")"+"</h5>").appendTo("#monDiv");
				}
			}
		}
		
		else if(cumHours>((dailyAvailHrs)-monPlnDtHrs-tuePlnDtHrs) && cumHours<=((dailyAvailHrs*2)-monPlnDtHrs-tuePlnDtHrs)){
			Tcount++
			if(posDur == 0.1){TcountSu++}
			if(run>0){
				jq("<div class='dataBox'>").html("<h5>PN#: "+pn+"</h5>"+"<h5>"+"Std ("+run.toFixed(1)+")"+"</h5>"+"<h5>"+"Cum Hrs "+"("+tueHrs.toFixed(1)+")"+"</h5>").appendTo("#tueDiv");
			} else{
				jq("<div class='dataBoxSu'>").html("<h5>PN#: "+pn+"</h5>"+"<h5>"+cube+" "+"SU "+"("+posDur.toFixed(1)+")"+" Seq "+"("+se+")"+"</h5>"+"<h5>"+"Cum Hrs "+"("+tueHrs.toFixed(1)+")"+"</h5>").appendTo("#tueDiv");
			}		
		}
		else if(cumHours>((dailyAvailHrs*2)-monPlnDtHrs-tuePlnDtHrs) && cumHours<=((dailyAvailHrs*3)-monPlnDtHrs-tuePlnDtHrs-wedPlnDtHrs)){	
			Wcount++
			if(posDur == 0.1){WcountSu++}

			if(run>0){
				jq("<div class='dataBox'>").html("<h5>PN#: "+pn+"</h5>"+"<h5>"+"Std ("+run.toFixed(1)+")"+"</h5>"+"<h5>"+"Cum Hrs "+"("+wedHrs.toFixed(1)+")"+"</h5>").appendTo("#wedDiv");
			} else{
				jq("<div class='dataBoxSu'>").html("<h5>PN#: "+pn+"</h5>"+"<h5>"+cube+" "+"SU "+"("+posDur.toFixed(1)+")"+" Seq "+"("+se+")"+"</h5>"+"<h5>"+"Cum Hrs "+"("+wedHrs.toFixed(1)+")"+"</h5>").appendTo("#wedDiv");
			}
					
		}
		else if(cumHours>((dailyAvailHrs*3)-monPlnDtHrs-tuePlnDtHrs-wedPlnDtHrs-thuPlnDtHrs) && cumHours<=((dailyAvailHrs*4)-monPlnDtHrs-tuePlnDtHrs-wedPlnDtHrs-thuPlnDtHrs)){
			Rcount++
			if(posDur == 0.1){RcountSu++}
			if(run>0){
				
				jq("<div class='dataBox'>").html("<h5>PN#: "+pn+"</h5>"+"<h5>"+"Std ("+run.toFixed(1)+")"+"</h5>"+"<h5>"+"Cum Hrs "+"("+thuHrs.toFixed(1)+")"+"</h5>").appendTo("#thuDiv");
			} else{
				jq("<div class='dataBoxSu'>").html("<h5>PN#: "+pn+"</h5>"+"<h5>"+cube+" "+"SU "+"("+posDur.toFixed(1)+")"+" Seq "+"("+se+")"+"</h5>"+"<h5>"+"Cum Hrs "+"("+thuHrs.toFixed(1)+")"+"</h5>").appendTo("#thuDiv");
			}
					
		}
		else if(cumHours>((dailyAvailHrs*4)-monPlnDtHrs-tuePlnDtHrs-wedPlnDtHrs-thuPlnDtHrs-friPlnDtHrs) && cumHours<=((dailyAvailHrs*5)-monPlnDtHrs-tuePlnDtHrs-wedPlnDtHrs-thuPlnDtHrs-friPlnDtHrs)){
			Fcount++
			if(posDur == 0.1){FcountSu++}
			if(run>0){
				
				jq("<div class='dataBox'>").html("<h5>PN#: "+pn+"</h5>"+"<h5>"+"Std ("+run.toFixed(1)+")"+"</h5>"+"<h5>"+"Cum Hrs "+"("+friHrs.toFixed(1)+")"+"</h5>").appendTo("#friDiv");
			} else{
				jq("<div class='dataBoxSu'>").html("<h5>PN#: "+pn+"</h5>"+"<h5>"+cube+" "+"SU "+"("+posDur.toFixed(1)+")"+" Seq "+"("+se+")"+"</h5>"+"<h5>"+"Cum Hrs "+"("+friHrs.toFixed(1)+")"+"</h5>").appendTo("#friDiv");
			}
					
		}
		else if(cumHours>((dailyAvailHrs*5)-monPlnDtHrs-tuePlnDtHrs-wedPlnDtHrs-thuPlnDtHrs-friPlnDtHrs-satPlnDtHrs) && cumHours<=((dailyAvailHrs*6)-monPlnDtHrs-tuePlnDtHrs-wedPlnDtHrs-thuPlnDtHrs-friPlnDtHrs-satPlnDtHrs)){
			Scount++
			if(run>0){
				jq("<div class='dataBoxRed'>").html("<h5>PN#: "+pn+"</h5>"+"<h5>"+"Std ("+run.toFixed(1)+")"+"</h5>"+"<h5>"+"Cum Hrs "+"("+satHrs.toFixed(1)+")"+"</h5>").appendTo("#satDiv");
			} else{
				jq("<div class='dataBoxRed'>").html("<h5>PN#: "+pn+"</h5>"+"<h5>"+cube+" "+"SU "+"("+posDur.toFixed(1)+")"+" Seq "+"("+se+")"+"</h5>"+"<h5>"+"Cum Hrs "+"("+satHrs.toFixed(1)+")"+"</h5>").appendTo("#satDiv");
			}		
		}
	} // end for

	var dailyTotalPcsMon = parseInt(Mcount-McountSu-1);
	var dailyTotalPcsTue = parseInt(Tcount-TcountSu);
	var dailyTotalPcsWed = parseInt(Wcount-WcountSu);
	var dailyTotalPcsThu = parseInt(Rcount-RcountSu);
	var dailyTotalPcsFri = parseInt(Fcount-FcountSu);

	jq("<div class='totalBox'>").html("<h5>"+dailyTotalPcsMon+"</h5>").appendTo("#monDiv");
	jq("<div class='totalBox'>").html("<h5>"+dailyTotalPcsTue+"</h5>").appendTo("#tueDiv");
	jq("<div class='totalBox'>").html("<h5>"+dailyTotalPcsWed+"</h5>").appendTo("#wedDiv");
	jq("<div class='totalBox'>").html("<h5>"+dailyTotalPcsThu+"</h5>").appendTo("#thuDiv");
	jq("<div class='totalBox'>").html("<h5>"+dailyTotalPcsFri+"</h5>").appendTo("#friDiv");


	console.log(Mcount+" "+McountSu);	
	console.log(dailyTotalPcsMon);

} //end alternatingJobs


heijunka.poppulateEditSchedule = function (key){
	//alert(key);
	var currentData = "";
	currentData = window.localStorage.getItem("Schedule"+key);
	console.log(currentData);
	jq('#scheduleNameInputNew').val(key);

	jq("tr.dynRow").remove();

	console.log(currentData);
	var json = JSON.parse(currentData);
	console.log(json);
	var jsonLength = json.length;
	for (var i=0; i< jsonLength; i++){
		var dhrs = parseFloat(json[i].dailyAvailHrs);
		var wc = json[i].workCenter;
		var sd = json[i].startDate;
		var st = json[i].startTime;
		var monPlnDtHrs = json[i].monPlnDtHrs;
		var tuePlnDtHrs = json[i].tuePlnDtHrs;
		var wedPlnDtHrs = json[i].wedPlnDtHrs;
		var thuPlnDtHrs = json[i].thuPlnDtHrs;
		var friPlnDtHrs = json[i].friPlnDtHrs;
		var satPlnDtHrs = json[i].satPlnDtHrs;


		jq('#workCenterInputNew').val(wc);
		jq('#dailyAvailHrsInputNew').val(dhrs);
		jq('#startDateInputNew').val(sd);
		jq('#startTimeInputNew').val(st);

		jq('#monDtHrsInputNew').val(monPlnDtHrs);
		jq('#tueDtHrsInputNew').val(tuePlnDtHrs);
		jq('#wedDtHrsInputNew').val(wedPlnDtHrs);
		jq('#thuDtHrsInputNew').val(thuPlnDtHrs);
		jq('#friDtHrsInputNew').val(friPlnDtHrs);
		jq('#satDtHrsInputNew').val(satPlnDtHrs);
		
		var woDetail = json[i].woDetail;
		for(var j=0; j < woDetail.length; j++){
			var priority = woDetail[j].priority;
			var mat = woDetail[j].material;
			var seq = woDetail[j].seq;

			var cube = woDetail[j].cube;
			var numPos = woDetail[j].numPos;

			var setup = parseFloat(woDetail[j].setup);
			var runRate = parseFloat(woDetail[j].runRate);
			var qty = parseFloat(woDetail[j].qty);
			var woNum = woDetail[j].workOrder;

			var row= jq("<tr class='dynRow'>");
			jq("<td>").html("<h2 class='stpNum'>"+priority+"</h2>").appendTo(row);
			jq("<td>").html("<textarea class='materialTextarea' maxlength='255'>"+mat+"</textarea>").appendTo(row);
			jq("<td>").html("<textarea class='workOrderTextarea' maxlength='255'>"+woNum+"</textarea>").appendTo(row);
			jq("<td>").html("<input class='seqInput' type='text' value="+seq+"></input>").appendTo(row);

			//ADD SELECT AND POPULATE VALUE
			jq("<td>").html("<select id="+"cubeSelect"+j+ " class='typeSelect'><option value='Cube 1'>Cube 1</option><option value='Cube 2'>Cube 2</option></select>").appendTo(row);
			jq("<td>").html("<input class='numPosInput' type='number' value="+numPos+"></input>").appendTo(row);

			jq("<td>").html("<input class='setupInput' type='number' value="+setup+"></input>").appendTo(row);
			jq("<td>").html("<input class='runrateInput' type='number' value="+runRate+"></input>").appendTo(row);
			jq("<td>").html("<input class='qtyInput' type='number' value="+qty+"></input>").appendTo(row);

			row.appendTo("#newScheduleTblTbody");
			
			jq('select').selectmenu({ theme: "c" });
			jq("#cubeSelect"+j).val(cube);
			jq("#cubeSelect"+j).selectmenu();
			jq("#cubeSelect"+j).selectmenu('refresh');
		}
	}
} //end poppulateEditSchedule




