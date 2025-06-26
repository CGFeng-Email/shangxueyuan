function checkPhone(mobile) {
	let regExp = /^[1][3,4,5,7,8][0-9]{9}$/;
	if (mobile.length == 11) { //手机号码
		if (regExp.test(mobile)) {
			return true
		}
	}
	return false
}

// 价格后面补12.00操作
function PriceZero(price) {
	var num = parseFloat((price).toFixed(10));
	var s = num.toString();
	var rs = s.indexOf('.');

	// 没有小数点时：
	if (rs < 0) {
		rs = s.length;
		s += '.';
	}
	while (s.length <= rs + 2) {
		s += '0';
	}
	return s
}

// 个位数不足0前面补0
function padStartfn(num) {
	return num.toString().padStart(2, 0)
}

// 时间戳，毫秒
function dateFormat(dateParams) {
	// 根据时间戳得到日期
	const date = new Date(dateParams);
	// 年 y
	const y = date.getFullYear();
	// 月 m 使用patstart方法补足指定字符 前面的值必须是字符串
	const m = (JSON.stringify(date.getMonth() + 1)).padStart(2, '0')
	// 日 d
	const d = JSON.stringify(date.getDate()).padStart(2, '0');
	// 时 hh
	const hh = JSON.stringify(date.getHours()).padStart(2, '0');
	// 分 mm
	const mm = JSON.stringify(date.getMinutes()).padStart(2, '0')
	// 秒 ss
	const ss = JSON.stringify(date.getSeconds()).padStart(2, '0')
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

// 时间戳，秒数
function secondsFormat(dateParams) {
	// 根据时间戳得到日期
	const date = new Date(dateParams * 1000);
	// 年 y
	const y = date.getFullYear();
	// 月 m 使用patstart方法补足指定字符 前面的值必须是字符串
	const m = (JSON.stringify(date.getMonth() + 1)).padStart(2, '0')
	// 日 d
	const d = JSON.stringify(date.getDate()).padStart(2, '0');
	// 时 hh
	const hh = JSON.stringify(date.getHours()).padStart(2, '0');
	// 分 mm
	const mm = JSON.stringify(date.getMinutes()).padStart(2, '0')
	// 秒 ss
	const ss = JSON.stringify(date.getSeconds()).padStart(2, '0')
	return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

}

// 时间戳，秒数，但要日期不用时分秒
function dateFormat2(dateParams) {
	// 根据时间戳得到日期
	const date = new Date(dateParams * 1000);
	// 年 y
	const y = date.getFullYear();
	// 月 m 使用patstart方法补足指定字符 前面的值必须是字符串
	const m = (JSON.stringify(date.getMonth() + 1)).padStart(2, '0')
	// 日 d
	const d = JSON.stringify(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`

}

// 秒数转化成分钟
function minutesFormat(dateParams) {
	return Math.floor(dateParams / 60) + '分钟'
}



export {
	checkPhone,
	PriceZero,
	padStartfn,
	dateFormat,
	dateFormat2,
	secondsFormat,
	minutesFormat
}