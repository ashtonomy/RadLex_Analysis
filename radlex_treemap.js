// radlex_treemap.js
//
// Creates a tree diagram from CSV file of the form
// id,parentId,url,definition
// 
// Adapted from: https://observablehq.com/@d3/collapsible-tree

d3.csv("radlex_hierarchy_w_links.csv", (links)=>{
	var child = links.columns[0];
	var parent = links.columns[1];
	stratify = d3.stratify()
		.id(d => d[child])
		.parentId(d => d[parent])
	var treeData = stratify(links);

	console.log(treeData);

	// Set the dimensions and margins of the diagram to window size
	var margin = {top: 20, right: 90, bottom: 30, left: 90},
		win = window,
		doc = document,
		ele = doc.documentElement,
		getE = doc.getElementsByTagName('body')[0],
		width = (win.innerWidth || ele.clientWidth || getE.clientWidth) - margin.left - margin.right,
		height = (win.innerHeight || ele.clientHeight|| getE.clientHeight) - margin.top - margin.bottom;
		//width = 960 - margin.left - margin.right,
		//height = 500 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	// appends a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.right + margin.left)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate("
			+ margin.left + "," + margin.top + ")");

	var div = d3.select("body").append("div")
		.attr("class", "tooltip")
		.attr("data-html", "true")
		.style("opacity", 0);

	var i = 0,
		duration = 750,
		root;

	// declares a tree layout and assigns the size
	var treemap = d3.tree().size([height, width]);

	// Assigns parent, children, height, depth
	root = d3.hierarchy(treeData, function(d) { return d.children; });
	root.x0 = height / 2;
	root.y0 = 0;

	// FIXME
	root.count();

	// Collapse after the second level
	root.children.forEach(collapse);

	update(root);

	// Track depth of deepest node open
	var currentDepth = 1;

	// Collapse the node and all it's children
	function collapse(d) {
		if(d.children) {
			d._children = d.children
			d._children.forEach(collapse)
			d.children = null
		}
	}

	function update(source) {

	// Assigns the x and y position for the nodes
	var treeData = treemap(root);

	// Compute the new tree layout.
	var nodes = treeData.descendants(),
		links = treeData.descendants().slice(1);

	// Normalize for fixed-depth.
	nodes.forEach(function(d){ d.y = d.depth * 180});

	// ****************** Nodes section ***************************

	// Update the nodes...
	var node = svg.selectAll('g.node')
		.data(nodes, function(d) {return d.id || (d.id = ++i); });

	// Enter any new modes at the parent's previous position.
	var nodeEnter = node.enter().append('g')
		.attr('class', 'node')
		.attr("transform", function(d) {
			return "translate(" + source.y0 + "," + source.x0 + ")";
		});

	// Add Circle for the nodes
	nodeEnter.append('circle')
		.attr('class', 'node')
		.attr('r', 1e-6)
		.style("fill", function(d) {
			return d._children ? "#1f988b" : "#440154";
		})
		.on('mouseover', function (d, i) {
			d3.select(this).transition()
				.duration('50')
				.style('fill', function(d) {
				return d._children ? "#b5de2b" : "#440154";
				});

			div.transition()
				.duration('50')
				.style("opacity", 1);
			
			let name = "<strong>" + d.data.id + "</strong><br />";
			let def = "<strong>Definition</strong>: " + (d.data.data.definition ? d.data.data.definition : "N/A") + "<br />";
			let desc = "<strong>Descendants</strong>: " + d.value.toString() + "<br />"; // Only leaf nodes
			let childs = "<strong>Children</strong>: " + (d.data.children ? d.data.children.length.toString() : "0") + "<br />";
			let lvl =  "<strong>Height</strong>: " + d.height.toString();
			let textOutput = name + def + desc + childs + lvl;

			div.html(textOutput)
				.style("left", (d3.event.pageX + 10) + "px")
				.style("top", (d3.event.pageY - 15) + "px");
		})
		.on('mouseout', function (d, i) {
			d3.select(this).transition()
				.duration('50')
				.style('fill', function(d) {
				return d._children ? "#1f988b" : "#440154";
				});

			div.transition()
				.duration('50')
				.style("opacity", 0);
		})
		.on('click', click);

	// Add labels for the nodes
	nodeEnter.append('text')
		.attr("dy", ".35em")
		.attr("x", function(d) {
			return -13;
			//return d.children || d._children ? -13 : 13;
		})
		.attr("text-anchor", function(d) {
			return "end";
			//return d.children || d._children ? "end" : "start";
		})
		.attr('cursor', 'pointer')
		.text(function(d) { return d.data.id; })
		.on('mouseover', function (d, i) {
			d3.select(this).transition()
				.duration('50')
				.style('font-weight', function(d,i) {
					return 700;
				})
				.style("font-size", "14px");
		})
		.on('mouseout', function (d, i) {
			d3.select(this).transition()
				.duration('50')
				.style('font-weight', function(d,i) {
					return 500;
				})
				.style("font-size", "12px");
		})
		.on("click", function(d) { 
			window.open(d.data.data.url, '_blank'); 
		});

	// UPDATE
	var nodeUpdate = nodeEnter.merge(node);

	// Transition to the proper position for the node
	nodeUpdate.transition()
		.duration(duration)
		.attr("transform", function(d) { 
			return "translate(" + d.y + "," + d.x + ")";
		});

	// Update the node attributes and style
	nodeUpdate.select('circle.node')
		.attr('r', 10)
		.style("fill", function(d) {
			return d._children ? "#1f988b" : "#440154";
		})
		.attr('cursor', function(d) {
			return d.children || d._children ? "pointer" : "default";
		});


	// Remove any exiting nodes
	var nodeExit = node.exit().transition()
		.duration(duration)
		.attr("transform", function(d) {
			return "translate(" + source.y + "," + source.x + ")";
		})
		.remove();

	// On exit reduce the node circles size to 0
	nodeExit.select('circle')
		.attr('r', 1e-6);

	// On exit reduce the opacity of text labels
	nodeExit.select('text')
		.style('fill-opacity', 1e-6);

	// ****************** links section ***************************

	// Update the links...
	var link = svg.selectAll('path.link')
		.data(links, function(d) { return d.id; });

	// Enter any new links at the parent's previous position.
	var linkEnter = link.enter().insert('path', "g")
		.attr("class", "link")
		.attr('d', function(d){
			var o = {x: source.x0, y: source.y0}
			return diagonal(o, o)
		});

	// UPDATE
	var linkUpdate = linkEnter.merge(link);

	// Transition back to the parent element position
	linkUpdate.transition()
		.duration(duration)
		.attr('d', function(d){ return diagonal(d, d.parent) });

	// Remove any exiting links
	var linkExit = link.exit().transition()
		.duration(duration)
		.attr('d', function(d) {
			var o = {x: source.x, y: source.y}
			return diagonal(o, o)
		})
		.remove();

	// Store the old positions for transition.
	nodes.forEach(function(d){
		d.x0 = d.x;
		d.y0 = d.y;
	});

	// Creates a curved (diagonal) path from parent to the child nodes
	function diagonal(s, d) {

		path = `M ${s.y} ${s.x}
				C ${(s.y + d.y) / 2} ${s.x},
				${(s.y + d.y) / 2} ${d.x},
				${d.y} ${d.x}`

		return path
	}

	// Toggle children on click.
	function click(d) {
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			d.children = d._children;
			d._children = null;
		}
		update(d);
	}
	}
});