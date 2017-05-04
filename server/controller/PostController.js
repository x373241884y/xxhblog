var postService = require('../service').PostService;
/**
 * add user
 * @returns {Function}
 */
//管理接口
exports.doAjax = function () {
	return {
		"/admin/addPost.do": function (req, res, next) {
			var req_pargs = req.body;
			var post_title = req_pargs.post_title;
			var multipleCategory = req_pargs.multipleCategory;
			var multipleTag = req_pargs.multipleTag;
			var post_content = req_pargs.post_content;
			var relation = [];
			if (multipleCategory&&multipleCategory.length>0) {
				multipleCategory.forEach(function (temp) {
					relation.push({
						term_taxonomy_id: temp
					});
				});
				// relation.push.apply(relation,multipleCategory);
			}
			if (multipleTag&&multipleTag.length>0) {
				multipleTag.forEach(function (temp) {
					relation.push({
						term_taxonomy_id: temp
					});
				});
				// relation.push.apply(relation,multipleTag);
			}
			var user = req.session.user;
			postService.addPost({
				post_author: user.ID,
				post_title: post_title,
				post_content: post_content,
				post_date: new Date(),
				post_date_gmt: new Date(),
				termRelations: relation
			}).then(function (result) {
				res.json({
					success: "ok",
					loginStatus: "1"
				});
			}).caught(function (error) {
				res.errorProxy(error);
			});
		},
		"/admin/deletePost.do": function (req, res, next) {
			var req_pargs = req.body;
			var post_id = req_pargs.post_id;
			postService.removePost(post_id).then(function (result) {
				res.json({
					success: "ok",
					loginStatus: "1"
				});
			}).caught(function (error) {
				res.errorProxy(error);
			});
		},
		"/admin/updatePost.do": function (req, res, next) {
			var req_pargs = req.body;
			var post_id = req_pargs.post_id;
			var post_title = req_pargs.post_title;
			var term_taxonomy_id1 = req_pargs.term_id1;
			var term_taxonomy_id2 = req_pargs.term_id2;
			var post_content = req_pargs.post_content;
			var relation = [];
			if (term_taxonomy_id2) {
				relation.push({
					term_taxonomy_id: term_taxonomy_id2
				});
			}
			postService.updatePost({
				ID: post_id,
				post_title: post_title,
				post_content: post_content,
				Cttid: term_taxonomy_id1,
				tagsUpdate:relation
			}).then(function (result) {
				res.json({
					success: "ok",
					loginStatus: "1"
				});
			}).caught(function (error) {
				res.errorProxy(error);
			});
		},
		"/admin/getPost.do": function (req, res, next) {
			var req_pargs = req.body;
			var post_id = req_pargs.post_id;
			postService.getPost(post_id).then(function (post) {
				res.json(post);
			}).caught(function (error) {
				res.errorProxy(error);
			});
		},
		"/admin/postList.do": function (req, res, next) {
			var req_pargs = req.body;
			var offset = req_pargs.offset || 0;
			var limit = req_pargs.limit || 10;
			postService.pageModelOfPost(offset, limit).then(function (pageModel) {
				res.json(pageModel);
			}).caught(function (error) {
				res.errorProxy(error);
			});
		}
	};
};
