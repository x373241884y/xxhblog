//MySQL [wp_blog2]> desc wp_term_relationships;
//+------------------+---------------------+------+-----+---------+-------+
//| Field            | Type                | Null | Key | Default | Extra |
//+------------------+---------------------+------+-----+---------+-------+
//| object_id        | bigint(20) unsigned | NO   | PRI | 0       |       |
//| term_taxonomy_id | bigint(20) unsigned | NO   | PRI | 0       |       |
//| term_order       | int(11)             | NO   |     | 0       |       |
//+------------------+---------------------+------+-----+---------+-------+

"use strict";
module.exports = function (sequelize, DataTypes) {
	var TermRelationShip = sequelize.define("TermRelationShip",
		{
			object_id: {type: DataTypes.BIGINT(20), defaultValue: 0, primaryKey: true},
			term_id: {type: DataTypes.BIGINT(20), defaultValue: 0, primaryKey: true},
			term_order: {type: DataTypes.INTEGER(11), defaultValue: 0}
		},
		{
			tableName: "term_relationship",
			timestamps:false,
			classMethods:{
				associate:function(models) {
					TermRelationShip.belongsTo(models.TermTaxonomy);
				}
			}
		});

	return TermRelationShip;
};