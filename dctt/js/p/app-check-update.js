/**
 * 检测APP版本更新
 */
function appCheckUpdate () {
	var appid = plus.runtime.appid;
	if(appid == 'HBuilder')return;
	var d = {type:0};		
	mui.post('http://39.106.164.101:80/tt/checkUpdate.php' , d , function(res){	
		if(!(res && res['body']))return;
		var appdata = res['body'];
		var newVersion = appdata['version_number'];
		var url = appdata['download_url'];
		var versDes = appdata['version_log'];
		// console.log(appid);	
		// console.log(JSON.stringify(res));//eturn;-'com.light.dctt'
		plus.runtime.getProperty(plus.runtime.appid, function(info){
			var appver =  info['version'];		
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
			}	
		});
	} , 'json');	
}

/**
 * @param {Object} url
 * 下载安装app,仅适用于Android系统
 */
function _startDownloadTask(url){
	// mui('#popover').popover('show');
	// mui("#progress-bar").progressbar({progress:0}).show();
	
	plus.nativeUI.showWaiting('APP更新中...');
	var downloadTask = plus.downloader.createDownload(url , {} , function(download , status){
		plus.nativeUI.closeWaiting();
		// mui('#popover').popover('hide');
		
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
			console.log(err);
		});
	});
	
	downloadTask.addEventListener('statechanged' , function(download , status){
		//console.log(download.downloadedSize / 1024.0 + '-' + download.totalSize / 1024.0);
		var _has = 0.0;
		if(download.totalSize > 0){
			_has = download.downloadedSize / download.totalSize;
			_has = Math.round(_has * 1000)/10; 
			// mui("#progress-bar").progressbar().setProgress(_has);
		}
	
		// mui('#download-progerss')[0].innerText = _has + '%';
	});
	
	downloadTask.start();
}