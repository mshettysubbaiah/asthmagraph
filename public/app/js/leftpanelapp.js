var orgid;
var parid;
var originalterm;
var OTable = $('#example').dataTable({
	
	// "scrollCollapse" : true,

	"bServerSide":true,
	"bProcessing": true,
	"bSearchable": true,
	"scrollY" : "350px",
	"sDom": '<"top"f>rtiS',
	"scrollCollapse": true,
	"paging": false,
	 "bFilter": true,
	"colResize" : {
		"tableWidthFixed" : false,
	},
          	
  	"sAjaxSource": "app/data/_search_databootstrap.json",

  	//"sAjaxSource": "/api/getstandardterms",

  	///"ajax" : "app/data/_search_databootstrap.json",
	"fnServerParams": function( aoData ){

		var isAllChecked = document.getElementById('All').checked;

		if (isAllChecked = "true") {
			isICD10Checked = true;
			isSNOMEDChecked = true;
			isLOINCChecked = true;
			isRXNORMChecked = true;
			isMESHChecked = true;
		} else {

			var isICD10Checked = document.getElementById('icd10').checked;
			var isSNOMEDChecked = document.getElementById('snomed').checked;
			var isLOINCChecked = document.getElementById('loinc').checked;
			var isRXNORMChecked = document.getElementById('rxnorm').checked;
			var isMESHChecked = document.getElementById('mesh').checked;
		}

		// send the database checked information to the server
		// the search will occur on the selected database only
		aoData.push({"name":"icd", "value": isICD10Checked});
		aoData.push({"name":"snomed", "value": isSNOMEDChecked});
		aoData.push({"name":"loinc", "value": isLOINCChecked});
		aoData.push({"name":"rxnorm", "value": isRXNORMChecked});
		aoData.push({"name":"mesh", "value": isMESHChecked});
	},

	"fnCreatedRow" : function(nRow, aData, iDataIndex) {

		$('#example tbody tr td ').attr("id", OTable.fnGetData().length);
	},
	"fnrowCallback" : function(row, data) {

	},
	"columns" : [{
			"aTargets" : [0],
			"mData" : "id",
			"sClass": "newid",
			"mRender" : function(data, type, val) {

				
				var z = val.id;
				

				if (!val.id) {
					val.id = "0";
				}
				if (z.length > 6) {
					orgid = val.id;
					z = z.substr(0, 6) + "...";

					return z;
				}
				if (z.length <= 6) {
				
					return z;
				}

			}	
		}, 
		{
			"aTargets" : [1],
			"mData" : "term",
			"sClass": "newterm",
			"mRender" : function(data, type, val) {
				var y = val.term;
				// console.log(y);

				if (!val.term) {
						val.term = " ";
					}
				if ( y.length < 30 ) {
					orgterm = val.term;
					//y = y.substr(0, 30) + "...";
					return y;
				}
				if (y.length >= 30) {
					

					y = y.substr(0, 30) + "...";
					return y;
				}

			}
		}, 
		{
				"data" : "db",
				"width" : "20%",
				"sClass": "newdb",
		}]
});


				/**************************************************************************/
				

$('.dataTables_filter input').attr("placeholder", "Search for standard terms"); //placeholder for search in datatables
$('.dataTables_filter input').keydown(function(e){

	e.stopPropagation();

});

$(document).on("contextmenu", "#example tbody ", function(e) {
	return false;
});

$(document).on("contextmenu", "#example tbody td.newid ", function(e) {

	var copieddata;

	$.contextMenu({
		selector : '#example tbody td.newid',
		callback : function(key, options) {
			var m = "clicked: " + key;
			
			if (key == "Copy") {	
				var actualcopying = this[0].parentNode.id;
				console.log(actualcopying);
                console.log(OTable.fnGetData()[actualcopying - 1]);

					if (OTable.fnGetData()[actualcopying - 1].db == 'ICD10') {
							console.log(OTable.fnGetData()[actualcopying - 1].id);
						$('#icd_input').val(OTable.fnGetData()[actualcopying - 1].id);
					}
					if (OTable.fnGetData()[actualcopying - 1].db == 'SNOMED') {
						$('#snomed_input').val(OTable.fnGetData()[actualcopying - 1].id);
					}
					if (OTable.fnGetData()[actualcopying - 1].db == 'RxNorm') {
						$('#rxnorm_input').val(OTable.fnGetData()[actualcopying - 1].id);
					}
					if (OTable.fnGetData()[actualcopying - 1].db == 'MeSH') {

						$('#mesh_input').val(OTable.fnGetData()[actualcopying - 1].id);
					}
					if (OTable.fnGetData()[actualcopying - 1].db == 'LOINC') {

						$('#loinc_input').val(OTable.fnGetData()[actualcopying - 1].id);
					}

				//}
			} /* end of Copy if condition */

			if (key == "paste") {
				if (newcut == 1) {
					console.log("pasting");				
				} 
			} /* end of Paste */
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
	}); /* End of Context Menu */
});



$(document).on("contextmenu", "#example tbody td.newterm ", function(e) {

$.contextMenu({  //context menu for term
		selector : '#example tbody td.newterm ',
		callback : function(key, options) {
			var m = "clicked: " + key;
			if (key == "Copy") {

				$(this).attr("id", parid);
				var actualcopying = this[0].parentNode.id;
				console.log(this[0].innerHTML);			
				newterm_data = OTable.fnGetData()[actualcopying - 1].term;					
					$('#term_input').val(newterm_data);
				
				
			} /* end of Copy if condition */

			if (key == "paste") {
				if (newcut == 1) {
					
					console.log("pasting");
					
				} 
			} /* end of Paste */
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
	}); /* End of Context Menu */
	
});  /* End of line 152 */ 

	initializeTypeAhead();
	console.log($('#new_saving_token').text());
	$('#newbtn-slidepanel').bind('click', function() {
					console.log("slidebutton");
					$("#slider").show();
					actualcounter = actualcounter + 1;
					newverifycounter = actualcounter % 2;
					$('#extruderLeft div.flap').css('background','url("app/images/doubleleftarrowimage.png") no-repeat');
					if (newverifycounter == 1 || actualcounter == 1) {
							$('#leftacrosspanel').show();
							$("#slider").slideReveal("show");
							$("#extruderLeft div.flap").css('left', '200%');
							$('#newbtn-slidepanel').css('background','url("app/images/images-minus.png") no-repeat');
							$('#newbtn-slidepanel').css('background-size','100%');
							$("#adding-more").css('z-index', '2147483647');
							$("#adding-more").css('left', '998');
	
	}

		if (newverifycounter == 0 || actualcounter == 2) {
		
			    $('#newbtn-slidepanel').css('background','url("app/images/plus-1.png") no-repeat');	           
			  	$('#extruderLeft div.flap').css('background','url("app/images/leftarrowimages.jpg") no-repeat');
				$('#extruderLeft div.flap').css('background-size','60%');
				$('#newbtn-slidepanel').css('background-size','100%');
				$("#slider").slideReveal("hide");
				$("#extruderLeft div.flap").css('left', '100%');
				$("#adding-more").css('z-index', '2147483647');
				$("#adding-more").css('left', '498');

	}
});

//  function newchange(){
if ($("#All").is(':checked')) {
	$('input#icd10').attr("checked");
	console.log("checked");
} else {
	console.log("unchecked");
	$('#icd10  #snomed  #loinc #rxnorm #mesh').attr('unchecked');
}

				///
$("#extruderLeft div.flap").click(function() {
				console.log("flap");
				$("#newbtn-slidepanel").show();
				$("#adding-more").show();

				
				$("#adding-more").css('z-index', '2147483647');
				$("#adding-more").css('left', '498');
			    $('#extruderLeft div.flap').css('background','url("app/images/leftarrowimages.jpg") no-repeat');
			    $('#extruderLeft div.flap').css('background-size','60%');
			    $('#newbtn-slidepanel').css('background','url("app/images/plus-1.png") no-repeat');

			    
			    $('#newbtn-slidepanel').css('background-size','100%');
			    $("#slider").show();
				prevcounter = prevcounter + 1;
				prevverifycounter = prevcounter % 2;
				console.log(prevcounter);
				console.log(prevverifycounter);
	if (newverifycounter == 1 || actualcounter == 1) {

				$("#extruderLeft  div.flap").css('left', '100%');
	      
	}
	if (prevverifycounter == 0 || prevcounter == 2) {
		
				$('#extruderLeft div.flap').css('background','url("app/images/rightarrowimages.jpg") no-repeat');
				$('#extruderLeft div.flap').css('background-size','60%');
				$("#adding-more").hide();
				
				$("#adding-more").css('z-index', '100');
				$("#adding-more").css('left', '-15');
	}
});
	
var alarmID = 0;

$('#example tbody').on('click', 'td', function() {

	parid = this.parentNode.id;

	for ( i = 0; i < OTable.fnGetData().length; i++) {

	}
});



$('input').keydown(function(e){
			 e.stopPropagation();

});

				 // Functionality when submit button pressed
$('#termsSubmitBtn').click(function(){

        	
	       var newtoken = $.cookie('Token');
	              console.log("it is in submit");
	          // Get the final string to save
	       var jsonString = $("#final_saving_term").text();
                   console.log(jsonString);
               newtermsubmit = $('#term_input').val();
           
           console.log(newtermsubmit);
           var termInput = $('#term_input').val();
           
          $.ajax({
              type: 'POST',
              url: '/api/terms',
              data:jsonString,
              contentType: "application/json; charset=utf-8",
              dataType: 'json',
              async: true,
              
              success: function(data){
              	console.log(data.term);
                $.each(data, function(index, value) {
                  //alert(index);

                  // This indicates the success status
                  // The record successfully saved
                  // Processing the json {"status": "true"}
                  // 
                  if (data[index] == "true") {
                      
                      console.log(data[index].term);
                      $("#termentersuccessalert").fadeIn("slow");
                      $("#termentersuccessalert").html("Well done!  "+ newtermsubmit  +"  inserted successfully ");
                      

                  }
              });
            }
          });
          $("#newdatatermstosave")[0].reset();
          $('#termtypeahead').typeahead('destroy');
          initializeTypeAhead();
      });

function generateJSONTermsforedit(){
       
		        var term_input = document.getElementById('term_input_edit').value;
		        var loinc_input_edit = document.getElementById('loinc_input_edit').value;
		        var icd_input_edit = document.getElementById('icd_input_edit').value;
		        var snomed_input_edit = document.getElementById('snomed_input_edit').value;
		        var rxnorm_input_edit = document.getElementById('rxnorm_input_edit').value;
		        var mesh_input_edit = document.getElementById('mesh_input_edit').value;
		        var synonyms_input = document.getElementById('synonyms_input_edit').value;

		     
		        

		        var synonymsArray = [];
		        var synonymsArrayWithCommaAndSpaceSeparated = [];
		        // First split words which are ", " (comma and space separated)
		        synonymsArrayWithCommaAndSpaceSeparated = synonyms_input.split(", ");

		        // Second split words which are "," (comma separated)
		        len = synonymsArrayWithCommaAndSpaceSeparated.length;
		        for (var i=0; i<len; i++) {
		        text = synonymsArrayWithCommaAndSpaceSeparated[i].split(",");
		        if (text.length > 0){
		        for (var j =0; j < text.length; j++) {
		       		 synonymsArray.push(text[j])
		        }
		        }
		        else {
		        	 synonymsArray.push(text);
		        }
		        }

		        var myObj = {
		        term : term_input,
		        concepts :[
		                  { 'loinc': loinc_input_edit },
		                  { 'icd10': icd_input_edit },
		                  { 'snomed': snomed_input_edit },
		                  { 'rxnorm': rxnorm_input_edit },
		                  { 'mesh': mesh_input_edit }
		                ],
		         
		        synonyms: synonymsArray
		        };

		        jsonString = JSON.stringify(myObj);

		      //  alert(jsonString);

		       	$("#final_saving_term_edit").text(jsonString); 

		        }


function OnTermInputedit(event) {
	
		        var term_input_data = document.getElementById('term_input_edit').value;
		        var termlength = term_input_data.length;
		    



		      if (termlength > 0  ) {
		          // alert('insider');
				      $("#term_input_validate").fadeOut("slow");
				      $("#termentersuccessalert_edit").fadeOut("slow");

				       generateJSONTermsforedit();

		      }
		      else {
		      		$("#term_input_validate").fadeIn("slow");
                  
		        }
		        searchstring = "";
		      }

function OnTypeaheadInputedit(event) {
		   
		        var termdatatypeahead = document.getElementById('termtypeahead').value;
		        var termtypelength = termdatatypeahead.length;


                console.log(termtypelength);
		      if ( termtypelength > 0 ) {
		          // alert('insider');
				      $("#term_input_validate").fadeOut("slow");
				      $("#termentersuccessalert_edit").fadeOut("slow");

				       generateJSONTermsforedit();

		      }
		      else {
		      		$("#term_input_validate").fadeIn("slow");
                  
		        }
		        searchstring = "";
		      }


// Functionality when update button pressed
$('#termsUpdateBtn_edit').click(function(){

		        	
			       var newtoken = $.cookie('Token');
			       console.log("it is in submit");
		          // Get the final string to save
		           var jsonString = $("#final_saving_term_edit").text();
		           console.log(jsonString);
		          // alert(jsonString);
		           var newinsertterm_edit = jsonString.term;

		           // alert(jsonString);
		           var termInput = $('#term_input_edit').val();
		           console.log(termInput);

		      	$.ajax({
		              type: 'PUT',
		              url: '/api/terms',
		              data:jsonString,
		              contentType: "application/json; charset=utf-8",
		              dataType: 'json',
		              async: true,
		              
		              success: function(data){
		                $.each(data, function(index, value) {
		                  //alert(index);

		                  // This indicates the success status
		                  // The record successfully saved
		                  // Processing the json {"status": "true"}

		                  if (data[index] == "true") {
		                      // alert(data[index]);
		                      console.log('it is in index');
		                      $("#termentersuccessalert_edit").fadeIn("slow");
                              $("#termentersuccessalert_edit").html("Well done!  " + termInput + "  is updated successfully");
		                      // Call refresh button to reset fields after successful insert
		                      

		                        
		                      
		                  }
		              });
		            }
		          });
		          //console.log(datatermstosave);
		          $("#datatermstoedit")[0].reset();
		          $('#termtypeahead').typeahead('destroy');
          			initializeTypeAhead();


		      });


		        // Functionality when Delete button pressed in  Term edit
    $('#deletetermsbtn').click(function(){
		        	
		          console.log('it is in delete');
		       
		          // Get the final string to save

		          generateJSONTermsforedit();
		          var jsonString = $("#final_saving_term_edit").text();

		        
		          var newterm_edit = $('#term_input_edit').val();
		          // alert(jsonString);
			        console.log(newterm_edit);
			            // send ajax post to delete the term
			            
			            $.ajax({
			              type: 'DELETE',
			              url: '/api/terms', //datatermstodelete',
			              data:jsonString,
			              contentType: "application/json; charset=utf-8",
			              dataType: 'json',
			              async: true,
			              success: function(data){
			                $.each(data, function(index, value) {
			                  

			                  // This indicates the success status
			                  // The record successfully saved
			                  // Processing the json {"status": "true"}
                               
			        if (data[index] == "true") {
			                     
			                     
			                      $("#termdeletesuccessalert_edit").fadeIn("slow");
                                  $("#termdeletesuccessalert_edit").html("Well done! " + newterm_edit + " deleted successfully" );
			                      // Call refresh button to reset fields after successful insert

		                  }
		                });
		              }
		            });

		            // After successful delete reinitialize the typeahead so the deleted term 
		            // is not in the searchable list
		            $('#datatermstoedit')[0].reset()
		            initializeTypeAhead();

		          

		        });

					//Clear all functionality
			$('#cleartermsbtn').click(function(){
		          console.log('it is in delete');
		          // Get the final string to save
		          var jsonString = $("#final_saving_term").text();
		          console.log(jsonString);
		          var newterm = jsonString.term;
		          // alert(jsonString);
		     if (Boolean(jsonString)) {
		            // send ajax post to delete the term

		            
		            $.ajax({
		              type: 'POST',
		              url: 'datatermstodelete',
		              data:jsonString,
		              contentType: "application/json; charset=utf-8",
		              dataType: 'json',
		              async: true,
		              success: function(data){
		                $.each(data, function(index, value) {
		                  

		                  // This indicates the success status
		                  // The record successfully saved
		                  // Processing the json {"status": "true"}

		                  if (data[index] == true) {
		                      
		                      $("#termentersuccessalert").fadeOut("slow");
		                      $("#termentersuccessalert").html("Well done!" + newterm + "deleted successfully" );
		                      $("#termdeletesuccessalert").fadeIn("slow");

		                      // Call refresh button to reset fields after successful insert
		                      $("#termsRefreshBtn").trigger("click");

                      
                  }
                });
              }
            });

		            // After successful delete reinitialize the typeahead so the deleted term 
		            // is not in the searchable list
		            initializeTypeAhead();

	          }

	        });

					            /**
		       * Compute the savable terms and displays dynamically as "Database terms"
		       * Gets the value of each field and computes the JSON string
		       *
		       * @param 
		       * 
		      */

		function generateJSONTerms(){
		       
		        var term_input = document.getElementById('term_input').value;
		        var loinc_input = document.getElementById('loinc_input').value;
		        var icd_input = document.getElementById('icd_input').value;
		        var snomed_input = document.getElementById('snomed_input').value;
		        var rxnorm_input = document.getElementById('rxnorm_input').value;
		        var mesh_input = document.getElementById('mesh_input').value;
		        var synonyms_input = document.getElementById('synonyms_input').value;

		        var synonymsArray = [];
		        var synonymsArrayWithCommaAndSpaceSeparated = [];
		        // First split words which are ", " (comma and space separated)
		        synonymsArrayWithCommaAndSpaceSeparated = synonyms_input.split(", ");

		        // Second split words which are "," (comma separated)
		        len = synonymsArrayWithCommaAndSpaceSeparated.length;
		        for (var i=0; i<len; i++) {
		        		text = synonymsArrayWithCommaAndSpaceSeparated[i].split(",");
		        	if (text.length > 0){
		        		for (var j =0; j < text.length; j++) {
		       			 	synonymsArray.push(text[j])
		       		 }
		        }
		        else {
		        synonymsArray.push(text);
		        }
		        }

		        var myObj = {
		        term : term_input,
		        concepts :[
		                  { 'loinc': loinc_input },
		                  { 'icd10': icd_input },
		                  { 'snomed': snomed_input },
		                  { 'rxnorm': rxnorm_input },
		                  { 'mesh': mesh_input }
		                ],

		        synonyms: synonymsArray
		        };

		        jsonString = JSON.stringify(myObj);

		       		 $("#final_saving_term").text(jsonString); 
		        }


      /**
       * Ensure that the required field is filled with data
       * The required field is the "term" field
       *
       * @param {event} event
       * 
      */
	    function OnTermInput(event) {
	        var searchstring = event.target.value.trim();
	        var searchstringlength = searchstring.length;
	        var term_input_data = document.getElementById('term_input').value;
	        var termlength = term_input_data.length;



				  if (termlength > 0) {
				      // alert('insider');
						  $("#term_input_validate").fadeOut("slow");
						  $("#termentersuccessalert").fadeOut("slow");

						  generateJSONTerms();

				  }
				  else {
			  			  $("#term_input_validate").fadeIn("slow");

				    }
				    searchstring = "";
				  }

      /**
       * textonnedown - It stops the propogration
       * @return {[type]} [description]
       */
		function OnTextAreaKeyDown(){
		      		 $('textarea').keydown(function(e) {
		               		e.stopPropagation();
		       		});
		       
		      }

			var jsonString = {};
      var searchTable;

      /**
       * Initializes the searchable terms from termsmaster mongodb, 
       * the collection is db.terms. It performs multiple functions
       * 1. Gets all the "terms" aynchronously and initializes the typeahead
       * 2. On selecting the term, automatically populates the fields with details
       * 
      */
      function initializeTypeAhead() {
        
        var termsData = [];  
        $.getJSON('/api/terms', function(terms){
          console.log(terms.data[0]);

          for (var i=0; i <= terms.data.length; i++) {
              if (terms.data[i]) {   // If empty then it will not assign
                  termsData.push(terms.data[i]);
            }
          }
          
          $("#termtypeahead").typeahead({
                  source:termsData,
                  updater: function(item) {
                   // display the terms and generate the JSON savable term data
                  gettermdetails(item);
                  return item;
                  }
              });
          });
        }   /* ----- End of initializeTypeAhead ---- */
   /**
       * Performs multiple functions:
       * 1. gets the entire details for a given term
       * 2. sets the field with the right data 
       * 
       * @param {String} term
       * 
      */
      
    function gettermdetails(term){

          // Get the final string to save
      var inputterm = term;
      
          console.log(inputterm);
          
          var concepts= {};
          $.ajax({
              type: 'GET',
              url: '/api/gettermdetails?term=' +inputterm,
              // data: mytermJSONObj,
              contentType: "application/text; charset=utf-8",
              dataType: 'json',
              async: true,
              success: function(data){
                // Set the data in the saving terms also
                $("#final_saving_term").text(JSON.stringify(data));
                  console.log(data);
                $.each(data, function(index, value) {
                
                console.log(index);
                console.log(data.data[0].term);

                      document.getElementById('term_input_edit').value = data.data[0].term;
                      console.log(data.data[0].term);

                      document.getElementById('synonyms_input_edit').value = data.data[0].synonyms;
           
                           $('#icd_input_edit').html(data.data[0].concepts[1].icd10);
                            
                           $('#snomed_input_edit').html(data.data[0].snomed);
                              document.getElementById('snomed_input_edit').value = data.data[0].concepts[2].snomed;
                            
                           $('#loinc_input_edit').html(data.data[0].loinc);
                              document.getElementById('loinc_input_edit').value = data.data[0].concepts[0].loinc;
                           
                           $('#rxnorm_input_edit').html(data.data[0].rxnorm);
                              document.getElementById('rxnorm_input_edit').value = data.data[0].concepts[3].rxnorm;
                        
                           $('#mesh_input_edit').html(data.data[0].mesh_input);
                              document.getElementById('mesh_input_edit').value = data.data[0].concepts[4].mesh;
                        
                
                 
              });

                }
            });
$("#term_input_validate").fadeOut("slow");
                
      }

/*****************************************************************************/
   $(function() {
    $( "#listaccordion" ).accordion({ 
         heightStyle: "content",
         collapsible: true,
         active: false 

    	});
  });
var terms_length;

/*pseudocode
var sortOrder;
if (Latest is selected) {
sortOrder = 1;
} else if (Alphabet is select) {
sortOrder = 2;
}
var url = "/api/terms?sortorder=" + sortOrder;
pass the url in the below ajax at line 841
*/
var sortOrder = 1;
var getdata;
      
     $.ajax({
     	type:"get",
     	url:"/api/terms",
     	success: function(data){
     		console.log(data);
     		getdata = data.data;
     		console.log(getdata);
     		console.log(data.data[0]);
     		var termIndex = 0;
     		if (data.data[termIndex]) {

     			  $("#termheading").css('class','hidden');
     		
     		}
     		terms_length = data.data.length;
     		//console.log(data.data);
     		for(i=0;i<data.data.length; i++){

     			$("#termentrydata").after('<span id = "termheading'+ i + '"style = "text-align:left;font-size:80%;" class = "listtermshead1" ></span><div id = "termentrydata'+ i +'"><span  id  = "listnewsynonmshead'+ i + '">Synonyms:</span><span id  = "listnewsynonyms_data'+ i + '">&nbsp;&nbsp;</span><br><br><span  id  = "listnewsynonms_codes">Codes:</span><table style = "margin-top:-120px;margin-left:30px;" class = "listtabledetails"><tr><td  id  = "listnewsynonyms_loinc_head"><b>LOINC</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>&nbsp;&nbsp;&nbsp;&nbsp;<td  id  = "listnewsynonyms_loinc'+ i + '"></td></tr><br><br><tr><td  id  = "listnewsynonyms_icd10_head"><b>ICD10</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>&nbsp;&nbsp;&nbsp;&nbsp;<td  id  = "listnewsynonyms_icd10' + i + '"></td></tr><br><br><tr><td  id  = "listnewsynonyms_snomed_head"><b>SNOMED</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>&nbsp;&nbsp;&nbsp;&nbsp;<td  id  = "listnewsynonyms_snomed' + i + '"></td></tr><br><br><tr><td  id  = "listnewsynonyms_rxnorm_head"><b>RxNorm</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>&nbsp;&nbsp;&nbsp;&nbsp;<td  id  = "listnewsynonyms_rxnorm' + i + '"></td></tr><br><br><tr><td  id  = "listnewsynonyms_mesh_head"><b>MeSH</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>&nbsp;&nbsp;&nbsp;&nbsp;<td  id  = "listnewsynonyms_mesh'+ i + '"></td></tr></table><br></div>');
     			
     			$("#termheading" + i).html(data.data[i]);
     			
     		}
            

            $("#listaccordion").accordion('refresh');
          
        }
    });


console.log(getdata);

var flag = 1;

$('body').on('click','span.listtermshead1',function(e){         
var htmlid = 0;
var dataid = 0;

console.log($(this)); 
console.log(e.target.id);
var targetid = e.target.id.substr(11,12);
console.log(targetid);
var newlistterm =  $(this).text(); 
console.log(newlistterm);       
          $.ajax({
              type: 'GET',
              url: '/api/gettermdetails?term=' + newlistterm,
              // data: mytermJSONObj,
              contentType: "application/text; charset=utf-8",
              dataType: 'json',
              async: true,
              success: function(data){
          
     		console.log(data.data.length);
     		var newdata = [];
     		console.log(data.data[0].synonyms.length);
     		console.log(htmlid);
     			         var newdata = [];
		         for(i = 0 ;i < data.data[0].synonyms.length; i++){
		         	         if (i % 3 == 0 && i>1){
		         	         	newhtmlcode = '<span id = "newsyncdata'+ i +'"class = "label label-info newinfo">'+data.data[0].synonyms[i] +'</span><br><br>';
		         	         }
		         	         else{
                             newhtmlcode = '<span id = "newsyncdata'+ i +'"class = "label label-info newinfo">'+data.data[0].synonyms[i] +'</span>';
                             }
                             newdata.push(newhtmlcode);
		         }
                  console.log(newdata);
		         
                      $("#listnewsynonyms_data" + targetid).html(newdata);
			     	  var syncval = $("#listnewsynonyms_data" + targetid).text().split(',');
			     	  console.log(syncval);
			     		$("#listnewsynonyms_loinc" + targetid).html(data.data[0].concepts[0].loinc);
			     		$('#listnewsynonyms_icd10' + targetid).html(data.data[0].concepts[1].icd10);
			     		$('#listnewsynonyms_snomed' + targetid).html(data.data[0].concepts[2].snomed);
			     		$('#listnewsynonyms_rxnorm' + targetid).html(data.data[0].concepts[3].rxnorm);
			     		$('#listnewsynonyms_mesh' + targetid).html(data.data[0].concepts[4].mesh);

              	
				$("#listaccordion").accordion('refresh');
              }
          });
          
      });


              	


	function sortalpha(){  

			console.log('abcd');
			sortOrder = 2;
			  
			listsort();

			}

	function sortlatest(){
			console.log('sortlatest');
			sortOrder = 1;
			listsort();
			}

	function listsort(){
			  $.ajax({
			     	type:"get",
			     	url:"/api/terms?sortorder=" + sortOrder,
			     	success: function(data){
			     		console.log(data);
			     		getdata = data.data;
			     		console.log(getdata);
			     		console.log(data.data[0]);
			     		var termIndex = 0;
                             if ( sortOrder == 1){
                             	data.data.reverse();
                             }
			     		terms_length = data.data.length;
			     		console.log(data.data);
			     		for(i=0;i<data.data.length; i++){
			     			
			     			$("#termheading" + i).html(data.data[i]);
			     			
			     		}
			            

			            $("#listaccordion").accordion('refresh');
			   
			        }
			    });


			}
$('.listterms ').on('click',function(e){ 
   console.log('it is in tag function');
     $.ajax({
     	type:"get",
     	url:"/api/terms",
     	success: function(data){
     		console.log(data);
     		getdata = data.data;
     		console.log(getdata);
     		console.log(data.data[0]);
     		var termIndex = 0;
     		console.log(data.data.reverse());
     		if (data.data[termIndex]) {

     			  $("#termheading").css('class','hidden');
     			
     		}
     		terms_length = data.data.length;
     		for(i=0;i<data.data.length; i++){
     			
     			$("#termheading" + i).html(data.data[i]);
     			
     		}
            

            $("#listaccordion").accordion('refresh');
          
        }
    });

});
