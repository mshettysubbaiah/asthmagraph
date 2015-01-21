/*****************************************************************
 *
 *JS file Name : modaljquery.js
 * Created by : Ravi
 * Created Date: 10 September 2014
 * Last Edited Date: 6th November 2014
 *
 *****************************************************************/
//functionality starts
// Added [11/16/14]

$(document).ready(function() {
	var newtitle;
	var newcounter = 0;
	var newcounters;
	var startarrow = ' ', endarrow = ' ';
	var newnodeids;
    $('.flap').css('background','url(../images/leftarrowimages.jpg)!important')
	$("span[aria-live='assertive']").hide();
	// hide the sliding panel
	$("#slider").hide();
	$("#slider").slideReveal("hide");
	var width = $(window).width(), height = $(window).height();
	var p0 = [width / 2, height / 2, height];
	var center_point = [width / 2, height / 2, height];
    

	//console.log(zoom.scale());
	//$('.newsubmitbutton').show
	$("#adding-more").hide();
	$("body").css("overflow", "hidden");
	///////////////////////////////////////Button data for Edge dialog having source & destination Node////////////////////////////////
	//$('#multipledirections').html('--------->');
	$('#multipledirections').html('<span class="glyphicon glyphicon-arrow-right"></span>');
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	$("#newdetails").hide();
	console.log($(document).innerHeight());
 $(function () {
$('#termnewedit  a').tab('show');//click(function (e) {
 // e.preventDefault()
//  $(this).tab('show')
//})
});
	/**************************   sliding panel for updates   ***************/

  /**$('#newiddiv').slidePanel({
        triggerName: '#trigger2',
        position: 'fixed',
        triggerTopPos: '20px',
        panelTopPos: '10px'
      //  ajax: true,
    //    ajaxSource: 'ajax.html'
    });**/
	/**$('#newiddiv').slidePanel({
		triggerName : '#trigger2',
		position : 'absolute',
		triggerTopPos : '20px',
		panelTopPos : '10px',
		panelOpacity : 1.0,
		speed : 'fast',
		clickOutsideToClose : false
	});**/

	$(function() {

		if (self.location.href == top.location.href) {
			
		}
		$("#extruderRight").buildMbExtruder({
			position : "right",
			width : 300,
			extruderOpacity : .8,
			textOrientation : "tb",
			onExtOpen : function() {
			},
			onExtContentLoad : function() {
			},
			onExtClose : function() {
			}
		});
	});

	$("#extruderLeft").buildMbExtruder({
		position : "left",
		width : 800,
		extruderOpacity : .8,
		textOrientation : "tb",
		onExtOpen : function() {
		},
		onExtContentLoad : function() {
		},
		onExtClose : function() {
			$("#slider").slideReveal("hide");
		},
		closeOnExternalClick : false
	});

	$('#slider').slideReveal({
		trigger : $("#newbtn-slidepanel"),
		push : false,
		width : 500,
	});

	// run the currently selected effect
	function runEffect() {
		// get effect type from
		var selectedEffect = $("#panel");

		// most effect types need no options passed by default

		// run the effect
		//  $( "#trigger2" ).effect( selectedEffect, options, 500, callback );
	};



	//////////////////////////////////////////////////////Dialog for  Node data///////////////////////////////////////
	dialog = $("#dialog-form").dialog({
		autoOpen : false,
		hide : {
			effect : "drop",
			direction : "right",
			duration : 500
		},
		resizable : false,
		//   show: {effect: "transfer",to:"circle" , duration: 5000},
		height : 260,
		width : 350,
		modal : true,
		position : {
			my : nodepointx,
			at : nodepointy,
			of : $('#dummypanel')
		},
		buttons : {
			"Save" : {
				class : 'Savebtns',
				text : "Save",
				click : changenode,
			},
			Reset : function() {
				form[0].reset();
				// this.form.reset();
			}
		},
		close : function() {
			dialog.dialog("close");
			//  allFields.removeClass( "ui-state-error" );
		}
	});
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//   console.log(newnodenew.id);

	$("#dialog-form").dialog("option", "closeOnEscape", true);
	//functionality of esc button close

	form = dialog.find("form").on("submit", function(event) {
		event.preventDefault();
		//  addUser();

	});
	//  var newid = lastNodeId + 1;
	// $( "#dialog-form" ).dialog( "option", "title",  'NODE' +"  " + newid  );  //title for node dialog
	////////////////////////////////////////////////////////////////////dialog for relationship(edge)/////////////////////////////////
	dialognew = $("#pathnewform").dialog({
		autoOpen : false,
		height : 250,
		width : 320,
		modal : true,
		buttons : {
			"Save" : createrel,
			Reset : function() {
				$('#relforms')[0].reset();
				console.log(this);
				// this.form.reset();

			}
		},
		close : function() {
			validrel = "";
			dialognew.dialog("close");
			//  allFields.removeClass( "ui-state-error" );
		}
	});

	$("#pathnewform").dialog("option", "title", "Edge/Relationship");

	// Added [11/15/14]
	$(document).on("click", ".newzoombtn", function(e) {
		newdragging = 1;
		onetransit = 1;
		console.log(pj);
		//$('#newpopupbox').popup('hide');
		var offset = $('.dummypanel').offset();
		newnodepointx = (e.pageX - offset.left) / zoom.scale();
		newnodepointy = (e.pageY - offset.top) / zoom.scale();
		e.preventDefault();
		e.stopPropagation();
		var node_id = $(this).attr("value");
		if (!node_id) {
			return;
		}
		current_node = d3.select(".node" + node_id);
		//getting the nodes with the given id
		var a = d3.transform(d3.select(current_node[0][0].parentNode).attr("transform")).translate;
		console.log(current_node[0][0].parentNode);
		console.log(a);
		console.log("**haha**");
		var newzooming = zoom.scale() * 1000;
		console.log(p0);

		var p1 = [a[0], a[1] + 300, 1000];
		console.log(p1);
		console.log(newnodepointx);
		console.log(newnodepointy);

		trans_scale = center_point[2] / p1[2];
		trans_deviation[0] = center_point[0] - p1[0] * trans_scale;
		trans_deviation[1] = center_point[1] - p1[1] * trans_scale;
		if ( typeof pj != 'undefined' && pj != null) {
			lastpos = [pj[0], pj[1], pj[2]];

			p0[0] = (center_point[0] - pj[0]) / pj[2];
			p0[1] = (center_point[1] - pj[1]) / pj[2];
			p0[2] = center_point[2] / pj[2];

			pj = null;
		}

		vis.call(transition, p0, p1);

		zoom.translate(trans_deviation).scale(trans_scale);

		lookpos = p1;
		p0 = p1;
		//    var actualzoom = zoom.scale();
		currentzoom = zoom.scale();
		/**  if(typeof newlocalcoord === 'undefined'){
		 console.log(p0);
		 var p1 = [a[0], a[1]+300, 1000];
		 console.log(newnodepointx);
		 console.log(newnodepointy);
		 vis.call(transition, p0, p1);
		 p0 = p1;
		 }
		 else{
		 p0 = [newlocalcoord[0],newlocalcoord[1],newzooming];
		 console.log(p0);
		 var p1 = [a[0], a[1]+300, 1000];
		 console.log(newnodepointx);
		 console.log(newnodepointy);
		 vis.call(transition, p0, p1);
		 p0 = p1;
		 }**/
	});
	$(document).on("click", ".newlinkzoom", function() {
		var link_id = $(this).attr("value");
		if (!link_id) {
			return;
		}
		current_link = d3.select("#newpaths" + link_id);
		//getting the nodes with the given id
		var srcnode = link_id.substr(0, 1);
		var tarnode = link_id.substr(1, 1);
		var nodesrc = d3.select('.node' + srcnode);
		var nodetar = d3.select('.node' + tarnode);
		console.log(nodesrc[0][0].parentNode);
		console.log(nodetar[0][0].parentNode);
		//  var a = d3.transform(d3.select(current_link[0][0].attributes[3].nodeValue).attr("transform")).translate;
		//var a = d3.select(current_node[0][0].parentNode).attr("transform");
		//var a = current_node[0][0];
		var x = d3.transform(d3.select(nodesrc[0][0].parentNode).attr("transform")).translate;
		var y = d3.transform(d3.select(nodetar[0][0].parentNode).attr("transform")).translate;
		console.log("**haha**");

		var z = (x[0] + y[0]) / 2;
		var d = (x[1] + y[1]) / 2;
		var p2 = [z, d + 300, 1000];

		trans_scale = center_point[2] / p2[2];
		trans_deviation[0] = center_point[0] - p2[0] * trans_scale;
		trans_deviation[1] = center_point[1] - p2[1] * trans_scale;
		if ( typeof pj != 'undefined' && pj != null) {
			lastpos = [pj[0], pj[1], pj[2]];

			p0[0] = (center_point[0] - pj[0]) / pj[2];
			p0[1] = (center_point[1] - pj[1]) / pj[2];
			p0[2] = center_point[2] / pj[2];

			pj = null;
		}

		vis.call(transition, p0, p2);

		//vis.attr("transform", "translate(" + trans_deviation + ")" + " scale(" + trans_scale + ")");
		zoom.translate(trans_deviation).scale(trans_scale);
		p0 = p2;

	});
});
/////////////////////////////////////////////////////////////////////// Updating data in node (after pressing save in node dialog)//////////////////////////////

var last_item_title = "";
var last_item_date;

function changenode() {
	//	$('#newpanel').accordion();

	$('span[role="status"]').find("div").hide();
	// auto-complete functionality
	validnode = $('#termtext').val();
	console.log("CHANGENODE() START ---- ");
	console.log(newnodenew);
	newnode = d3.select(".node" + newnodenew.id);
	//getting the nodes with the given id
	console.log(newnode);
	var detailsdata;
	////////////////////////// validating the Term field is not empty in the node dialog/////////////////
	if (validnode != "") {
		newnode.classed('disease1', true);
		//adding a class
		// get all the inputs into an array.
		// $( "#newdata" ).html("This is the data");
		//$( "#newdata" ).hide();
		// $("<div class='newdetailstext' id ="newdetailstextmodal"></div>").insertAfter('')
		$("#nodecontent").html('  Node' + newnodenew.id + '<br>');

		var thatsdata = $("#frm-data").serializeArray();
		//data from the dialog
		totaldata[index] = thatsdata;
		// $()
		console.log(thatsdata);
		console.log(totaldata);
		// time-stamp for display in the updates section//
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
		console.log(newformatdate);
		/*------------------------------------Displaying node in updates section----------------------------------*/
		//   $('#headupdate1').html('<span id = "nodehead'+ newnodenew.id +'" class = "newnodehead"><b>' +'Node' + newnodenew.id + '<b></span>' );
		//newonenode =  $('#headupdate1').html();
		//$('#datenew').html("&nbsp&nbsp" +'<span class = "oldupdates'+newnodenew.id+'"><text class ="datetext" id = "dateexact'+ newnodenew.id + '">'+ newformatdate +"  "+'</text>'+'<a href = "#" class="detailstext'+ newnodenew.id +'"  id= "approxdetails'+ newnodenew.id +' ">Details</a></span><br>');
		//$("#newdetails").show();
		//newonedate = $('#datenew').html();
		// /*--------------------------------------------------------------------------------------------------------*/

		var abcd;
		var count = 0;
		var countclass = d3.selectAll('.disease1');
		console.log(countclass);

		//    $('#newdetailstextmodal').html('<span id="detailsspan' + newnodenew.id + '"></span><br>');

		// Added [11/15/14]
		var new_panel = $("#newpanel");
		//var old_data = new_panel.find(".update-item").html();
		var old_data = new_panel.html();
		var new_update_item = $("#newpanel .update-item.blank");

		$("#newpanel .update-item").each(function() {
			if ($(this).attr("value") == newnodenew.id) {
				new_update_item = $(this);
				old_data = "";
			}
		});

		new_update_item.removeClass("blank").removeAttr("hidden");
		var new_update_date = $(".update-item .newdetailstext").first();
		// What for??
		new_update_item.find("#headupdate1").html('<span id = "nodehead' + newnodenew.id + '" class = "newnodehead">' + 'Node' + newnodenew.id + '</span>');
		newonenode = new_update_item.find("#headupdate1").html();
		// new_update_item.find("#datenew").html("&nbsp&nbsp" +'<span class = "oldupdates'+newnodenew.id+'"><text class ="datetext" id = "dateexact'+ newnodenew.id + '">'+ newformatdate +"  "+'</text><br>');
		//  new_update_date.find('#datenew').html("&nbsp&nbsp" +'<span class = "oldupdates'+newnodenew.id+'"><text class ="datetext" id = "dateexact'+ newnodenew.id + '">'+ newformatdate +"  "+'</text><br>');
		newonedate = new_update_item.find("#datenew").html();
		new_update_item.find('#newdetailstextmodal').html("&nbsp&nbsp" + '<span class = "oldupdates' + newnodenew.id + '"><text class ="datetext" id = "dateexact' + newnodenew.id + '">' + newformatdate + "  " + '</text><br><span id="detailsspan' + newnodenew.id + '"></span><br><button id = "zoombtn' + newnodenew.id + '" class= "newzoombtn">Go to Node</button>');
		new_update_item.attr("value", newnodenew.id);
		$('.newzoombtn').attr("value", newnodenew.id);
		if (old_data != "") {
			//  $('.update-item').html(new_update_item);
			new_panel.html(new_update_item);
			new_panel.append(old_data);
		}
		//$('#olddetailstextmodal').append('<span id="olddetailsspan' + newnodenew.id + '"></span><br>');
		console.log(thatsdata.length);
		//  next+1  changed it to thatsdata.length
		for ( i = 0; i <= thatsdata.length - 1; i++) {
			//$("#newdetailstextmodal").hide();
			$("#olddetailstextmodal").hide();
			//$("#detailsspan" + newnodenew.id).append("<br>  " + thatsdata[i].name + " :  " + thatsdata[i].value);
			$("#detailsspan" + newnodenew.id).append(thatsdata[i].name + " :  " + thatsdata[i].value + "<br>");
			$("#olddetailsspan" + newnodenew.id).append(thatsdata[i].name + " :  " + thatsdata[i].value + "<br>");
		}

		console.log(thatsdata.length);
		/*----------------tool-tip for latest entry of node in update section-----------*/
		// 	  $(function() {
		//
		//    $( ".latestupdates").tooltip({
		//    	          events: {
		//        input: 'mouseover,mouseout'
		//    },
		//    	     items: 'div',
		//             track: true,
		//           content: function(){
		//          	 	$("#newdetailstextmodal").hide();
		//				console.log("CHILDREN:");
		//          	 	console.log($("#newdetailstextmodal").children());
		//          	 	count = count + 1;
		//         efgh = $("#detailsspan" + newnodenew.id).html();
		//         abcd = $("#newdetailstextmodal").html() ;
		//          //console.log(abcd);
		//          //console.log(efgh);
		//        return efgh;
		//        },
		//
		//      show: {
		//        effect: "slideDown",
		//        delay: 250
		//      }
		//
		// });
		// });
		//         /*-------------------------*/
		// console.log(abcd);
		// });
		//}

		// code for update section
		// var countlength = countclass[0].length;
		//  for(i=0;i<countclass[0].length;i++){
		// 	//$('headupdateold' ).append()
		// 	 $("#headupdateold").show('slow');
		//
		// 	//$('headupdateold'+ i).append(newonenode );
		//
		// }

		if (countclass[0].length) {                     //continued validating data
			if (last_item_title != "" && (last_item_title != newonenode) && (last_item_date != newonedate )) {
				var temp = $("#headupdateold" + newnodenew.id).html();
				var datetemp = $("#dateold" + newnodenew.id).html();

				$("#headupdateold1").show();
				//	$("#headupdateold").css("margin-top", function(b){
				//	return b + 30;
				//});
				$("#headupdateold" + newnodenew.id - 1).html(last_item_title);
				//		$("#dateold"+newnodenew.id-1).append(last_item_date);
				//		$("#headupdateold"+newnodenew.id-1).append(temp);                   //adding old data to updates section
				//		$("#dateold"+newnodenew.id-1).append(datetemp);
				//        //$("#daterelnew").css("margin-top",function(b){
				//return b - 47;
				//  });
				//    $("#headupdaterel1").css("margin-right", "-211");
				$("#headupdateold" + newnodenew.id).slideDown('veryslow', function() {
					//$(this).css("margin-top","2px" );
					//$(this).css("margin-bottom","2px" );
				}).delay(150000);
				$("#dateold" + newnodenew.id).slideDown('veryslow', function() {
					//$(this).css("margin-top","2px" );
					//	$(this).css("margin-bottom","2px" );
				}).delay(150000);
				//$("#headupdateold").hide();
				//$("#dateold").hide();
			}
			$("#olddetailstextmodal").hide();
			last_item_title = $('#headupdate1').html();
			last_item_date = $('#datenew').html();
			for ( i = 0; i <= thatsdata.length - 1; i++) {
				//$("#newdetailstextmodal").hide();
				$("#olddetailstextmodal").hide();
				//$("#detailsspan" + newnodenew.id).append("<br>  " + thatsdata[i].name + " :  " + thatsdata[i].value);
				//$("#olddetailsspan" + newnodenew.id).append(thatsdata[i].name + " :  " + thatsdata[i].value + "<br>");
				//$("#olddetailsspan" + newnodenew.id).append(thatsdata[i].name + " :  " + thatsdata[i].value + "<br>");
			}
			/*------------------------ tool-tip for Details element in the update section---------------------------------*/
			$(function() {
				//.find("[class^=detailstext]")

				$("#headupdateold" + newnodenew.id).find("[class^=detailstext]").tooltip({
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

						var i = $(this).attr("class").substring(11);
						efgh = $("#olddetailsspan" + i).html();
						abcd = $("#newdetailstextmodal").html();
						//console.log(abcd);
						//console.log(efgh);
						return efgh;
					}
				});
				////////////////////////////////////////////////////////////////////////////////////
				var newheight = $("#panel2").height();
			

			});
		}

	}//else{
	//newnode.style('fill','white');
	//}

	//$('#newpanel').append('<h4><p id = "headupdateold'+(newnodenew.id)+'" class = "oldheadupdate"></p><p id = "dateold'+newnodenew.id + '"  class = "olddateupdate"></p>');
	console.log(next);
	//$('#formhead'+(newnodenew.id)).html('<p id = "headupdateold'+(newnodenew.id)+'"class = "oldheadupdate">abcd</p><br><p id = "dateold'+(newnodenew.id) + '"class = "olddateupdate">efgh</p>' );
	//$("#headupdateold"+newnodenew.id).html(last_item_title);
	//$("#dateold"+newnodenew.id).append(last_item_date);
	//$("<div id='olddetailstextmodal" + (newnodenew.id) + "'></div>").insertAfter('#formhead'+(newnodenew.id));
	dialog.dialog("close");
	$('#dialog-form').popup('hide');
	//updating the form data in the panel
	$('#frm-data')[0].reset();
	$("#newpanel").accordion("refresh");
	index = index + 1;
	$("#newpanel").accordion("option", "icons", {
		"header" : " ",
		"activeHeader" : " "
	});
	$("#newpanel").accordion("option", "collapsible", true);
	$("#newpanel").accordion("option", "active", false);
}

/*-----------------------------------end of Update section for node data and time-stamp with tool-tip-----------------------------*/
/*--------------------Conformation box for node deletion----------------*/
function deletenode() {
	$('#deletecontent').html("Are you sure you want to delete this node ?");

	$(function() {
		dialogconfirm = $("#conformationbox").dialog({
			resizable : false,
			height : 140,
			modal : true,
			buttons : {
				"Delete the node" : validnodedelete,
				Cancel : function() {
					$(this).dialog("close");
				}
			}
		});
	});
}

/*------------------------------- node deleting --------------------------------*/
function validnodedelete() {
	var thatvalidnode = $('#termtext').val();
	if (termdata != "") {

		$('#headupdate' + next).remove('Node' + newnodenew.id);
		for ( i = 0; i <= next + 1; i++) {
			// var foraccord = $('#formdata').append(thatsdata[0].name,':   ',thatsdata[0].value);
			//$('#formdata' + next).remove( thatsdata[i].name,':   ',thatsdata[i].value);

		}
		nodes.splice(nodes.indexOf(selected_node), 1);
		spliceLinksForNode(selected_node);
		restart();
		dialogconfirm.dialog("close");
	} else {
		nodes.splice(nodes.indexOf(selected_node), 1);
		spliceLinksForNode(selected_node);
		restart();
		dialogconfirm.dialog("close");
	}
}

/*------------------------------- transition (added [11/15/14]) --------------------------------*/
function transition(svg, start, end) {
	var center = [width / 2, height / 2], i = d3.interpolateZoom(start, end);
	console.log("CENTER : " + center);

	//    svg.attr("transform", transform(start));
	//    vis.attr("transform", transform(start));
	vis.attr("transform", transform(start)).transition().delay(250).duration(i.duration * 2).attrTween("transform", function() {
		return function(t) {
			return transform(i(t));
		};
	}).each("end", function() {
		trans_ended = true;
	});
	/**     if (zoom.scale() != 1.051 ){
	 var newzoom = zoom.scale()*1000;
	 var newstart = [nodepointx,nodepointy,newzoom];
	 each( function() { d3.select(this).call(transition, newstart, end); });
	 }**/

	function transform(p) {
		newcounters = 1;
		//    	 console.log(p);
		var k = height / p[2];
		newdraggingscale = k;
		newpointx = (center[0] - p[0] * k);
		newpointy = (center[1] - p[1] * k);
		newpoint = [newpointx, newpointy];
		//var k = height/newscale;
		return "translate(" + (center[0] - p[0] * k) + "," + (center[1] - p[1] * k) + ")scale(" + k + ")";
		//       return "translate(" + (newlocalcoord[0] - p[0] * k) + "," + (newlocalcoord[1] - p[1] * k) + ")scale(" + k + ")";
	}

}

