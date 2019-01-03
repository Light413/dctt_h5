//时间戳转换成时间格式方法
function dateFromTimestamp(time , isfull) {
	var date=new Date(parseInt(time));  
	var year=date.getFullYear(); 
	var mon = date.getMonth()+1; 
	var day = date.getDate(); 
	var hours = date.getHours(); 
	var minu = date.getMinutes(); 
	var sec = date.getSeconds(); 
	
	if(isfull){
		return year+'-'+_formatter(mon)+'-'+_formatter(day)+' '+_formatter(hours)+':'+_formatter(minu)+':'+_formatter(sec); 
	}
	
	return _formatter(hours)+':'+_formatter(minu); 
}

function _formatter(m){return m<10?'0'+m:m }

/**
 * 格式化时间的辅助类，将一个时间转换成x小时前、y天前等
 */
var dateUtils = {
		UNITS: {
			'年': 31557600000,
			'月': 2629800000,
			'天': 86400000,
			'小时': 3600000,
			'分钟': 60000,
			'秒': 1000
		},
		humanize: function(milliseconds) {
			var humanize = '';
			mui.each(this.UNITS, function(unit, value) {
				if(milliseconds >= value) {
					humanize = Math.floor(milliseconds / value) + unit + '前';
					return false;
				}
				return true;
			});
			return humanize || '刚刚';
		},
		format: function(dateStr) {
			var date = this.parse(dateStr)
			var diff = Date.now() - date.getTime();
			if(diff < this.UNITS['天']) {
				return this.humanize(diff);
			}

			var _format = function(number) {
				return(number < 10 ? ('0' + number) : number);
			};
			
			return date.getFullYear() + '-' + _format(date.getMonth() + 1) + '-' + _format(date.getDate());
			// return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' + _format(date.getHours()) + ':' + _format(date.getMinutes());
		},
		parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
			var a = str.split(/[^0-9]/);
			return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
		}
	};
		