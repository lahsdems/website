/**
    NOTE: not sure what happened here, but judging from the variable names, looks like this is an prettified version of the minified /scripts/Issues_Lookup_Controller.js script.

    Instead of using this version, please edit /scripts/src/Issues_Lookup_Controller.js  if you need to make any changes and compile out to /scripts/Issues_Lookup_Controller.js
*/
var Issues_Lookup_Controller = new Class({
    options: {
        id: null,
        webroot: null,
        datasource: null,
        results_page: null,
        container: "search-issues-container",
        results_container: "search-issues-results",
        issues_site_path: "issue_list_page",
        issues_page_section: "related_issue_list",
        tag_site_path: "tag_list_page",
        tag_page_section: "related_tag_list",
        exclude_subtype: "issues_subpage",
        image_key: "list",
        tag_limit: 5,
        field: "search-field",
        field_value: "Search",
        direct_query: null,
        clear_btn: "clear-issues-search",
        keyup_delay: 250,
        min_term_length: 4,
        print_summary: true,
        filter_subtypes: false,
        enable_friendly_urls: true,
        filter: ["about", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "along", "already", "also", "although", "always", "among", "amongst", "amoungst", "and", "another", "any", "anyhow", "anyone", "anything", "anyway", "anywhere", "are", "around", "back", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom", "but", "can", "cannot", "cant", "could", "couldnt", "describe", "detail", "does", "done", "down", "due", "during", "each", "either", "else", "elsewhere", "empty", "enough", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "find", "first", "five", "for", "former", "formerly", "forty", "found", "from", "front", "full", "further", "get", "give", "had", "has", "hasnt", "have", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "indeed", "interest", "into", "its", "itself", "keep", "last", "least", "less", "many", "may", "meanwhile", "might", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "myself", "name", "namely", "need", "neither", "never", "nevertheless", "next", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "off", "often", "once", "one", "only", "onto", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own", "per", "perhaps", "please", "put", "rather", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "take", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "this", "those", "though", "through", "throughout", "thru", "thus", "together", "too", "toward", "towards", "under", "until", "upon", "very", "via", "was", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves"],
        print_no_results_text: true,
        no_results_text: "We&rsquo;re sorry, we couldn't find your request for <em>%query</em>. <a href='/search/?q=%query'>Expand your search to my entire website for <em>%query</em>. Search&nbsp;&raquo;</a>",
        path_to_tags_page: "issues/tag"
    },
    initialize: function(b) {
        this.setOptions(b);
        this.datasource = this.options.webroot + this.options.datasource;
        this.container = document.id(this.options.container);
        this.results_container = document.id(this.options.results_container);
        var a = this;
        this.field = document.id(this.options.field);
        this.field.value = this.options.field_value;
        this.field.addEvent("focus", function() {
            if (this.value == a.options.field_value) {
                this.value = "";
            }
        });
        this.clear = document.id(this.options.clear_btn);
        this.clear.addEvent("click", function() {
            a.field.value = "";
            a.do_search();
        });
        this.search_terms = null;
        this.issues = [];
        this.get_issues();
    },
    get_issues: function() {
        var c = this.got_issues.bind(this);
        var a = "method=getRelatedExcludeSubIssues&issues_site_path=" + encodeURIComponent(this.options.issues_site_path) + "&exclude_subtype=" + encodeURIComponent(this.options.exclude_subtype) + "&image_key=" + encodeURIComponent(this.options.image_key);
        var b = new Request({
            url: this.datasource,
            data: a,
            onSuccess: c
        }).send();
    },
    got_issues: function(d) {
        var c = JSON.decode(d);
        for (var a = 0; a < c.ROWCOUNT; a++) {
            this.issues.push({
                uid: c.DATA.UID[a],
                title: c.DATA.TITLE[a],
                summary: c.DATA.SUMMARY[a],
                friendly_url: c.DATA.FRIENDLY_URL[a],
                type: c.DATA.TYPE[a],
                subtype: c.DATA.SUBTYPE[a],
                site_path: c.DATA.SITE_PATH[a],
                total: c.DATA.TOTAL[a],
                image_path: c.DATA.IMAGE_PATH[a],
                search: {
                    title: ($chk(c.DATA.TITLE[a])) ? c.DATA.TITLE[a].toLowerCase() : "",
                    summary: ($chk(c.DATA.SUMMARY[a])) ? c.DATA.SUMMARY[a].toLowerCase() : "",
                    tags: (typeof c.DATA.TAGS[a] != "undefined" && c.DATA.TAGS[a]) ? c.DATA.TAGS[a].toLowerCase() : ""
                }
            });
        }
        var b = this;
        this.field.addEvent("keyup", function(f) {
            f.stop();
            if (f.key == "tab") {
                this.value = "";
            } else {
                if ($defined(this.timer)) {
                    $clear(this.timer);
                }
                this.timer = (function() {
                    b.do_search();
                }).delay(b.options.keyup_delay);
            }
        });
        this.container.removeClass("loading");
        this.direct_query = this.options.direct_query;
        if ($chk(this.direct_query) && this.direct_query != "") {
            b.field.value = this.direct_query;
            b.do_search();
        }
    },
    do_search: function() {
        if (this.field.value != "") {
            var d = this;
            this.clear.setStyle("display", "block");
            this.search_terms = this.field.value.toLowerCase().trim().replace(/[\u0021-\u002f\u003a-\u0040\u005b-\u005e\u0060\u007b-\u007e]/gi, "").clean().split(" ").filter(function(l, k) {
                var j = true;
                if (l.length < d.options.min_term_length) {
                    j = false;
                } else {
                    if (d.options.filter.contains(l)) {
                        j = false;
                    }
                }
                return j;
            });
            var e = [];
            for (var i = 0; i < this.issues.length; i++) {
                for (var h = 0; h < this.search_terms.length; h++) {
                    if (this.issues[i].search.title.indexOf(this.search_terms[h]) !== -1 || this.issues[i].search.summary.indexOf(this.search_terms[h]) !== -1 || (this.issues[i].search.tags && this.issues[i].search.tags.indexOf(this.search_terms[h]) !== -1)) {
                        e.push(this.issues[i]);
                        break;
                    }
                }
            }
            if (e.length > 0) {
                this.results_container.innerHTML = "";
                var c = new Element("div", {
                    "class": "clear"
                });
                var f = new Element("div", {
                    id: "search-issues-results-top"
                }).inject(d.results_container);
                $each(e, function(k) {
                    if (k.type == "issue" && (d.options.filter_subtypes == false || (d.options.filter_subtypes == true && ((k.subtype == "issue" && k.site_path != d.options.issues_site_path) || k.subtype == "hot_topic")))) {
                        finalURL = application.webroot + k.friendly_url;
                        var j = new Element("div", {
                            "class": "result"
                        }).inject(d.results_container);
                        if (k.image_path != null && k.image_path != "") {
                            var o = new Element("a", {
                                href: finalURL,
                                html: "<img src='" + d.options.webroot + k.image_path + "' alt='' />"
                            }).inject(j);
                        }
                        var q = new Element("div", {
                            "class": "result-text"
                        }).inject(j);
                        var p = new Element("h3", {
                            html: "<a href='" + finalURL + "'>" + k.title + "</a>"
                        }).inject(q);
                        if (d.options.print_summary) {
                            var l = new Element("p", {
                                html: "<a href='" + finalURL + "'>" + k.summary.slice(0, 320) + "</a>"
                            }).inject(q);
                        }
                        var n = new Element("div", {
                            "class": "clear"
                        }).inject(j);

                    }
                });
                var a = 0;
                e.sort(function(k, j) {
                    return j.total - k.total;
                });
                $each(e, function(m) {
                    if (m.type == "tag" && a <= d.options.tag_limit) {
                        finalURL = d.options.path_to_tags_page + "?tag=" + encodeURIComponent(m.title);
                        var k = new Element("div", {
                            "class": "result tag"
                        }).inject(d.results_container);
                        var j = new Element("div", {
                            "class": "result-tag"
                        }).inject(k);
                        var p = new Element("div").inject(j);
                        var n = new Element("h3").inject(p);
                        var l = new Element("a", {
                            href: finalURL,
                            html: m.title + " (" + m.total + ")"
                        }).inject(n);
                        var o = new Element("div", {
                            html: m.summary.slice(0, 320)
                        }).inject(j);
                        var q = new Element("div", {
                            "class": "clear"
                        }).inject(k);
                        a++;
                    }
                });
                var b = new Element("div", {
                    id: "search-issues-results-bottom"
                }).inject(d.results_container);
            } else {
                if (this.field.value.length >= d.options.min_term_length && d.options.print_no_results_text) {
                    this.results_container.innerHTML = "";
                    var f = new Element("div", {
                        id: "search-issues-results-top"
                    }).inject(d.results_container);
                    var g = new Element("div", {
                    	'class': "result",
                        'html': "<p>" + this.options.no_results_text.replace(/\%query/gi, this.field.value) + "</p>"
                    }).inject(d.results_container);
                    var b = new Element("div", {
                        id: "search-issues-results-bottom"
                    }).inject(d.results_container);
                }
            }
        } else {
            this.results_container.innerHTML = "";
            this.clear.setStyle("display", "none");
        }
    }
});
Issues_Lookup_Controller.implement(new Options);
