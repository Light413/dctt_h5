/**
 * 检测APP版本更新,plus中调用
 * @date:20191209
 */
(function(mui,document){
 mui.appCheckUpdate = function() {
	var appid = plus.runtime.appid;
	if(appid == 'HBuilder')return;
	var d = {type:0};		
	mui.post('http://39.106.164.101:80/tt/checkUpdate.php' , d , function(res){	
		if(!(res && res['body']))return;
		var appdata = res['body'];
		var newVersion = appdata['version_number'];
		var url = appdata['download_url'];
		var versDes = appdata['version_log'];
		// console.log(JSON.stringify(res));//eturn;-'com.light.dctt'
		plus.runtime.getProperty(plus.runtime.appid, function(info){
			var appver =  info['version'];		
			// console.log("info: " + JSON.stringify(info));
			if (newVersion > appver) {
				mui.confirm(versDes,'新版本(' + newVersion + ')' ,  ["下载更新", "取消"], function(e) {
					if(e.index == 0){
						//iOS - 4.3+ (支持): 不支持ipa包的安装，Android - 2.2+ (支持): 可支持apk包的安装
						if(mui.os.ios){
							window.location.href = url;//文件下载，任务栏弹框不会自动安装
						}else{
							_startDownloadTask(url);
						}
						
						//plus.runtime.openURL(url);
					}
				});
			}else{
				if(location.href.indexOf('setter') > 0){
					plus.nativeUI.toast('已是最新版本');
				}
			}	
		});
	} , 'json');	
}

/**
 * @param {Object} url
 * 下载安装app,仅适用于Android系统
 */
var _startDownloadTask = function(url){
	_show();
	var downloadTask = plus.downloader.createDownload(url , {} , function(download , status){
		setTimeout(function() {
			_hide();
		}, 200);
		
		if(200 != status)return;
		var _filename = download.filename;
		//仅支持本地地址，调用此方法前需把安装包从网络地址或其他位置放置到运行时环境可以访问的本地目录。
		plus.runtime.install(_filename, {}, function(){
			//console.log('install ok:' + _filename);
			/*此处执行删除有问题，apk未来得及安装已经被删除*/
			// plus.io.resolveLocalFileSystemURL('_downloads/' , function(entry){
			// 	console.log(entry);
			// 	
			// 	entry.removeRecursively(function(entrys){
			// 		console.log(_filename + '删除成功');
			// 	});
			// });
		}, function(err){
			plus.nativeUI.toast('安装失败:' + JSON.stringify(err) , {verticalAlign:'center'});
			console.log(JSON.stringify(err));
		});
	});
	
	downloadTask.addEventListener('statechanged' , function(download , status){
		//console.log(download.downloadedSize / 1024.0 + '-' + download.totalSize / 1024.0);
		var _has = 0.0;
		if(download.totalSize > 0){
			_has = download.downloadedSize / download.totalSize;
			_has = Math.round(_has * 1000)/10; 
			mui("#progress-bar")&&mui("#progress-bar").progressbar().setProgress(_has);
		}
	
		mui('#download-progerss')&&(mui('#download-progerss')[0].innerText = _has + '%');
	});
	
	downloadTask.start();
}

/**
 * 显示下载进度弹框
 */
 var _show = function(){
	var html = '<div style="float: left;margin-top: 320px; background-color: white;width: 94%;height: 120px; margin-left: 3%; border-radius: 6px;">\
			<div style="text-align: center;font-size: 16px;margin-top: 25px;color: #888;">应用程序更新中</div>\
			<div style="height: 70px;margin-bottom: 25px;">\
				<div id="progress-bar" class="mui-progressbar" style="margin-top: 20px;height: 8px; background-color: #eee; margin-left: 5%; width: 90%; border-radius: 5px;"><span></span>\
				 </div>\
				 <div style="text-align: center;font-size: 18px;margin-top: 15px;color: #666;">\
					<span id="download-progerss" style="color: #bbb;">0%</span>\
				</div>\
			</div>\
		</div>'
	var e = document.createElement('div');
	e.setAttribute('id' , 'app-update-version-pop');
	e.className = 'mui-backdrop';
	e.innerHTML = html;
	document.body.appendChild(e);
	mui("#progress-bar").progressbar({progress:0}).show();
	plus.nativeUI.showWaiting();
}
/**
 * 隐藏弹框
 */
 var _hide = function(){
	var pop = mui('#app-update-version-pop')[0];
	pop&&pop.parentNode.removeChild(pop);
	plus.nativeUI.closeWaiting()
}
}(mui,document));