function doNode(node) {
	node.style.cursor = "pointer";
	var left = node.src.substring(0, node.src.indexOf(".png"));
	var right = node.src.substring(node.src.indexOf(".png"), node.src.length);
	
	var img = new Image();
	img.src = node.src;
	var rimg = new Image();
	rimg.src = left + "-over" + right;
	
	node.onmouseover = function() { node.src = rimg.src; }
	node.onmouseout = function() { node.src = img.src; }
}

function doRollovers() {
	var nodes = new Array();
	var elems = document.getElementsByTagName('*');
	var pattern = new RegExp("(^|\\s)rollover(\\s|$)");
	for (i = 0, j = 0; i < elems.length; i++) {
		if (pattern.test(elems[i].className)) {
			nodes[j] = elems[i];
			j++;
		}
	}

	for (var x = 0; x < nodes.length; x++) {
		doNode(nodes[x]);
	}
}

var locs = null;
function setFooterMouseOver(link) { link.onmouseover = function() { locs.className = link.id; } }

init = function() {
	if (document.all && document.getElementById) {
		var rslt = navigator.appVersion.match(/MSIE (\d+\.\d+)/, '');
		if (rslt != null && Number(rslt[1]) >= 5.5 && Number(rslt[1]) < 7) {
			nav_root = document.getElementById("nav");
			for (i = 0; i < nav_root.childNodes.length; i++) {
				node = nav_root.childNodes[i];
				if (node.id && node.id.indexOf("nav-") != -1) {
					node.onmouseover = function() { this.className = "over"; }
					node.onmouseout = function() { this.className = this.className.replace("over", ""); }
				}
			}
			
			var logo = document.getElementById("logo");
			var bg = logo.currentStyle.backgroundImage;
			var src = bg.substring(5,bg.length-2);
			logo.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "', sizingMethod='scale')";
			logo.style.backgroundImage = "url(" + application_webroot + "images/structure/spacer.gif)";
		}
	}
	
	locs = document.getElementById("locations");
	var links = document.getElementById("locations-list").getElementsByTagName("a");
	for (var x = 0; x < links.length; x++) { setFooterMouseOver(links[x]); }
	
	doRollovers();
}

//leaving the senate servers so we have to display this message:
function openWin(urlToOpen) {
	window.open(urlToOpen);	
}

//leaving the current site, but staying on senate servers.
function openSenateWin(urlToOpen) {
	window.open(urlToOpen);	
}

function address(which) {
	document.getElementById("addresses").className = "sel_" + which;
	document.getElementById("office-location").className = "sel_" + which;
}

function changeFontSize(inc)
{
	var p = document.getElementsByTagName('p');
	for(n=0; n<p.length; n++) {
	if(p[n].style.fontSize) {
		var size = parseInt(p[n].style.fontSize.replace("px", ""));
	} else {
		var size = 12;
	}
	p[n].style.fontSize = size+inc + 'px';
	}
		var td = document.getElementsByTagName('td');
	for(n=0; n<td.length; n++) {
		if(td[n].style.fontSize) {
			var size = parseInt(td[n].style.fontSize.replace("px", ""));
		} else {
			var size = 12;
		}
		td[n].style.fontSize = size+inc + 'px';
	}
} 