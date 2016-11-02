var sqlhelp = require("../utils/sqlHelper");
var Q = require('q');
function PageModel(currentPage, pageSize, list, count) {
	// 页面参数
	this.currentPage = currentPage;
	this.pageSize = pageSize;
	// 数据库查询
	this.recordList = list;
	this.recordCount = count;

	// 计算其他的数据
	this.pageCount = parseInt((count - 1) / pageSize + 1);
	/**
	 * 总页数不多于10页， 则全部显示 总页数多于10页，则当显示附近10个页码 ×× 当前面页码不足4个，显示前10个页码 ××
	 * 当前面附近共10个页码，显示10个页码 ×× 当后面页码不足5个时，显示后10个页码
	 */
	if (this.pageCount <= pageSize) {
		this.beginPageIndex = 1;
		this.endPageIndex = this.pageCount;
	} else {
		this.beginPageIndex = currentPage - parseInt(pageSize / 2) - 1;
		this.endPageIndex = currentPage + parseInt(pageSize / 2);
		if (this.beginPageIndex < 1) {
			this.beginPageIndex = 1;
			this.endPageIndex = pageSize;
		}
		if (this.endPageIndex > this.pageCount) {
			this.endPageIndex = this.pageCount;
			this.beginPageIndex = this.pageCount - pageSize + 1;
		}
	}
}
function getPageBean(pageNum, pageSize, sql, parameters) {
	console.log("**********************分页查询开始************************");
	var pagemodel, queryCountSql, limitSql;
	limitSql = sql + " limit " + (pageNum - 1) * pageSize + "," + pageSize;
	queryCountSql = sql.toLowerCase().replace(/select.*from/, "select count(*) from");
	var defered = Q.defer();
	Q.all([sqlhelp.query(queryCountSql, parameters), sqlhelp.query(limitSql, parameters)])
		.spread(function (countResult, list) {
			console.log("**********************分页查询结束************************");
			pagemodel = new PageModel(pageNum, pageSize, list, countResult[0]["count(*)"]);
			defered.resolve(pagemodel);
		})
		.fail(function (err) {
			defered.reject(err);
		});

	return defered.promise;
}

exports.getPageModel = getPageBean;