var filter = {
	selects: [ // 'id' should match the attribute of the same name in the markup and 'key' specifies the key portion of the key/value pair in the query string
		{ id: "restrict_month", key: "month" },
		{ id: "restrict_year", key: "year" },
		{ id: "issues-list", key: "rid" },
		{ id: "sponsored", key: "sponsored"},
		{ id: "session_select", key: "c" },
		{ id: "inline-search-congress", key: "c" }, // these apparently exist as an alternate to session_select
		{ id: "county-restrict", key: "county" },
		{ id: "region-restrict", key: "region" },
		{ id: "type-restrict", key: "type" },
		{ id: "member-restrict", key: "member" },
		{ id: "maxrows", key: "maxrows" },
		{ id: "mode", key: "mode" },
		{ id: "files-select", key: "type" },
		{ id: "section", key: "section" },
		{ id: "keyword", key: "keyword" }
	],

	query: null,
	sortcol: null,
	sortdir: null,
	sort: null,
	sourcepage:null, //added this so we can check if the parent window already has a query string.
	/* checks to see if a value exists or is 0 */
	exists: function(obj) {
		return !!(obj || obj === 0);
	},

	/* utility function to get query parameters */
	getparam: function(param) {
		var value = null;
		if (this.exists(window.location.search)) {
			var params = {};
			var query = window.location.search.substr(1, window.location.search.length); // strip out the '?'
			var query_array = query.split("&");
			for (var x = 0; x < query_array.length; x++) {
				var temp = query_array[x].split("=");
				params[temp[0]] = temp[1];
			}
			if (this.exists(params[param])) { value = params[param]; }
		}
		return value;
	},

	clean: function(val) { // strips out potential xss reflection stuff
		val = val.replace(/<[^>]*?>/g, ''); // strip markup
		val = val.replace(/[<>'"\/\\()]+/g, ''); // markup fragments, quotes, slashes, parens

		return val;
	},

	evaluate: function(member) {
		var select = document.getElementById(member.id);
		var val = "";

		if (this.exists(select)) {
			if (typeof(select) == "select") {
				val = select.options[select.options.selectedIndex].value;
			} else { // input type='text', textarea, whatevs!
				val = select.value;
			}

			if (val != "" && val != 0) { this.query.push({ "key": member.key, "val": this.clean(val) }); }
		}
	},

	construct_query: function() {
		
		var q = "";
		var sourceHasQuery = this.sourcepage.indexOf("?");
		
		for (var x = 0; x < this.query.length; x++) {
			(q == "") && sourceHasQuery == -1 ? q += "?" : q += "&";
			q += this.query[x].key + "=" + encodeURIComponent(this.query[x].val);
		}

		if (this.exists(this.sortcol) && this.exists(this.sortdir)) {
			(q == "") ? q += "?" : q += "&";
			q += "sort=" + encodeURIComponent(this.sortcol) + "&order=" + encodeURIComponent(this.sortdir);
		}

		return q;
	},

	run: function(page) {
		this.query = [];
		this.sourcepage = page;

		for (var x = 0; x < this.selects.length; x++) {
			this.evaluate(this.selects[x]);
		}

		if (this.exists(page) && page != "") {
			window.location.href = document.location.origin + "/" + page + this.construct_query();
		} else {
			window.location.href = document.location.origin + "/" +  document.location.pathname + this.construct_query();
		}

	
		//alert(window.location.href = "http://democrats.dev:8080" + page + this.construct_query());
	}
};
