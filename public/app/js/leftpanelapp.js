			var orgid;
			var parid;
			var OTable = $('#example').dataTable({
			// "dom" : '<"top"f>Zrt<"bottom"p><"clear">',
		//	"scrollY" : "200px",
			"sDom": '<"top"f>ti<"bottom"p><"clear">',
			"scrollCollapse" : true,
			"bServerSide":true,
			 "bFilter": true,
			"colResize" : {
				"tableWidthFixed" : false,
			},
          	"bProcessing": true,
          	// "sAjaxSource": "app/data/_search_databootstrap.json",
          	"sAjaxSource": "/api/getstandardterms",
	                                      
	                                   
			//"ajax" : "app/data/_search_databootstrap.json",
			//
			"fnServerParams": function( aoData ){


				var isICD10Checked = document.getElementById('icd10').checked;
				var isSNOMEDChecked = document.getElementById('snomed').checked;
				var isLOINCChecked = document.getElementById('loinc').checked;
				var isRXNORMChecked = document.getElementById('rxnorm').checked;
				var isMESHChecked = document.getElementById('mesh').checked;
				// send the database checked information to the server
				// the search will occur on the selected database only
				aoData.push({"name":"icd", "value": isICD10Checked});
				aoData.push({"name":"snomed", "value": isSNOMEDChecked});
				aoData.push({"name":"loinc", "value": isLOINCChecked});
				aoData.push({"name":"rxnorm", "value": isRXNORMChecked});
				aoData.push({"name":"mesh", "value": isMESHChecked});
				aoData.push({"name":"token", "value": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InVzZXIxQHVzZXIxLmNvbSJ9._lngGXtNFQlDaF56miP1gReD5P4COniPy5c5A1ibZkY"});
				}, 

			"fnCreatedRow" : function(nRow, aData, iDataIndex) {

				// }
			$('#example tbody td ').attr("id", OTable.fnGetData().length);
			},
			"rowCallback" : function(row, data) {

			},
			"columns" : [{
			"aTargets" : [0],
			"mData" : "id",
			"mRender" : function(data, type, val) {

				console.log(data);
				var z = val.id;
				console.log(z);

			if (!val.id) {
				val.id = "0";
			}
			if (z.length > 6) {
				orgid = val.id;
				z = z.substr(0, 6) + "...";

				return z;
			}
			if (z.length <= 6) {
				//  return (type === "display" || type === "filter") ? z + "%" : "None";  //add % sign to value
			//	z = z.substr(0, 6) + "...";
				return z;
			}

			}
			}, {
			"aTargets" : [1],
			"mData" : "term",
			"mRender" : function(data, type, val) {
				var y = val.term;
				console.log(y);

			if (!val.term) {
					val.term = " ";
				}
			if ( y.length < 30 ) {
				orgterm = val.term;
				//y = y.substr(0, 30) + "...";

				return y;
			}
			if (y.length >= 30) {
				//  return (type === "display" || type === "filter") ? z + "%" : "None";  //add % sign to value
				y = y.substr(0, 30) + "...";
				return y;
			}

			}
			}, {
			"data" : "db",
			"width" : "20%"
			}]
			});/**.columnFilter({
			            aoColumns: [ 
			                     { type: "text" },
			                     { type: "text" },
			                     { type: "text" } ,
			                      values: function(aoData, oSettings){
			                            var keys = new Array();
			                            var values = new Array()
			                            for(i=0; i < aoData.length; i++){
			                                var item = aoData[i]._aData[3];
			                                if(keys[item]==null){
			                                    keys[item] = true;
			                                    //values.push(item);
			                                    values.push({ value: item, label: 'The ' + item});
			                                }
			                            } 
			                            return values;
			                        }
			                    }
			                        
			                ]**/
			    
			 // )};
			//OTable.columns.adjust().draw();
				/**************************************************************************/
				//OTable.dataTables_filter input{width:400px};

			$('.dataTables_filter input').attr("placeholder", "Search for standard terms"); //placeholder for search in datatables
			$('.dataTables_filter input').keydown(function(e){

				e.stopPropagation();
			
			});

			$(document).on("contextmenu", "#example tbody ", function(e) {
			return false;
			});
			$(document).on("contextmenu", "#example tbody td ", function(e) {

			var copieddata;

		//var clip = new ZeroClipboard();

			$.contextMenu({
			selector : '#example tbody td',
			callback : function(key, options) {
			var m = "clicked: " + key;
			//  var clip = new ZeroClipboard.Client(key);
			if (key == "Copy") {
				//   var clip = new ZeroClipboard.Client();
			console.log("I am here, " + this);
			$(this).attr("id", parid);
			console.log("Parent Id: " + parid);
			console.log(this[0].parentNode.id);
			var actualcopying = this[0].parentNode.id;
			console.log(OTable.fnGetData()[actualcopying - 1]);

			console.log(this[0].innerHTML.length);
			console.log(this[0].innerHTML);
			if (this[0].innerHTML.length > 8) {
			newterm_data = OTable.fnGetData()[actualcopying - 1].term;
			console.log(newterm_data);
			$('#term_input').val(newterm_data);
				}
			console.log(OTable.fnGetData()[actualcopying - 1]);
			console.log(this[0].innerHTML);
			if (this[0].innerHTML.length <= 6) {
			console.log("abcdefg");
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
			if (OTable.fnGetData()[actualcopying - 1].db == 'mesh') {

			$('#mesh_input').val(OTable.fnGetData()[actualcopying - 1].id);
			}
			if (OTable.fnGetData()[actualcopying - 1].db == 'LOINC') {

			$('#loinc_input').val(OTable.fnGetData()[actualcopying - 1].id);
			}

			}
			}/* end of Copy */

			if (key == "paste") {
			if (newcut == 1) {
				//dialog.dialog( "open" );
				console.log("pasting");
				// showingnode();
			} else {
			console.log(this);
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
			});
			/* End of Context Menu */


		});
			initializeTypeAhead();
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
		//	$('#newbtn-slidepanel').html("Close the Term Entry Panel");
			$('#newbtn-slidepanel').css('background','url("app/images/images-minus.png") no-repeat');
		//	$('#newbtn-slidepanel').css('background-position','-16px -128px');
			//$('#newbtn-slidepanel').css('font-family','Glyphicons Halflings');
			//$('#newbtn-slidepanel').css('content','\e082');
			$('#newbtn-slidepanel').css('background-size','100%');
			$("#adding-more").css('z-index', '2147483647');
			$("#adding-more").css('left', '998');
			// $.fn.openMbExtruder();
		}

			if (newverifycounter == 0 || actualcounter == 2) {

			//	$('#newbtn-slidepanel').html("Open the Term Entry Panel");
				$('#newbtn-slidepanel').css('background','url("app/images/plus-1.png") no-repeat');
	               
		  	 $('#extruderLeft div.flap').css('background','url("app/images/leftarrowimages.jpg") no-repeat');
        	 $('#extruderLeft div.flap').css('background-size','60%');
       //  $('#newbtn-slidepanel').css('font-family','Glyphicons Halflings');
		 //$('#newbtn-slidepanel').css('content','\e081');
      //   $('#extruderLeft div.flap').css('color','white');
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

			//     $("#adding-more").css("position","absolute");
			$("#adding-more").css('z-index', '2147483647');
			$("#adding-more").css('left', '498');
	        $('#extruderLeft div.flap').css('background','url("app/images/leftarrowimages.jpg") no-repeat');
	        $('#extruderLeft div.flap').css('background-size','60%');
	        $('#newbtn-slidepanel').css('background','url("app/images/plus-1.png") no-repeat');

	         //$('#newbtn-slidepanel').css('class','glyphicon glyphicon-plus');
	        //$('#newbtn-slidepanel').css('font-family','Glyphicons Halflings');
			//$('#newbtn-slidepanel').css('background','\e081');
	        $('#newbtn-slidepanel').css('background-size','100%');
	        $("#slider").show();
			prevcounter = prevcounter + 1;
			prevverifycounter = prevcounter % 2;
			console.log(prevcounter);
			console.log(prevverifycounter);
			if (newverifycounter == 1 || actualcounter == 1) {
			$("#extruderLeft  div.flap").css('left', '100%');
	           //  $("#slider").show();
			          // $("#slider").slideReveal("show");
			             

					}
			if (prevverifycounter == 0 || prevcounter == 2) {
			// $('#leftacrosspanel').show();
			//  $("#slider").show();
			//   $("#slider").slideReveal("show");
			//   $("div.flap").css('left','200%');
			$('#extruderLeft div.flap').css('background','url("app/images/rightarrowimages.jpg") no-repeat');
			$('#extruderLeft div.flap').css('background-size','60%');
			$("#adding-more").hide();
			//$('#newbtn-slidepanel').html("Open the Term Entry Panel");
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

				//     }

				$('input').keydown(function(e){
      e.stopPropagation();

				})

				 // Functionality when submit button pressed
        $('#termsSubmitBtn').click(function(){

        	//generateJSONTerms();
          
          console.log("it is in submit");
          // Get the final string to save
          var jsonString = $("#final_saving_term").text();
           console.log(jsonString);
           var termInput = $('#term_input').val();
           console.log(termInput);
          $.ajax({
              type: 'POST',
              url: 'datatermstosave',
              data:jsonString,
              contentType: "application/json; charset=utf-8",
              dataType: 'json',
              async: true,
              beforeSend: function(xhr){xhr.setRequestHeader('token', '--------------------------------');},
              success: function(data){
                $.each(data, function(index, value) {
                  //alert(index);

                  // This indicates the success status
                  // The record successfully saved
                  // Processing the json {"status": "true"}

                  if (data[index] == true) {
                      // alert(data[index]);
                      $("#termentersuccessalert").fadeIn("slow");

                      // Call refresh button to reset fields after successful insert
                      $("#termsRefreshBtn").trigger("click");

                      
                  }
              });
            }
          });
          //console.log(datatermstosave);
      });

			 function generateJSONTermsforedit(){
       
        var term_input = document.getElementById('term_input_edit').value;
        var loinc_input_edit = document.getElementById('loinc_input_edit').value;
        var icd_input_edit = document.getElementById('icd_input_edit').value;
        var snomed_input_edit = document.getElementById('snomed_input_edit').value;
        var rxnorm_input_edit = document.getElementById('rxnorm_input_edit').value;
        var mesh_input_edit = document.getElementById('mesh_input_edit').value;
        var synonyms_input = document.getElementById('synonyms_input_edit').value;

      //  console.log(loinc_input);
        // Get the values of categories selected

        /*var unknowncheckbox = document.getElementById('unknowncheckbox').checked;
        var geneticscheckbox = document.getElementById('geneticscheckbox').checked;
        var physiologycheckbox = document.getElementById('physiologycheckbox').checked;
        var patientcheckbox = document.getElementById('patientcheckbox').checked;
        var systemcheckbox = document.getElementById('systemcheckbox').checked;
        var environmentcheckbox = document.getElementById('environmentcheckbox').checked;*/

        // alert(term_input);

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
          /*category:[
                      {'unclassified': unknowncheckbox},
                      {'genetics' : geneticscheckbox},
                      {'physiology' : physiologycheckbox},
                      {'patient' : patientcheckbox },
                      {'system' : systemcheckbox},
                      {'environment' : environmentcheckbox}
                    ],*/
        synonyms: synonymsArray
        };

        jsonString = JSON.stringify(myObj);

        $("#final_saving_term_edit").text(jsonString); 
        }


function OnTermInputedit(event) {
        var searchstring = event.target.value.trim();
        var searchstringlength = searchstring.length;
        var term_input_data = document.getElementById('term_input_edit').value;
        var termlength = term_input_data.length;



      if (termlength > 0) {
          // alert('insider');
      $("#term_input_validate").fadeOut("slow");
      $("#termentersuccessalert").fadeOut("slow");

     generateJSONTermsforedit();

      }
      else {
      $("#term_input_validate").fadeIn("slow");

        }
        searchstring = "";
      }

      // Functionality when update button pressed
        $('#termsUpdateBtn_edit').click(function(){

        	//generateJSONTerms();
          
          console.log("it is in submit");
          // Get the final string to save
          var jsonString = $("#final_saving_term_edit").text();
           console.log(jsonString);
           var termInput = $('#term_input_edit').val();
           console.log(termInput);
          $.ajax({
              type: 'POST',
              url: 'datatermstoedit',
              data:jsonString,
              contentType: "application/json; charset=utf-8",
              dataType: 'json',
              async: true,
              beforeSend: function(xhr){xhr.setRequestHeader('token', '--------------------------------');},
              success: function(data){
                $.each(data, function(index, value) {
                  //alert(index);

                  // This indicates the success status
                  // The record successfully saved
                  // Processing the json {"status": "true"}

                  if (data[index] == true) {
                      // alert(data[index]);
                      $("#termentersuccessalert").fadeIn("slow");

                      // Call refresh button to reset fields after successful insert
                      $("#termsRefreshBtn_edit").trigger("click");

                      
                  }
              });
            }
          });
          //console.log(datatermstosave);
      });


        // Functionality when Delete button pressed
        $('#termsRefreshBtn_edit').click(function(){
          console.log('it is in delete');
          // Get the final string to save
          var jsonString = $("#final_saving_term_edit").text();
          alert(jsonString);
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
                  //alert(index);

                  // This indicates the success status
                  // The record successfully saved
                  // Processing the json {"status": "true"}

                  if (data[index] == true) {
                      // alert(data[index]);
                      $("#termentersuccessalert").fadeOut("slow");
                      $("#termdeletesuccessalert").fadeIn("slow");

                      // Call refresh button to reset fields after successful insert
                      $("#termsRefreshBtn_edit").trigger("click");
                      
                  }
                });
              }
            });

            // After successful delete reinitialize the typeahead so the deleted term 
            // is not in the searchable list
            initializeTypeAhead();

          }

        });

			   // Functionality when submit button pressed
       /** $('#termsSubmitBtn').click(function(){
          
          // Get the final string to save
          var jsonString = $("#final_saving_term_edit").text();

          $.ajax({
              type: 'POST',
              url: 'datatermstosave',
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

                  if (data[index] == true) {
                      // alert(data[index]);
                      $("#termentersuccessalert").fadeIn("slow");

                      // Call refresh button to reset fields after successful insert
                      $("#termsRefreshBtn").trigger("click");

                      
                  }
              });
            }
          });

          // After successful insert reinitialize the typeahead so the later term is searchable
          initializeTypeAhead();
          // alert("testing");

        });**/