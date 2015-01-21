       var newnodelink,
            newpath,
            validrel,
            newnode,
            validnode,
            newnodenew,
            nodepointx,
            nodepointy;
            var next = 1,
             relnext = 1,
            newcounter = 0,
            newcut = 0 ,
            dialognewnodeid,
             newlocalcoord,
             newdragging,
             newdraggingscale,
             currentzoom,
             newpointx,
             newpointy,
             newpoint,
             onetransit ,
             lookpos,
             currentpos,
             pj,
             lastpos,
             pasteid,
             totaldata = {},
             index = 0,
             term_data;
         
           
          $('.dummypanel').css({'height': $(window).innerHeight()});
     //  if(zoom.scale() != "1"){
       //         console.log('it os there');
                
         //       }
        	$(document).on("contextmenu", ".dummypanel", function(e) {
      				console.log(e.pageX);
      				//console.log(e.layerX);
      			var offset = $('rect').offset();
                       nodepointx = (e.pageX - offset.left)/zoom.scale();
                       nodepointy = (e.pageY - offset.top)/zoom.scale();
                     console.log(zoom.scale());
                     
                // Test by Ravi
                console.log("PageX, PageY");
                console.log(e.pageX);
                console.log(e.pageY);
                console.log("offset.left, offset.top");
                console.log(offset.left);
                console.log(offset.top);
        				e.preventDefault();
        				e.stopPropagation();
                $.contextMenu({
                	selector : '.dummypanel',
                	callback : function(key, options) {
                		var m = "clicked: " + key;
                	//	window.console && console.log(m) || alert(m);
                		if (key == "CreateNode") {
                               createnode();
                	//		dialog.dialog( "open" );
                		}
                		if (key == "paste") {
                                   if (newcut == 1){         
                              //dialog.dialog( "open" );
                              console.log("pasting");
                              showingnode();
                               }
                               else{
                                   console.log(this);
                               }
                          }
                	},
                	items : {
                	    "paste" : {
                              name : "Paste",
                              icon : "paste"
                          },
                		"CreateNode" : {
                			name : "CreateNode",
                			icon : "add"
                		},
                	}
                });

                });
           
        	   function getMousePos(canvas, evt) {
            var rect = $("#newcanvasid").getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }

          function clickposition(){
              
            $(window).on('click',function(e){
             var offset = $('circle').offset();
             nodepointx = e.pageX - offset.left,
             nodepointy = e.pageY - offset.top,
              //nodepointx = e.pageX;
             // nodepointy = e.pagey;
             
              console.log(e.pageX);
              console.log(e.pageY);
          });
          }