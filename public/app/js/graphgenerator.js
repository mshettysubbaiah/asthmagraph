			// }

			console.log(nodes);
			//console.log(nodes[nodex]);
			//console.log(nodex);
			//console.log(actualnode);
			var max_link = 10;
			var width = $(window).width(), height = $(window).height(), colors = d3.scale.category10();

			var newdownid, newdownnode;
			var startarrow1 = 'url(#start-arrow)', startarrow2 = ' ', endarrow1 = 'url(#end-arrow)', endarrow2 = ' ';
			;
			// init svg
			var outer = d3.select("#dummypanel").append("svg:svg").attr("width", width).attr("height", height).attr("pointer-events", "all").attr("id", "newcanvasid");

			var vis = outer.append('svg:g').on("mousemove", mousemove).on("mousedown", mousedown).on("mouseup", mouseup);

			// Added on [12/06/2014]
			var trans_deviation = [0, 0];
			var trans_scale = 1;

			vis.append('svg:rect').attr('width', width).attr('height', height).attr('fill', '#E2EFEF');

			var newcode = vis.select('svg g');
			var newcodeing = vis.selectAll('g');
			var newpan = vis.selectAll('svg g');
			// set up initial nodes and links
			//  - nodes are known by 'id', not by index in array.
			//  - reflexive edges are indicated on the node (as a bold black circle).
			//  - links are always source < target; edge directions are set by 'left' and 'right'.

			/**var nodes = [{
			id : 0,
			reflexive : false
			}, {
			id : 1,
			reflexive : true
			}, {
			id : 2,
			reflexive : false
			},
			//for ( i = 2 ; i < 4;i++ ){
			{
			id : newnodeids,
			reflexive : false
			}];
			d3.select('.node' + newnodeids).classed('disease1',true); **/
			//}];
			//for (x = 0; x <2 ; x++)
			/**{
			id : extension[0],
			reflexive : false
			}**/
			/**var  links = [{
			source : nodes[0],
			target : nodes[1],
			left : false,
			right : true,
			id:01,
			//	linkindex :1
			}, {
			source : nodes[1],
			target : nodes[2],
			left : false,
			right : true,
			id:12,
			//linkindex :2
			}],//{
			//source : nodes[2],
			//target : nodes[0],
			//	left : false,
			//	right : true,
			//id:20,
			//linkindex :3
			//}],
			lastlinkindex = 2;**/

			/**	$.get('data.txt',function(data){
			var newdata = data;
			var n = newdata;
			console.log(n);
			console.log(data.split(':')[1]);
			var newnodeids = data.substr(5,6);
			console.log(newnodeids);
			var nodes = [{
			id : newnodeids,
			reflexive : false
			}],
			});**/

			//var lastNodeId = 2;
			console.log(links);
			var mLinkNum = {};
			sortLinks();
			setLinkIndexAndNum();
			function sortLinks() {
			links.sort(function(a, b) {
				//console.log(a);
				//console.log(b);
				if (a.source.id > b.source.id) {
					//	console.log(a);
					//	console.log(b);
					return 1;
				} else if (a.source.id < b.source.id) {
					//	console.log(a);
					//	console.log(b);
					return -1;
				} else {
					if (a.target.id > b.target.id) {
						//  console.log(a);
						//	console.log(b);
						return 1;
					}
					if (a.target.id < b.target.id) {
						//  	console.log(a);
						//console.log(b);
						return -1;
					} else {
						//console.log(a);
						//console.log(b);
						return 0;
					}
				}
			});
			}

			function setLinkIndexAndNum() {
			for (var i = 0; i < links.length; i++) {
				if (i != 0 && links[i].source == links[i - 1].source && links[i].target == links[i - 1].target) {
					links[i].linkindex = links[i - 1].linkindex + 1;
					mLinkNum[links[i].source.id + "," + links[i].target.id] = links[i].linkindex;

				} else {
					links[i].linkindex = 0;
				}
				// save the total number of links between two nodes
				// if(mLinkNum[links[i].target.id + "," + links[i].source.id] !== undefined)
				// {
				// mLinkNum[links[i].target.id + "," + links[i].source.id] = links[i].linkindex;
				// }
				// else
				// {
				// mLinkNum[links[i].source.id + "," + links[i].target.id] = links[i].linkindex;
				// }
			}
			}

			// init force layout
			var force = d3.layout.force().size([width, height]).nodes(nodes)// initialize with a single node
			.links(links).linkDistance(15).charge(-300).chargeDistance(300).on("tick", tick);

			var drag = force.drag().on("dragstart", dragstart);

			function dragstart(d) {
			d3.select(this).classed("fixed", d.fixed = true);
			}

			function relpopup() {
			contextrelmenu();
			//	dialognew.dialog( "open" );
			d3.event.preventDefault();
			}


			vis.append('defs').append('marker').attr('id', 'end-arrow').attr('viewBox', '0 -5 10 10').attr('refX', 6).attr('markerWidth', 3).attr('markerHeight', 3).attr('orient', 'auto').append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', '#000');

			vis.append('defs').append('marker').attr('id', 'start-arrow').attr('viewBox', '0 -5 10 10').attr('refX', 4).attr('markerWidth', 3).attr('markerHeight', 3).attr('orient', 'auto').append('path').attr('d', 'M10,-5L0,0L10,5').attr('fill', '#000');

			// line displayed when dragging new nodes
			var drag_line = vis.append('path').attr('class', 'link dragline hidden').attr('d', 'M0,0L0,0');

			// handles to link and node element groups
			//var path = vis.append('g').selectAll('path'),
			//  circle = vis.append('g').selectAll('.node');

			var path = vis.append('svg:g').selectAll('path'), circle = vis.append('svg:g').selectAll('g');

			//mouse event vars

			var selected_node = null, selected_link = null, mousedown_link = null, mousedown_node = null, mouseup_node = null;

			function resetMouseVars() {
			mousedown_node = null;
			mouseup_node = null;
			mousedown_link = null;
			}


			d3.select(window).on('keydown', keydown).on('keyup', keyup);
			//
			restart();

			// Added by Ravi
			var bCtrl;
			var zoom = d3.behavior.zoom().on("zoom", rescale).scaleExtent([0.3, 10]);
			// You can set the limit(0.1-10) of zooming by commenting the previous line and uncommenting the following line
			//var zoom = d3.behavior.zoom().on("zoom", rescale).scaleExtent([0.1, 10]);

			outer.call(zoom);
			outer.on('dblclick.zoom', null);
			//focus on svg
			//vis.node().focus
			function mousedown() {
			//dialog.dialog("close");
			//dialognew.dialog("close");
			//  console.log("Inside mousedown");
			$("#slider").slideReveal("hide");
			$("#extruderLeft div.flap").css('left', '100%');
			$("#adding-more").css('left', '498');
			var newnodenew = mousedown_node;
			var newdownlink = mousedown_link;
			console.log(newdownlink);

			if (!mousedown_node && !mousedown_link && !bCtrl) {
				// allow panning if nothing is selected
				resetMouseVars();
				// var point = d3.mouse(this);
				//scale="1";

				//	outer.call(zoom);
				circle.on('zoom', null);
				console.log("Clicked away from the node");

			} else {
				console.log("STOP PROPAG");
				d3.event.stopPropagation();
			}
			}

			function mousemove() {
			if (!mousedown_node) {
				//return;
				// vis.call(d3.behavior.).on("zoom", rescale));
				//	onetransit = 0;
				$('.dummypanel').children('svg').css('background', '#E2EFEF');
				return;
			}

			drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);
			//sortLinks();
			//setLinkIndexAndNum();
			//restart();
			}

			function mouseup(d) {
			if (mousedown_node) {
				// hide drag line
				drag_line.classed('hidden', true).style('marker-end', '');

			}
			console.log(d3.event.x);
			bCtrl = false;
			resetMouseVars();
			}

			//Deletes all the links to other nodes when a node is deleted
			function spliceLinksForNode(node) {
			var toSplice = links.filter(function(l) {
				return (l.source === node || l.target === node);
			});
			toSplice.map(function(l) {
				links.splice(links.indexOf(l), 1);
			});
			}

			// only respond once per keydown
			var lastKeyDown = -1;

			function keydown() {
			d3.event.preventDefault();
			d3.event.stopPropagation();

			if (lastKeyDown !== -1)
				return;
			lastKeyDown = d3.event.keyCode;

			// ctrl
			if (d3.event.keyCode === 17) {
				circle.call(drag);
				vis.classed('ctrl', true);

			}
			//esc
			if (d3.event.keyCode === 27) {
				console.log("esc");
				dialog.dialog("close");
			}

			// When no node or link is selected then return
			if (!selected_node && !selected_link)
				return;

			//Functionality for each keydown
			switch(d3.event.keyCode) {
				case 8:
				// backspace
				case 46:
					// delete
				if (selected_node) {

					deletenode();

				} else if (selected_link) {
					if (selected_link.left == false)
						mLinkNum[selected_link.source.id + "," + selected_link.target.id] = mLinkNum[selected_link.source.id + "," + selected_link.target.id] - 1;
					else
						mLinkNum[selected_link.target.id + "," + selected_link.source.id] = mLinkNum[selected_link.target.id + "," + selected_link.source.id] - 1;

					links.splice(links.indexOf(selected_link), 1);
				}
				selected_link = null;
				selected_node = null;
				restart();
				break;
			case 66:
				// B
				if (selected_link) {
					// set link direction to both left and right
					selected_link.left = true;
					selected_link.right = true;
				}
				restart();
				break;
				case 76:
					// L
					if (selected_link) {
						// set link direction to left only
						selected_link.left = true;
						selected_link.right = false;
					}
					restart();
					break;
				case 82:
					// R
					if (selected_node) {
						// toggle node reflexivity
						selected_node.reflexive = !selected_node.reflexive;
					} else if (selected_link) {
						// set link direction to right only
						selected_link.left = false;
						selected_link.right = true;
					}
					restart();
					break;
			}
			}

			function keyup() {
			lastKeyDown = -1;

			// ctrl
			if (d3.event.keyCode === 17) {
				circle.on('mousedown.drag', null).on('touchstart.drag', null);
				vis.classed('ctrl', false);
			}
			}

			// rescale svg
			function rescale() {
			trans = d3.event.translate;
			//console.log(trans);
			newlocalcoord = trans;
			//console.log(newlocalcoord);
			//console.log(trans);
			scale = d3.event.scale;
			var presentscale;
			presentscale = scale;
			pj = [trans[0], trans[1], presentscale];

			// console.log(pj);
			//  console.log(trans);
			//console.log(newdraggingscale);
			//console.log(zoom.scale());

			if (zoom.scale() != "1") {
				console.log('it os there');
				$('.dummypanel').children('svg').css('background', '#E2EFEF');
			}

			if (newdragging == 1 && currentzoom == zoom.scale() && zoom.scale() > 0.3 && trans[0] == newpoint[0] && trans[1] == newpoint[1]) {

				console.log(d3.event.x);
				console.log(d3.event.y);
				vis.attr("transform", "translate(" + newpoint + ")" + " scale(" + newdraggingscale + ")");

				/**	else{
				 vis.attr("transform", "translate(" + trans + ")" + " scale(" + scale + ")");
				 }**/
			} else {
				/*	if(typeof newdraggingscale != "undefined" && onetransit == 1){
				 //	$('.dummypanel').one("click", function () {
				 var pi = [width/2, height/2, height];
				 console.log(pj);
				 var newpos = [width/2, height/2, pj[3]];
				 var laspos = [lastpos[0]+20,lastpos[1]+60,lastpos[3]];
				 vis.call(transition, pj, pi);
				 // vis.attr("transform", "translate(" + trans + ")" + " scale(" + scale + ")");
				 pi = pj;
				 //});
				 onetransit = 0;
				 //	var pi = [newpoint[0],newpoint[1],newdraggingscale];

				 // vis.call(transition, pi, pj);
				 // vis.attr("transform", "translate(" + trans + ")" + " scale(" + scale + ")");
				 //   pi = pj;
				 }*/
				vis.attr("transform", "translate(" + trans + ")" + " scale(" + scale + ")");
			}
			//newdragging = 0;
			}

			function dragmove(d) {
			var x = d3.event.x;
			var y = d3.event.y;
			vis.attr("transform", "translate(" + x + "," + y + ")");
			console.log("dragmove");
			console.log(x);
			console.log(y);
			}

			/********************************************/
			// update force layout (called automatically each iteration)
			function tick() {
			// draw directed edges with proper padding from node centers
			path.attr('d', function(d) {
				var deltaX = d.target.x - d.source.x, deltaY = d.target.y - d.source.y, dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY), normX = deltaX / dist, normY = deltaY / dist, sourcePadding = d.left ? 25 : 25, targetPadding = d.right ? 25 : 25, sourceX = d.source.x + (sourcePadding * normX), sourceY = d.source.y + (sourcePadding * normY), targetX = d.target.x - (targetPadding * normX), targetY = d.target.y - (targetPadding * normY);

				// sourceX = d.source.x ,
				// sourceY = d.source.y ,
				// targetX = d.target.x ,
				// targetY = d.target.y;

				if (d.linkindex == 0)// The first one should be a line
					return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;

				//var lTotalLinkNum = mLinkNum[d.source.id + "," + d.target.id] || mLinkNum[d.target.id + "," + d.source.id];
				var arc_ratio = 1 / (max_link / 2) / 2;
				var linkindex_no = ((d.linkindex + 1) / 2) | 0;
				var arc_length = dist * arc_ratio * (linkindex_no);
				// console.log("*********************LINKINDEX = " + d.linkindex);

				dist = ((dist / 2) * (dist / 2) + arc_length * arc_length) / (2 * arc_length);
				var arc_dir = d.linkindex % 2;
				//var lTotalLinkNum = mLinkNum[d.source.id + "," + d.target.id] || mLinkNum[d.target.id + "," + d.source.id];
				//console.log(lTotalLinkNum);
				//	if(lTotalLinkNum > 1)
				//{
				//   if there are multiple links between these two nodes, we need generate different dr for each path
				//    dist = dist/(1 + (1/lTotalLinkNum) * (d.linkindex - 1));
				//}
				//	return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
				//console.log("M" + d.source.x + "," + d.source.y + "A" + dist + "," + dist + " 0 0,1 " + d.target.x + "," + d.target.y);
				return "M" + sourceX + "," + sourceY + "A" + dist + "," + dist + " 0 0," + arc_dir + targetX + "," + targetY;

			});

			circle.attr('transform', function(d) {
				return 'translate(' + d.x + ',' + d.y + ')';
			});

			}

			/***************************************************/

			// update graph (called when needed)
			function restart() {

			// path (link) group
			path = path.data(links);

			// update existing links
			path.classed('selected', function(d) {
				return d === selected_link;
			}).style('marker-start', function(d) {
				return d.left ? 'url(#start-arrow)' : ' ';
			}).style('marker-end', function(d) {
				return d.right ? 'url(#end-arrow)' : ' ';
			});
			//.style('marker-end', function(d) {
			//return d.both ? 'url(#end-arrow)' : 'url(#end-arrow)';
			//});

			// add new links
			path.enter().append('svg:path').attr('class', 'link').classed('selected', function(d) {
				return d === selected_link;
			}).style('marker-start', function(d) {
				return d.left ? 'url(#start-arrow)' : ' ';
			}).style('marker-end', function(d) {
				return d.right ? 'url(#end-arrow)' : ' ';
			})
			//.style('marker-end', function(d) {
			//return d.both ? 'url(#end-arrow)' : 'url(#end-arrow)';
			//})

			//e.stopPropagation();

			.attr('id', function(d) {
				console.log("newpath id: --------------- " + d.id);
				return "newpaths" + d.id;
			}).on('contextmenu', relpopup).on('dblclick', relpopup).on('mousedown', function(d) {
				if (d3.event.ctrlKey)
					return;
				console.log(d);
				console.log(this);
				// select link
				mousedown_link = d;
				if (mousedown_link === selected_link)
					selected_link = null;
				else
					selected_link = mousedown_link;
				selected_node = null;

				validrel = $('#rel1').val();
				newpath = d3.select("#newpaths" + d.id);
				if (validrel != "") {

					newpath.style('stroke', 'black');
				} else {
					newpath.style('stroke', 'red');

				}
				restart();
			});

			//valuevalidation();
			// remove old links
			path.exit().remove();

			// circle (node) group
			// NB: the function arg is crucial here! nodes are known by id, not by index!
			circle = circle.data(nodes, function(d) {
				return d.id;
			});

			// update existing nodes (reflexive & selected visual states)
			//circle.selectAll('circle').style('fill', function(d) {
			// return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id);
			//return (d === selected_node) ? d3.rgb(255, 255, 255) : d3.rgb(255,255, 255);
			//	}
			//	})
			//circle.selectAll('circle').style('fill', function(d) {
			//return  (d === selected_node) ? "rgb(255,255,255)" : "rgb(255,255,255)";
			//})
			circle.selectAll('circle')

			//.classed('reflexive', function(d) {
			//	return d.reflexive;
			//})

			.classed("fixed", function(d) {
				d.fixed = true;
			});
			//  circlecolors();
			// add new nodes
			var g = circle.enter().append('svg:g');
			g.append('circle').attr('class', function(d) {
				return 'node' + d.id;
			}).attr('fixed', 'true').attr('id', 'newnodes').attr('onContextMenu', contextmenuedit)

			//  .attr('onkeydown', keydown)
			//  .attr('onkeyup', keyup)
			.attr('r', 28).classed('fixed', function(d) {
				return d.fixed = true;
			})
			//.style('fill',function(d){return (d === selected_node) ? "rgb(255,255,255)" : "rgb(255,255,255)";})
			.style('stroke', 'black').attr('stroke-width', '0.00005').style('fill', function(d) {
				return (d === selected_node) ? d3.rgb(255, 255, 255) : d3.rgb(255, 255, 255);
			})
			//.style('stroke', function(d) {
			//return d3.rgb(colors(d.id)).darker().toString();
			//})
			.classed('reflexive', function(d) {
				return d.reflexive;
			})
			//mouseover function for nodes
			.on('mouseover', function(d) {

				// set your attributes for halo effect and tool tip with details

				$('.node' + d.id).attr('stroke-width', '1.5');

				if (!mousedown_node || d === mousedown_node)
					return;
				// enlarge target node
				d3.select(this).attr('transform', 'scale(1.1)');

			})
			//mouseout functionality for nodes
			.on('mouseout', function(d) {
				$('.node' + d.id).attr('stroke-width', '0.00005');
				if (!mousedown_node || d === mousedown_node)
					return;
				// unenlarge target node
				d3.select(this).attr('transform', '');

			})
			//mousedown functionality for nodes
			.on('mousedown', function(d) {
				//  circle.call(drag)
				newtitle = "node" + d.id;
				console.log(d);
				console.log("Clicked on the node new one");
				g.style({
					opacity : '2.0'
				});
				if (d3.event.ctrlKey) {
					bCtrl = true;
					return;
				}
				bCtrl = false;
				d3.select(this).classed("fixed", d.fixed = true);
				// select node
				mousedown_node = d;
				if (mousedown_node === selected_node) {
					// newcode.on('mousedown.zoom',null);
					vis.on("touchstart.drag", null);
					console.log("Clickefahfuahofha");
					contextmenuedit();
					selected_node = null;
				} else
					selected_node = mousedown_node;
				newnodenew = mousedown_node;
				d3.select(this).classed("fixed", d.fixed = true);

				selected_link = null;

				// reposition drag line
				drag_line.style('marker-end', 'url(#end-arrow)').classed('hidden', false).attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);

				restart();
			})
			//dbl click for panning
			.on('dblclick', function(d) {

			})
			//mouseup function
			.on('mouseup', function(d) {
				if (!mousedown_node)
					return;

				// needed by FF
				drag_line.classed('hidden', true).style('marker-end', '');
				//	sortLinks();
				//setLinkIndexAndNum();

				g.attr('stroke-width', '');
				// check for drag-to-self
				mouseup_node = d;
				if (mouseup_node === mousedown_node) {
					resetMouseVars();
					return;
				}
				$('#sourcerel').html("Node" + mousedown_node.id);
				$('#destrel').html("Node" + mouseup_node.id);
				$('#newsourcerel').html("Node" + mousedown_node.id);
				$('#newdestrel').html("Node" + mouseup_node.id);
				//  dialognew.dialog( "open" );
				console.log(mousedown_node);

				console.log(mouseup_node);
				// unenlarge target node
				d3.select(this).attr('transform', '');

				// add link to graph (update if exists)
				// NB: links are strictly source < target; arrows separately specified by booleans
				var source, target, direction, id;
				if (mousedown_node.id < mouseup_node.id) {
					source = mousedown_node;
					target = mouseup_node;
					direction = 'right';
					id = "" + mousedown_node.id + mouseup_node.id;
					//linkindex = ++lastlinkindex;
				} else {
					source = mouseup_node;
					target = mousedown_node;
					direction = 'left';
					id = "" + mousedown_node.id + mouseup_node.id;
					//linkindex = ++lastlinkindex;
				}
				newdownid = id;
				var link;
				link = links.filter(function(l) {
				return (l.source === source && l.target === target);
				})[0];
				console.log("link ---- ");
				//sortLinks();
				//setLinkIndexAndNum();
				//		console.log(linkindex);
				if ( typeof mLinkNum[source.id + "," + target.id] === "undefined") {
					mLinkNum[source.id + "," + target.id] = 0;
				}
				id = id + mLinkNum[source.id + "," + target.id];
				link = {
					source : source,
					target : target,
					left : false,
					right : false,
					id : id,
				};
				link[direction] = true;
				if (mLinkNum[source.id + "," + target.id] == max_link)
					alert("Maximum limit reached!");
				else {
					links.push(link);
				}

				sortLinks();
				setLinkIndexAndNum();
				link.id = link.id.substring(0, 2) + mLinkNum[source.id + "," + target.id];
				console.log(link.id);

				console.log("LINKS : ------------------- ");
				console.log(links);
				console.log(" ------------------------- ");
				// select new link
				console.log(link);
				selected_link = link;
				newnodelink = link;
				selected_node = null;
				restart();
			});

			//circlecolors();

			// show node IDs
			g.append('svg:text').attr('x', -19).attr('y', 4).attr('class', function(d) {
				return 'newid' + d.id;
			}).text(function(d) {
				return "Node" + d.id;
			});

			// remove old nodes
			circle.exit().remove();

			// set the graph in motion
			force.start();
			}

			//});