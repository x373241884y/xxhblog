var User = require("../models/wp_users");
var Post = require("../models/wp_posts");
var Term = require("../models/wp_terms");
var Q = require('q');
/**
 * add user
 * @returns {Function}
 */
exports.index = function () {
	return {
		//url:/^\/(index|)\/?$/,
		url: "/",
		controller: function (req, res, next) {
			Q.all([Term.getAll(), Post.findArticleArchive(), Post.findNewestList()])
				.spread(function (termsList, articleArchList, postNewestList) {
					req.termsList = termsList;
					req.articleArchList = articleArchList;
					req.postNewestList = postNewestList;
					req.home = {
						type: "index",
						homeList: postNewestList
					};
					return res.render("index", {"title": "Express"});
				}).fail(function (err) {
				error('getAll error');
			});
			function error(msg) {
				res.render("index", {"title": "Express", error: msg});
			}
		}
	}
};
exports.indexArticle = function () {
	return {
		//url:/^\/(index|)\/?$/,
		url: /\d{4}\/\d{1,2}\/\d{1,2}\/(\d+)\/?$/,
		controller: function (req, res, next) {
			for (var key in req.params) {
				console.log("key:" + key + ",value:" + req.params[key]);
			}
			//var year = req.params[0];
			//var month = req.params[1];
			//var day = req.params[2];
			var slug = req.params[0];

			Q.all([Post.get(slug),
					Post.getPrev(slug),
					Post.getNext(slug),
					Term.getAll(),
					Post.findArticleArchive(),
					Post.findNewestList()])
				.spread(function (posts, prevPosts, nextPosts, termList, articleArchList, postNewestList) {
					req.previewPost = posts[0];
					if (prevPosts.length > 0) {
						req.prevPost = prevPosts[0];
					}
					if (nextPosts.length > 0) {
						req.nextPost = nextPosts[0];
					}
					req.termsList = termList;
					req.articleArchList = articleArchList;
					req.postNewestList = postNewestList;
					req.home = {
						type: "article"
					};
					return res.render("index", {"title": "Express"});
				})
				.fail(function (err) {
					error(JSON.stringify(err));
				});
			function error(msg) {
				res.render("index", {"title": "Express", error: msg});
			}
		}
	}
};
exports.indexArchive = function () {
	return {
		//url:/^\/(index|)\/?$/,
		url: /(\d{4})\/(\d{1,2})\/?$/,
		controller: function (req, res, next) {
			for (var key in req.params) {
				console.log("key:" + key + ",value:" + req.params[key]);
			}
			var year = req.params[0];
			var month = req.params[1];
			Q.all([Post.findByYearMonth({
					year: year,
					month: month
				}), Term.getAll(), Post.findArticleArchive(), Post.findNewestList()])
				.spread(function (list1, list2, list3, list4) {
					req.home = {
						type: "archive",
						year: year,
						month: month,
						homeList: list1
					};
					req.termsList = list2;
					req.articleArchList = list3;
					req.postNewestList = list4;
					res.render("index", {"title": "Express"});
				})
				.fail(function (err) {
					error(JSON.stringify(err));
				});

			function error(msg) {
				res.render("index", {"title": "Express", error: msg});
			}
		}
	}
};
exports.indexCategory = function () {
	return {
		//url:/^\/(index|)\/?$/,
		url: /\/category\/(\w[\w\d_]+)(\/(\w[\w\d_]+)\/?|\/?)?$/,
		controller: function (req, res, next) {
			//for(var key in req.params) {
			//	console.log("key:"+key+",value:"+req.params[key]);
			//}
			var pargs1 = req.params[0];
			var pargs2 = req.params[1];
			var pargs3 = req.params[2];
			if (pargs2) { //have children
				console.log(pargs1 + "->" + pargs3);
			} else {
				Q.all([Post.findByCategory(pargs1), Term.getAll(), Post.findArticleArchive(), Post.findNewestList()])
					.spread(function (list1, list2, list3, list4) {
						req.home = {
							type: "category",
							category: pargs1,
							homeList: list1
						};
						req.termsList = list2;
						req.articleArchList = list3;
						req.postNewestList = list4;
						res.render("index", {"title": "Express"});
					})
					.fail(function (err) {
						error(JSON.stringify(err));
					});
			}


			function error(msg) {
				res.render("index", {"title": "Express", error: msg});
			}
		}
	}
};