/*****************************************************************
 *
 *JS file Name : appfeatures.js
 * Created by : Ravi
 * Created Date: 10 September 2014
 * Last Edited Date: 6th November 2014
 *
 *****************************************************************/
/*-----------------------------------Context Menu for Node--------------------*/
var nodes, lastNodeId, links, lastlinkindex, newnodeids, actualnode = 6, nodex, addfield_count = 0;
// $.get('data.txt',function(data) {
//var newdata = data;
//	var n = newdata;
//  	console.log(n);
//console.log(data.split(':')[1]);
//newnodeids = data.substr(4,1);
//console.log(newnodeids);
// nodex = parseInt( newnodeids);
// console.log(nodex);
// newnodeids = newnodeids.replace(/"/g, '');
var extension = {};
actualnode = 6;
var j = -1;

nodes = [{

	id : 0,
	reflexive : false

}];

for ( i = 1; i < 100; i++) {
	nodes.push({
		"id" : i
	});
}
/**{
 id : 1,
 reflexive : true
 }, {
 id : 2,
 reflexive : false
 },	{
 id : nodex,
 reflexive : false
 },{
 id : actualnode,
 reflexive : false
 }**/

//console.log(nodes[nodex]);
//console.log(nodes[actualnode]);
lastNodeId = i;
links = [{
	source : nodes[0],
	target : nodes[1],
	left : false,
	right : true,
	id : 01,
	//	linkindex :1
}, {
	source : nodes[1],
	target : nodes[2],
	left : false,
	right : true,
	id : 12,
	//linkindex :2
}, {
	source : nodes[3],
	target : nodes[4],
	left : false,
	right : true,
	id : 34,
	//	linkindex :1
}];
for ( j = 3; j < 10; j++) {
	links.push({
		"source" : nodes[j],
		"target" : nodes[j + 2],
		"left" : false,
		"right" : true
	});
	links.push({
		"source" : nodes[j],
		"target" : nodes[j + 2],
		"left" : false,
		"right" : true
	});
}
lastlinkindex = j;

function contextmenuedit() {

	$.contextMenu({
		selector : '#newnodes',
		callback : function(key, options) {
			var m = "clicked: " + key;
			//	window.console && console.log(m) || alert(m);
			if (key == "edit") {
				var newid = lastNodeId + 1;
				// $( "#dialog-form" ).dialog( "option", "title",  'NODE' +"  " + newnodenew.id  );  //title for node dialog
				//		dialog.dialog( "open" );
				$('#dialog-form').attr('class', 'fadeandscale');

				$('.nodeheading').html("&nbsp&nbsp;" + 'NODE' + "   " + newnodenew.id);

				$('#dialog-form').popup({
					//opacity: 0.3,
					transition : 'all 0.3s',
					scrolllock : true,
					blur : false,
					escape : true,
					// background:true,
				});
				$('#dialog-form').popup('show');
				$('#dialog-form').draggable();
			}
			if (key == "update") {
				console.log("updating");
				updatenodedata();
				// to get the update use thatsdata.id and make thatsdata a global variable.
			}
			if (key == "delete") {
				console.log("deleting");
				deletenode();
			}
			if (key == "cut") {
				newcut = 1;
				console.log("cutting");
				updatenodedata();
			}
		},
		items : {
			"edit" : {
				name : "Edit",
				icon : "edit"
			},
			"cut" : {
				name : "Cut",
				icon : "cut"
			},

			"paste" : {
				name : "Paste",
				icon : "paste"
			},
			"delete" : {
				name : "Delete",
				icon : "delete"
			},
			"sep1" : "---------",

		}
	});

};
/*--------------------------------------Creates Node---------------------------------*/
function createnode() {

	dialog.dialog("close");
	termdata = null;
	var point = $("div.dummypanel").position();
	var node = {
		id : ++lastNodeId,
		reflexive : false
	};
	dialognewnodeid = lastNodeId;
	console.log(dialognewnodeid);

	node.x = nodepointx;
	node.y = nodepointy;
	nodes.push(node);

	termdata = $('#termtext').val();

	//$('#newpanel').append('datain');
	restart();

}

/*--------------------------------------------------------------------------*/


/*------------------------------------------------------------------------------*/
$('.addrect').click(function(e) {
	e.preventDefault();
	svg.on('mousedown.zoom', rescale);

});

function gettooltip() {
	/**   $(function() {
	 $( document ).tooltip({
	 option:{
	 content:"abcd",
	 },
	 show: {
	 effect: "slideDown",
	 delay: 250
	 }
	 });
	 });**/
	console.log("abcd");

}

/*------------------------(+)Button functionality in Node dialog-------------------------*/
$(".add-more").click(function(e) {
	e.preventDefault();
	e.stopPropagation();
	//	if (addfield_count == 1){
	//$('#newpopupbox').popup('hide');
	//}
	//   var intId = $("#buildyourform div").length + 1;
	var fieldWrapper = $("<span class=\"fieldwrapper\" id=\"field" + next + "\"/>");
	var fName = $("<input type=\"text\" class=\"parametername  tab2-para\" id = \"parameter" + next + "\" onkeydown=\"myFunction()\" />");
	var fType = $("<input type=\"text\" class=\"fieldname\" id = \"field" + next + "\" onkeydown=\"myFunction()\" />");
	var removeButton = $("<input type=\"button\" class=\"remove-me\" id =\"remove" + next + "\" value=\"-\" /></span><br>");
	$('.newone1').css("margin-left", "2px");
	//$('.newin').css("margin-left","2px");
	//  $('.remove-me').css("margin-left","2px");
	// $('.newright').css("margin-left","px");

	//  $('.add-more').css("margin-left","-2px");

	removeButton.click(function(e) {
		// $(this).parent().remove();
		e.preventDefault();
		e.stopPropagation();

		var fieldNameLength = this.id.length;
		var fieldName = this.id;

		if (fieldNameLength == 7) {
			var fieldNum = this.id.charAt(this.id.length - 1);
		} else {
			var fieldNum = fieldName.slice(fieldNameLength - 2);
			console.log(fieldNum);
		}
		var fieldID = "#field" + fieldNum;
		var parameterID = "#parameter" + fieldNum;
		$(this).remove();
		$(parameterID).remove();
		$(fieldID).remove();

		//  $(this).remove();
	});
	fieldWrapper.append(fName);
	fieldWrapper.append(fType);
	fieldWrapper.append(removeButton);
	next = next + 1;
	$("#field").append(fieldWrapper);
	$('.fieldname').css("margin-left", "19px");
	/**		var addto = "#field" + next;
	 var addRemove = "#field" + (next);

	 var newIn = '<input  id="parameter' + next + '" name ="parameter' + next + '" class="tab2-para" onkeydown="myFunction()"><input  class="input modal-value newone1" id="field' + next + '" name="field' + next + '" type="text"  onkeydown="myFunction()">';
	 var newInput = $(newIn);
	 var removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-danger remove-me newright" >-</button><br></div>';
	 var removeButton = $(removeBtn);

	 $(addto).after(newInput);
	 $(addRemove).after(removeButton);
	 $("#field" + next).attr('data-source', $(addto).attr('data-source'));
	 $("#count").val(next);
	 $('.newone1').css("margin-left","2px");
	 $('.remove-me').css("margin-left","2px");
	 $('.newright').css("margin-left","2px");
	 $('.add-more').css("margin-left","-2px");

	 });
	 $('.remove-me').click(function(e) {
	 //	e.preventDefault();
	 //  e.stopPropagation();
	 var fieldNameLength = this.id.length;
	 var fieldName = this.id;

	 if (fieldNameLength == 7) {
	 var fieldNum = this.id.charAt(this.id.length - 1);
	 } else {
	 var fieldNum = fieldName.slice(fieldNameLength - 2);
	 console.log(fieldNum);
	 }

	 var fieldID = "#field" + fieldNum;
	 var parameterID = "#parameter" + fieldNum;
	 //$(this).find('br').remove();
	 $(this).remove();
	 $(fieldID).remove();
	 $(parameterID).remove();
	 if(fieldNum == 1){
	 $('#field').find('br').first().remove();
	 }
	 else{
	 var newnum = --fieldNum;
	 var newfind = $(' #remove' + newnum).find('br').first();
	 newfind.remove();
	 }**/

});

/*-------------------------------------------------------------------------------------------------------*/
function valuevalidation() {

	var nodetermval = $('#termtext').val();
	if (nodetermval == "") {
		path.style('stroke', 'red');
		//path.attr('class','selected');
	}
}

function appendnewdata() {
	var newtermappend = $('#termtext').val();
}

///autocomplete code for node properties
$(document).on("click", ".tab2-para", function(e) {
	//$(function(){
	e.preventDefault();
	e.stopPropagation();
	var properties = ["Age", "Disease", "Prevelance", "Family History", "Social History", "Race", "Allergies"];
	console.log(this);
	$(this).autocomplete({
		//option : {
		//appendTo:"div#dialog-form",
		//},
		source : properties
	});
	$(".tab2-para").autocomplete({

		appendTo : $("#dialog-form").parent()
	});
	$("span[aria-live='assertive']").hide();
	//newinputs = $('.tab2-para').autocomplete("widget");
	//newinputs.insertAfter($("#dialog-form").parent());
});
///autocomplete code for node properties
$(document).on("click", ".tab2-paranewrel", function(e) {
	//$(function(){
	var properties = ["Age", "Disease", "Prevelance", "Family History", "Social History", "Race", "Allergies"];
	$(this).autocomplete({
		//option : {
		//appendTo:"div#dialog-form",
		//},
		source : properties
	});
	$(".tab2-paranewrel").autocomplete({

		appendTo : $("#pathnewform").parent()
	});
	$("span[aria-live='assertive']").hide();
});

/*-----------------------------------------context menu for edges-----------------------*/
function contextrelmenu() {
	$.contextMenu({
		selector : '.link',
		callback : function(key, options) {
			var m = "clicked: " + key;

			if (key == "edit") {

				//dialognew.dialog( "open" );
				$('#pathnewform').attr('class', 'fadeandscale');
				$('#edgeheading').html("&nbsp&nbsp;" + 'Edge/Relationship');

				$('#pathnewform').popup({
					//opacity: 0.3,
					transition : 'all 0.3s',
					scrolllock : true,
					blur : false,
					escape : true,
				});
				$('#pathnewform').popup('show');
				//$('#pathnewform').draggable();
			}
		},
		items : {
			"edit" : {
				name : "Edit",
				icon : "edit"
			},
			"cut" : {
				name : "Cut",
				icon : "cut"
			},
			"copy" : {
				name : "Copy",
				icon : "copy"
			},
			"paste" : {
				name : "Paste",
				icon : "paste"
			},
			"delete" : {
				name : "Delete",
				icon : "delete"
			},
			"sep1" : "---------",
			"quit" : {
				name : "Quit",
				icon : "quit"
			}
		}
	});

}

/*-----------------------------------------code for add button in edge dialog-------------------------------------------------*/
$("#b2").click(function(e) {
	//  e.preventDefault();
	//	e.stopPropagation();
	e.preventDefault();
	e.stopPropagation();

	//	if (addfield_count == 1){
	//$('#newpopupbox').popup('hide');
	//}
	//   var intId = $("#buildyourform div").length + 1;
	var fieldrelWrapper = $("<span class=\"fieldrelwrapper\" id=\"relfield" + next + "\"/>");
	var frelName = $("<input type=\"text\" class=\"relparametername\" id = \"parameter" + next + "\" onkeydown=\"myFunction()\"/>");
	var frelType = $("<input type=\"text\" class=\"relfieldname\" id = \"relifield" + next + "\" onkeydown=\"myFunction()\"/>");
	var removerelButton = $("<input type=\"button\" class=\"remove-me\" id =\"relremove" + next + "\" value=\"-\" /></span><br>");
	//$('.newone1').css("margin-left","2px");
	//$('.newin').css("margin-left","2px");
	//  $('.remove-me').css("margin-left","2px");
	// $('.newright').css("margin-left","px");

	//  $('.add-more').css("margin-left","-2px");

	removerelButton.click(function(e) {
		// $(this).parent().remove();
		e.preventDefault();
		e.stopPropagation();
		var fieldNameLength = this.id.length;
		var fieldName = this.id;

		if (fieldNameLength == 10) {
			var fieldNum = this.id.charAt(this.id.length - 1);
		} else {
			var fieldNum = fieldName.slice(fieldNameLength - 2);
			console.log(fieldNum);
		}

		var fieldID = "#relfield" + fieldNum;
		var parameterID = "#relparameter" + fieldNum;
		$(this).remove();
		$(fieldID).remove();
		$(parameterID).remove();

		//  $(this).remove();
	});
	fieldrelWrapper.append(frelName);
	fieldrelWrapper.append(frelType);
	fieldrelWrapper.append(removerelButton);
	relnext = relnext + 1;
	$("#fieldnew").append(fieldrelWrapper);
	$('.btnnew').css("margin-left", "30px");

	/**var addto = "#relfield" + relnext;
	 var addRemove = "#relfield" + (relnext);
	 relnext = relnext + 1;
	 var relnewIn = '<input  id="relparameter' + relnext + '" name ="parameter' + relnext + ' class="tab2-paranewrel" onkeydown="myFunction()"><input  class="input modal-value newone" id="relfield' + relnext + '" name="relfield' + relnext + '" type="text" placeholder="Value" onkeydown="myFunction()" >';
	 var newInput = $(relnewIn);
	 var removeBtn = '<button id="relremove' + (relnext - 1) + '" class="btn btn-danger relremove-me newright" >-</button></div><br>';
	 var removeButton = $(removeBtn);

	 $(addto).after(newInput);
	 $(addRemove).after(removeButton);
	 $("#field" + relnext).attr('data-source', $(addto).attr('data-source'));
	 $("#count").val(relnext);

	 $('.relremove-me').click(function(e) {
	 e.preventDefault();
	 e.stopPropagation();
	 var fieldNameLength = this.id.length;
	 var fieldName = this.id;

	 if (fieldNameLength == 10) {
	 var fieldNum = this.id.charAt(this.id.length - 1);
	 } else {
	 var fieldNum = fieldName.slice(fieldNameLength - 2);
	 console.log(fieldNum);
	 }

	 var fieldID = "#relfield" + fieldNum;
	 var parameterID = "#relparameter" + fieldNum;
	 $(this).remove();
	 $(fieldID).remove();
	 $(parameterID).remove();

	 });	**/
});
/*--------------------------------------------------end of code for + button in edge dialog*---------------------------------------*/
function myFunction() {

	$('input').keydown(function(e) {
		e.stopPropagation();
	});

}

function newFunction() {

	$('input').mousedown(function(e) {
		e.stopPropagation();
		$.fn.openMbExtruder();
	});

}

var newcounter = 0;
var verifycounter;
var newdirect;
/*----------------------------code for dialog toggle button----------------------------------------*/
$('#multipledirections').bind("click", function(e) {
	//dialog.dialog("open");

	e.preventDefault();
	newdirect = "left";
	newcounter = newcounter + 1;
	verifycounter = newcounter % 3;
	if (newcounter == 1 || verifycounter == 1) {
		//$('#multipledirections').html('<------------');
		$("#multipledirections").effect("slide", 500);
		$('#multipledirections').html('<span class="glyphicon glyphicon-arrow-left"></span>');
		//drag_line.style('marker','url(#end-arrow)');
		newdirect = "left";
		console.log(newnodelink.id);
		var newlinks = d3.select('#newpaths' + newnodelink.id);
		newlinks.style('marker', 'url(#start-arrow)');
		//startarrow1 = 'url(#end-arrow)';
		var newidarrow1 = newnodelink.id.substring(0, 1);
		var newidarrow2 = newnodelink.id.substring(1, 2);
		/**if (newidarrow1 < //newidarrow2){
		 console.log("right");
		 startarrow1 = 'url(#end-arrow)';
		 startarrow2 = 'url(#start-arrow)';
		 }
		 else{
		 console.log("left");

		 }**/
		//restart();
	}
	if (newcounter == 2 || verifycounter == 2) {
		$("#multipledirections").effect("slide", 500);
		//$('#multipledirections').html('<------------>');
		$('#multipledirections').html('<span class="glyphicon glyphicon-resize-horizontal"></span>');
		newdirect = "both";
		var newlinks = d3.select('#newpaths' + newnodelink.id);
		newlinks.style('marker-end', 'url(#end-arrow)');
		//newlinks.style('marker-end','url(#start-arrow)');
	}
	if (newcounter == 3 || verifycounter == 0) {
		$("#multipledirections").effect("slide", 500);
		//$('#multipledirections').html('------------>');
		$('#multipledirections').html('<span class="glyphicon glyphicon-arrow-right"></span>');
		newdirect = "right";
		var newlinks = d3.select('#newpaths' + newnodelink.id);
		newlinks.style('marker', 'url(#end-arrow)');
	}
});
/*--------------------------------------------------------------------------------------------------------------------*/
function updatenodedata() {
	pasteid = newnodenew.id;
	console.log(newnodenew.id);
	current_node = d3.select(".node" + newnodenew.id);
	var b = d3.transform(d3.select(current_node[0][0].parentNode).attr("transform")).translate;
	$(".node" + newnodenew.id).hide();
	$(".newid" + newnodenew.id).hide();
}

function showingnode() {
	var newpoints = [nodepointx, nodepointy];
	current_node = d3.select(".node" + pasteid);
	//zoom.translate(newpoints);
	/**	var pastenode = {
	 id : pasteid,
	 reflexive : false
	 };
	 pastenode.x = nodepointx;
	 pastenode.y = nodepointy;
	 nodes.push(pastenode);**/
	var x = d3.select(current_node[0][0].parentNode).attr("transform", "translate(" + newpoints + ")");
	//d3.select(".node" + pasteid).attr("transform", "translate("+ newpoints + ")");
	//g.attr("x", nodepointx);
	//g.attr("y", nodepointy);
	$(".node" + pasteid).show();
	$(".newid" + pasteid).show();

}

/*---------------------------------------------------code for edge updates-----------------------------------------*/

var last_rel_title = "";
var last_rel_date;

function createrel() {
	$('span[role="status"]').find("div").hide();
	validrel = $('#rel1').val();
	console.log(newnodelink);
	newpath = d3.select("#newpaths" + newnodelink.id);
	console.log(newpath);
	console.log(newnodelink.id);
	if (validrel != "") {
		var realpath = d3.select(".newpaths" + newnodelink.id);
		newpath.classed('reldatapathnew', true);
		var relclass = d3.selectAll('.reldatapathnew');
		console.log(relclass[0].length);
		var reldata = $("#relforms").serializeArray();
		console.log(reldata);
		var timestamp = $.now();
		dnewdates = new Date(timestamp);
		var newmonth = dnewdates.getMonth() + 1;
		var newyear = dnewdates.getFullYear();
		var newdate = dnewdates.getDate();
		var newhours = dnewdates.getHours();
		var newminutes = dnewdates.getMinutes();
		var newseconds = dnewdates.getSeconds();
		var newformatdate = newmonth + '/' + newdate + '/' + newyear + "   " + newhours + ':' + newminutes + ':' + newseconds;
		console.log(dnewdates.getMonth() + 1);
		//var newrelid = " " + mousedown_node.id + mouseup_node.id;
		var new_panel = $("#newpanel");
		var old_data = new_panel.html();
		var new_update_edge = $("#newpanel .update-rel.blank");

		$("#newpanel .update-rel").each(function() {
			if ($(this).attr("value") == newnodelink.id) {
				new_update_edge = $(this);
				old_data = "";
			}
		});

		new_update_edge.removeClass("blank").removeAttr("hidden");
		var new_update_date = $(".update-rel .newdetailsreltext").first();
		new_update_edge.find("#headupdaterel1").html('<span id = "relhead' + newnodelink.id + '" class = "newrelhead">' + 'Edge' + newnodelink.id + '</span>');
		newonenode = new_update_edge.find("#headupdaterel1").html();
		// new_update_item.find("#datenew").html("&nbsp&nbsp" +'<span class = "oldupdates'+newnodenew.id+'"><text class ="datetext" id = "dateexact'+ newnodenew.id + '">'+ newformatdate +"  "+'</text><br>');
		//  new_update_date.find('#datenew').html("&nbsp&nbsp" +'<span class = "oldupdates'+newnodenew.id+'"><text class ="datetext" id = "dateexact'+ newnodenew.id + '">'+ newformatdate +"  "+'</text><br>');
		newonedate = new_update_edge.find("#datenew").html();
		new_update_edge.find('#newdetailsreltextmodal').html("&nbsp&nbsp" + '<span class = "oldrelupdates' + newnodelink.id + '"><text class ="datetext" id = "dateexact' + newnodelink.id + '">' + newformatdate + "  " + '</text><br><span id="reldetailsspan' + newnodelink.id + '"></span><br><button id = "linkzoom' + newnodelink.id + '" class= "newlinkzoom">Go to link</button>');
		new_update_edge.attr("value", newnodelink.id);
		$('.newlinkzoom').attr("value", newnodelink.id);

		var updating_new_rel = $('#newpanel').find(".update-rel");
		//updating_new_rel.html(new_update_edge);
		//  new_panel.html(new_update_edge);
		if (old_data != "") {
			new_panel.html(old_data).append(new_update_edge);
		}

		//  $('#headupdaterel1').html('<span id = "relhead'+ newnodelink.id +'"><b>' +'Relationship' + " " + newnodelink.id + '<b></span>' );
		newonerel = $('#headupdate1').html();
		// $('#daterelnew').html('<text class ="datetextrel" id = "daterelexact'+ newnodelink.id + '">'+ newformatdate +"  "+'</text><a href = "#" class="detailsreltext'+ newnodelink.id +'"  id= "approxreldetails'+ newnodelink.id +' ">Details</a><br>');
		//$("#newdetails").show();
		//newonereldate = $('#daterelnew').html();//up till changes

		var abcd;
		var count = 0;
		//$('#newreldetailstextmodal').append('<span id="reldetailsspan' + newnodelink.id+ '"></span><br>');
		var newbtnvalue = $(".newtogglebtn").html();
		var newbtnhead = $(".newtogglebtn").val();
		//  next+1  changed it to reldata.length
		for ( i = 0; i <= reldata.length - 1; i++) {
			//$("#newreldetailstextmodal").hide();
			//$("#detailsspan" + newnodenew.id).append("<br>  " + thatsdata[i].name + " :  " + thatsdata[i].value);
			$("#reldetailsspan" + newnodelink.id).append(reldata[i].name + " :  " + reldata[i].value + "<br>");
		}

		$('.newtogglebtn').change(function(e) {
			$("#reldetailsspan" + newnodelink.id).append(newbtnhead + " :  " + newbtnvalue + "<br>");

		});
		/*----------------------------updating toggle button in dialog to html---------------------------------*/
		if (newdirect == "right") {
			var newlinks = d3.select('#newpaths' + newnodelink.id);
			newlinks.style('marker', 'url(#start-arrow)');
		}
		if (newdirect == "left") {
			var newlinks = d3.select('#newpaths' + newnodelink.id);
			newlinks.style('marker', 'url(#end-arrow)');
		}
		if (newdirect == "both") {
			var newlinks = d3.select('#newpaths' + newnodelink.id);
			newlinks.style('marker', 'url(#end-arrow)');
		}
		/*-------------------------Tool-tip for Edge details in updates section -------------------------------------*/
		/** $(function() {

		 $( ".detailsreltext"+ newnodelink.id).tooltip({
		 items: 'a',
		 track: true,
		 content: function(){
		 $("#newreldetailstextmodal").hide();
		 console.log("CHILDREN:");
		 console.log($("#newreldetailstextmodal").children());
		 count = count + 1;
		 efgh = $("#reldetailsspan" + newnodelink.id).html();
		 abcd = $("#newreldetailstextmodal").html() ;
		 //console.log(abcd);
		 //console.log(efgh);
		 return efgh;
		 },

		 show: {
		 effect: "slideDown",
		 delay: 250
		 }

		 });
		 });**/

		/*-----------------------------------------------------------------------------------------------------------*/

		var countrelclass = d3.selectAll('.reldatapathnew');
		console.log(countrelclass);

		// code for update section
		var countrellength = countrelclass[0].length;
		for ( i = 0; i < countrelclass[0].length; i++) {
			//$('headupdateold' ).append()
			$("#headupdaterelold").show('slow');

		}

		if (countrelclass[0].length) {
			if (last_rel_title != "" && (last_rel_title != newonerel) && (last_rel_date != newonereldate )) {
				var reltemp = $("#headupdaterelold").html();

				$("#headupdaterelold").show();
				$("#headupdaterelold").html(last_rel_title);
				$("#headupdaterelold").append(last_rel_date);
				$("#headupdaterelold").append(reltemp);
				//$('<div class = "oldupdates' + newnodenew.id+'">' ).insertBefore(".newnodehead");
				//	$("</div>").insertAfter(".detailstext");
				$("#headupdaterelold").slideDown('veryslow', function() {
					//$(this).css("margin-top","2px" );
				}).delay(150000);
				//$("#headupdateold").hide();
				$("#daterelold").hide();
			}
			last_rel_title = $('#headupdaterel1').html();
			last_rel_date = $('#daterelnew').html();

			$(function() {
				//.find("[class^=detailstext]")
				//$("#dateexact"+ newnodenew.id).tooltip({
				$("#headupdaterelold").find("[class^=detailsreltext]").tooltip({
					events : {
						input : 'mouseover,mouseout'
					},
					items : 'a',
					track : true,
					content : function() {
						$("#newdetailstextmodal").hide();
						console.log("CHILDREN:");
						console.log($("#newdetailstextmodal").children());
						count = count + 1;

						var i = $(this).attr("class").substring(14);
						console.log(i);
						efgh = $("#reldetailsspan" + i).html();
						abcd = $("#newreldetailstextmodal").html();
						//console.log(abcd);
						//console.log(efgh);
						return efgh;
					}
					//  show: {
					//   effect: "slideDown",
					//    delay: 250
					//   }

				});
			});

			newpath.style('stroke', 'black');
		} else {
			newpath.style('stroke', 'red');
		}

		dialognew.dialog("close");
		//updating the form data in the panel
		$('#relforms')[0].reset();
		//e.stopPropagation();
	}
	dialognew.dialog("close");
	$('#pathnewform').popup('hide');
	//updating the form data in the panel
	//accordiondata ();

	//$("#newpanel").accordion("activate", 0);
	$("#newpanel").accordion("refresh");
	$('#frm-data')[0].reset();
	$("#newpanel").accordion("option", "icons", {
		"header" : " ",
		"activeHeader" : " "
	});
	$("#newpanel").accordion("option", "collapsible", true);
	$("#newpanel").accordion("option", "active", false);
}

//to prevent keydown from propagating
$('input').keydown(function(e) {
	e.stopPropagation();
});

/*
* hoverIntent | Copyright 2011 Brian Cherne
* http://cherne.net/brian/resources/jquery.hoverIntent.html
* modified by the jQuery UI team
*/
/** $.event.special.hoverintent = {
 setup: function() {
 $( this ).bind( "mouseover", jQuery.event.special.hoverintent.handler );
 },
 teardown: function() {
 $( this ).unbind( "mouseover", jQuery.event.special.hoverintent.handler );
 },
 handler: function( event ) {
 var currentX, currentY, timeout,
 args = arguments,
 target = $( event.target ),
 previousX = event.pageX,
 previousY = event.pageY;

 function track( event ) {
 currentX = event.pageX;
 currentY = event.pageY;
 };

 function clear() {
 target
 .unbind( "mousemove", track )
 .unbind( "mouseout", clear );
 clearTimeout( timeout );
 }

 function handler() {
 var prop,
 orig = event;

 if ( ( Math.abs( previousX - currentX ) +
 Math.abs( previousY - currentY ) ) < 7 ) {
 clear();

 event = $.Event( "hoverintent" );
 for ( prop in orig ) {
 if ( !( prop in event ) ) {
 event[ prop ] = orig[ prop ];
 }
 }
 // Prevent accessing the original event since the new event
 // is fired asynchronously and the old event is no longer
 // usable (#6028)
 delete event.originalEvent;

 target.trigger( event );
 } else {
 previousX = currentX;
 previousY = currentY;
 timeout = setTimeout( handler, 100 );
 }
 }

 timeout = setTimeout( handler, 100 );
 target.bind({
 mousemove: track,
 mouseout: clear
 });
 }
 };**/
// }
/**function addingfield(){
 addfield_count = 1;
 $('#newpopupbox').popup({
 //opacity: 0.3,
 horizontal:"center",
 vertical:"bottom",
 transition: 'all 0.3s',
 scrolllock:true,
 autozindex:true,
 background:false,
 });
 $('#newpopupbox').removeAttr("hidden");
 $('#newpopupbox').popup('show');

 }**/
$(".btn-close").click(function(e) {
	e.preventDefault();
	e.stopPropagation();
	addfield_count == 0;
	$('#newpopupbox').popup('hide');
});
function totalsubmit() {
	// $(".newsubmitbutton  #newbtn-submit").on('click',function(){
	//var newdata =	('#totaldata').serializeArray();
	//console.log(totaldata);

	// var actualdata = ('#totaldata').submit();
	var totaldat = $("#newpanel").text();
	console.log(totaldat);
	console.log(newdata);
	console.log(totaldata);
}

function callback() {
	setTimeout(function() {
		$("#multipledirections").removeAttr("style").hide().fadeIn();
	}, 1000);
};
var actualcounter = 0, newverifycounter, prevcounter = 0, prevverifycounter;

$(document).on("contextmenu", "#newtermform input ", function(e) {
	$.contextMenu({
		selector : '#newtermform input ',
		callback : function(key, options) {
			var m = "clicked: " + key;

			if (key == "Copy") {

			}
			if (key == "paste") {

				console.log(term_data);
				if (term_data != "" || term_data != undefined || term_data != null) {

					console.log(term_data);
					term_data = null;
				} else {
					console.log(this);
				}
			}
		},
		items : {
			"Copy" : {
				name : "Copy",
				icon : "Copy"
			},
			"CreateNode" : {
				name : "Paste",
				icon : "Paste"
			},
		}
	});

});

/**    $('#newbtn-slidepanel').bind('click',function(){
 actualcounter = actualcounter + 1;
 newverifycounter = actualcounter % 2;
 if(newverifycounter == 0 || actualcounter == 2){
 $('div#leftacrosspanel').animate({top: '500px'}, 'slow');
 // $('#newbtn-slidepanel').toggle(function(event){
 }
 //$('#leftacrosspanel').effect("slide",500);
 //$('div#leftacrosspanel').toggle(function(event){
 //  event.preventDefault();
 if(newverifycounter == 1 || actualcounter == 1) {
 $('div#leftacrosspanel').animate({top: '0px'}, 'slow');
 }
 //  event.preventDefault();
 //  $('div#leftacrosspanel').animate({top: '0px'}, 'slow');
 //});
 });**/
function typeaheadsearchfunction(){
	$('input').keydown(function(e) {
	e.stopPropagation();
});
	//initializeTypeAhead();
}
/*$('#termtypeahead').on('change',function(){
initializeTypeAhead();
});

/** function initializeTypeAhead() {
        
        //var colors = ["red", "blue", "green", "yellow", "brown", "black"];
        //$('#countryfetch').typeahead({source: colors});

        // The JSON returns the following format
        /*
        {"term": "asthma"}, {"term": "cholera"}, {"term": "Typhoid"}, {"term": "Cough"}, {"term": "Wheezing"}, {"term": "coughing"}, {"term": "Wheez"}, {"term": "Test"}, {"term": "test10"}]
        */
  // console.log("it is in typeahead");
     //   var termsData = [];
   
  /**  $('#termtypeahead').typeahead({
          source: termsData,
          updater: function(item) {
            // alert(item);
            //$("#getDataBtn").trigger("click");

            // display the terms and generate the JSON savable term data
            gettermdetails(item);

            return item;

          }
         });**/

     /**  $.getJSON('data/typeahead_term.json', function(terms){
       	console.log(terms);
       	    $("#termtypeahead").typeahead({ source:terms });
});
         // $.each(terms, function(index, values){
            //alert(index);
            //console.log(index);
           // $.each(values, function(k, v){
              //alert(v);
             // console.log(v);
             // termsData.push(v);
            //});
            // alert(values);
            //termsData = String(values).split(",");
            // alert(termsData);
         // });
      //  });

     //   $("#termtypeahead").typeahead("destroy");
     
       
       //  } /* ----- End of initializeTypeAhead ---- */ 
