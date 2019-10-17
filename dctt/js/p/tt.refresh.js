//刷新处理操作
var pageNum = 1;//当前页
var pageItemsLen = 20;//每页条数
var isPullDownRefreshing = true;//正在下拉刷新
var dataSourceArr = [];//当前列表数据源


///调用者设置
var _id;
var _url;
var _requestParamters;
var _successCallBack;
var _failureCallBack;

/**刷新列表初始化(必须)
 * containerId:列表容器ID(必须)
 * url:请求地址(必须)
 * pars:请求参数(可选)
 * success:成功回调(必须)
 * error:失败回调(可选)
 */
function ttRefreshInit(containerId , url , pars , success , error ){
	this._id = containerId;
	this._url = url;
	this._requestParamters = pars;
	this._successCallBack = success;
	this._failureCallBack = error;
}

//下拉刷新
function pulldownRefresh() {
	pageNum = 1;
	dataSourceArr = [];
	isPullDownRefreshing = true;
	
	refreshRequestData();
}

//上拉加载更多
function loadMoreData(){
	pageNum = pageNum + 1;
	isPullDownRefreshing = false;
	refreshRequestData();
}
		
function refreshRequestData(){
	if(_url == null){plus.nativeUI.toast('请求地址不能为空!',{verticalAlign:'center'});return;}	
	_requestParamters['pageNumber'] = pageNum;	
	
	// plus.nativeUI.showWaiting('数据加载中');
	// console.log('---本次请求参数：' + JSON.stringify(_requestParamters));
	api_post(_url , _requestParamters ,function(result){
		
		console.log('当前页:' + pageNum + '\t本次返回数据长度:' + (result ? result.length : 0));
		// plus.nativeUI.closeWaiting();
		var arr = result;
		if(isPullDownRefreshing){
			// console.log(_id);
				mui(_id).pullRefresh().endPulldownToRefresh();
				mui(_id).pullRefresh().refresh(true);
				
				if(!arr || result.length < pageItemsLen){
					mui(_id).pullRefresh().disablePullupToRefresh();
					mui(_id).pullRefresh().endPullupToRefresh(true);
				}	
		}else{
			if(arr){
				if(result.length < pageItemsLen){
					mui(_id).pullRefresh().disablePullupToRefresh();
				}
				mui(_id).pullRefresh().endPullupToRefresh(result.length < pageItemsLen);
			}else{
				mui(_id).pullRefresh().disablePullupToRefresh();
				mui(_id).pullRefresh().endPullupToRefresh(true);
				plus.nativeUI.toast('加载完成');
				
				var isexistnodatadiv = document.getElementById('refreshtablenodataid');
				if(!isexistnodatadiv){
					var nodatadiv = document.createElement('div');
					nodatadiv.id = 'refreshtablenodataid';
					nodatadiv.innerText = '已经是底线了^_^';
					nodatadiv.setAttribute('style','text-align:center;margin-top:30px;color:#999;font-size:13px;');
					
					var _root = document.getElementById(_id.substr(1));
					_root.appendChild(nodatadiv);
					mui(_id).pullRefresh().disablePullupToRefresh();
					mui(_id).pullRefresh().endPullupToRefresh(true);
				}
				
				return;
			}
		}
		
		if(arr && _successCallBack){_successCallBack(arr);}	
		if(pageNum == 1){
			if(!arr){
				var nodatadiv = document.createElement('div');
				nodatadiv.innerText = '暂时还没有数据';
				nodatadiv.setAttribute('style','text-align:center;margin-top:50%;color:#999;font-size:13px;');
				nodatadiv.id = 'notanydataid';
				var _root = document.getElementById(_id.substr(1));
				_root.innerHTML = '';
				_root.appendChild(nodatadiv);
				
				mui(_id).pullRefresh().disablePullupToRefresh();
				// mui(_id).pullRefresh().disablePulldownToRefresh();
				_successCallBack(arr || '');
			}else{
				if(arr.length < pageItemsLen){
					var notanydata = document.getElementById('notanydataid');
					if(notanydata){
						var _root = document.getElementById(_id.substr(1));
						_root.removeChild(notanydata);
						// notanydata.parentNode.removeChild(notanydata);
					}
					
					var isexistnodatadiv = document.getElementById('refreshtablenodataid');
					if(!isexistnodatadiv){
						var nodatadiv = document.createElement('div');
						nodatadiv.id = 'refreshtablenodataid';
						nodatadiv.innerText = '已经是底线了^_^';
						nodatadiv.setAttribute('style','text-align:center;margin-top:30px;color:#999;font-size:13px;');
						
						var _root = document.getElementById(_id.substr(1));
						_root.appendChild(nodatadiv);
						mui(_id).pullRefresh().disablePullupToRefresh();
						mui(_id).pullRefresh().endPullupToRefresh(true);
					}
				}else{//使能上拉
					mui(_id).pullRefresh().refresh(true);
				}
			}
			return;
		}
		
		// if(arr && _successCallBack){_successCallBack(arr);}		
		plus.nativeUI.toast('加载完成');
	} ,function(error){
		pageNum = pageNum - 1;
		plus.nativeUI.closeWaiting();
		
		if(isPullDownRefreshing){
			mui(_id).pullRefresh().endPulldownToRefresh();
			mui(_id).pullRefresh().refresh(true);
		}else{
			mui(_id).pullRefresh().endPullupToRefresh(false);
		}
		
		if(_failureCallBack){
			_failureCallBack();
		}
		plus.nativeUI.toast(error);
	})
}


