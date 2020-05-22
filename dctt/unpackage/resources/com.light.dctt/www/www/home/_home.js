	var ztlist = new Vue({
		el: '#table-view-id',
		data: {
			items: []
		},
		methods:{
			avatar:function(item){
				var u_avatar = item['user']['avatar_thumb'];
				if(u_avatar == null || u_avatar == ''){
					u_avatar = "../../images/default_avatar.png";
				}
				return u_avatar;
			},
			postDate:function(item){
				var postDate = item['postDate'];
				return dateUtils.format(postDate);
			},
			itemType:function(item){
				var readCnt = item['readCnt'];
				var _type = titleForType[item['type']] ;
				if(_type == null){_type = '其他';}
				return _type;
			}
		}
		
	});
	
	mui.plusReady(function () {
		if(_isHome){
			topItem_v.items = homeTopItems;
		}
		
			
	// 	    plus.webview.currentWebview().setStyle({
	// titleNView:{
	// 'backgroundcolor': '#f7f7f7',
	// 'titletext': '郸城头条',
	// // 'titlecolor': '#dcdcdc',
	// 'titlecolor': 'white',
	// 'titlesize':'17px',
	// // tags:tags
	// }
	// });
	
		var wv = plus.webview.currentWebview();
		_listType = wv.typeId || 0;
		//加载历史数据
		var lastlistdataStr = localStorage.getItem('homelistlastloaddatafortype' + _listType);
		if(lastlistdataStr){
			var lastDataArr = JSON.parse(lastlistdataStr);
			ztlist.items = lastDataArr;
		}	

		{
			///请求参数0
			var pars = {
				"category":"sy" ,
				"subType":_listType 
			}
			var uid = getLoginUid();
			if(uid){
				pars['uid'] = uid;
			}
			
			ttRefreshInit('#list',get_sy_url , pars , function(res){
				//console.log(JSON.stringify(res[0]));
				var arr = res;
				_dataConvert(arr , true);
				plus.nativeUI.closeWaiting();
			},function(){
				plus.nativeUI.closeWaiting();
			})	
		}
		
	    {
	    	refreshRequestData();
	    }
	})

///数据转化处理
function _dataConvert(arr , isNew){
	if(arr == null || arr.length < 1){return;}
	var _newArr  = Array();
	
	for (var i = 0; i < arr.length; i++) {
		var d = arr[i];
		var boforeData = localStorage.getItem('homedislikeitemdata');
		if(boforeData){
			var _arr = JSON.parse(boforeData);
			if(_arr.indexOf(d['pid']) != -1 ) {//有问题,造成下一条记录刷新后无法显示
				continue;
			}
		}	
			
		var content = d['content'];
		var postDate = d['postDate'];
		d['postDateFormatter'] = dateUtils.format(postDate);
		

		//添加图片		
		var igStr = d['images'];
		if(igStr != null && igStr.length > 0){
			var igurlArr = igStr.split(',');
			var w = (plus.screen.resolutionWidth - 40) / 3.0;
			if(igurlArr.length == 1){
				w = (plus.screen.resolutionWidth - 30) / 3.0;
			}
			
			d['width'] = w;
			var _len = igurlArr.length > 3 ? 3 : igurlArr.length;
			var thumbArr = Array();
			for (var k = 0; k < _len; k++) {
					var thumb = getDtImageUrl(igurlArr[k] , '../../images/default_image2@2x.png');
					thumbArr.push(thumb);
				}
			
			d['imageUrl'] = thumbArr;
		}
		
		_newArr.push(d);
	}
	
	dataSourceArr.push.apply(dataSourceArr ,_newArr);
	//渲染列表
	ztlist.items = dataSourceArr;
	//保存最新列表数据,便于下次直接加载
	if(isNew){
		var jsonStr = JSON.stringify(dataSourceArr);
		localStorage.setItem('homelistlastloaddatafortype' + _listType , jsonStr);	
	}
}

function openDetailPage(item){
	openNewPage('home-detail.html', '郸城头条' , true,{'item':item , 'category':'sy'});
}

//不喜欢这条动态
function dislikeThisItem(item){
	mui.confirm("不想看这条动态,确定屏蔽?",'提示', ["确定", "取消"], function(e) {
	if(e.index == 0){
		var _pid = item['pid'];
		var boforeData = localStorage.getItem('homedislikeitemdata');
		if(boforeData){
			var _arr = JSON.parse(boforeData);
			_arr.push(_pid);
			localStorage.setItem('homedislikeitemdata' , JSON.stringify(_arr));
		}else{
			localStorage.setItem('homedislikeitemdata' , JSON.stringify([_pid]));
		}
		
		//删除列表元素
		var l = document.getElementById(_pid);
		l.parentNode.removeChild(l);
	}
	});
}
