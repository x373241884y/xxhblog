function formatDate(date, style) { //date format util
	var y = date.getFullYear();
	var M = "0" + (date.getMonth() + 1);
	M = M.substring(M.length - 2);
	var d = "0" + date.getDate();
	d = d.substring(d.length - 2);
	var h = "0" + date.getHours();
	h = h.substring(h.length - 2);
	var m = "0" + date.getMinutes();
	m = m.substring(m.length - 2);
	var s = "0" + date.getSeconds();
	s = s.substring(s.length - 2);
	return style.replace('yyyy', y).replace('MM', M).replace('dd', d).replace('HH', h).replace('mm', m).replace('ss', s);
}

function cutMaxTitle(str,length) {
	if(typeof str=="string") {
		if(str.length>length) {
			return str.substr(0, length)+"...";
		}else{
			return str;
		}
	}else{
		return str;
	}
}

exports.dateFormat = formatDate;

exports.cutMaxTitle = cutMaxTitle;