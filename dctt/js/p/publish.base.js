//处理图片的添加、显示、压缩、上传
var _url;
var _params;
var _publishSuccessCallback;
var _publishErrorCallback;

var maxImageNum = 9;//最大选择图片数
var selectedImagesArr = [];//已选择的图片
	
document.write("<script src='../../js/p/tt.image.picker.js'><\/script>");

//显示图片列表
function displayImageList(imagesArr){
	var _width = (plus.screen.resolutionWidth - 30) / 3.0;
	var root = document.getElementById('image-list');
	root.innerHTML = '';
	
	for (var i = 0; i < imagesArr.length; i++) {
		var url = imagesArr[i];
		var div = document.createElement('div');
		div.className = 'image-wrap';
		div.style.width = _width + 'px';
		div.style.height = (_width + 20) + 'px';
		div.id = 'image-index-' + i;
		
		var div_ig = document.createElement('div');
		div_ig.style.height = _width + 'px';
		
		var ig = document.createElement('img');
		ig.className = 'single-image';
		ig.style.width = _width + 'px';
		ig.style.height = (_width) + 'px';
		
		ig.setAttribute('src' , url);
		
		div_ig.appendChild(ig);
		div.appendChild(div_ig);
		
		var del = document.createElement('div');
		del.style.width = _width + 'px';
		del.style.height = (20) + 'px';
		del.style.backgroundColor = 'white';
		del.id = i;

		var ig2 = document.createElement('img');
		ig2.src = '../../images/dislikeicon_details@2x.png';
		ig2.style.width = '20px';
		ig2.style.marginLeft = (_width - 20) / 2.0 + 'px';
		ig2.style.height = '20px';
		ig2.style.padding = '3px';
		del.appendChild(ig2);
		
		//删除事件
		del.addEventListener('tap',function(){
			var btnid  = this.id;
			var delImage = document.getElementById('image-index-' + btnid);
			// console.log(btnid);
			var _ig = delImage.getElementsByClassName('single-image')[0];
			for (let i = 0; i < selectedImagesArr.length; i++) {
				var s = selectedImagesArr[i];
				if(s == _ig.src){
					selectedImagesArr.splice(i , 1);
					break;
				}
			} 
			
			root.removeChild(delImage);
			if(selectedImagesArr.length == maxImageNum - 1){
				appendLastAddImage(root);
			}
		})
		
		div.appendChild(del);
		root.appendChild(div);
	}
	
	//添加按钮
	if(selectedImagesArr.length < maxImageNum){
		appendLastAddImage(root);
	}
}

///添加操作按钮
function appendLastAddImage(list){
	var _width = (plus.screen.resolutionWidth - 30) / 3.0;
	var div = document.createElement('div');
	div.className = 'image-wrap';
	div.setAttribute('id' , 'add-button-id');
	div.style.width = _width + 'px';
	div.style.height = (_width) + 'px';
	div.style.marginTop = '5px';
	div.style.display = 'block';
	
	var ig = document.createElement('img');
	ig.className = 'single-image';
	ig.setAttribute('src' , '../../images/addicon_repost@2x.png');
	ig.style.padding = '35px';
	div.appendChild(ig);
	
	//添加事件
	div.addEventListener('tap',function(){
		ttShowActionSheetPickerImage(maxImageNum - selectedImagesArr.length , function(e){
			//判断数据是数组还是字符，数组来自相册，字符串来自相册
			var isFromAlbum = Array.isArray(e);
			if(isFromAlbum){
				selectedImagesArr.push.apply(selectedImagesArr ,e);
				displayImageList(selectedImagesArr);
			}else{
				selectedImagesArr.push(e);
				displayImageList(selectedImagesArr);
			}
		})
		
	} , true)

	list.appendChild(div);
}

/**
 * 提交数据
 */
function submitToServer(url , params , successCallback , errorCallback){
	_url = url;
	_params = params;
	_publishSuccessCallback = successCallback;
	_publishErrorCallback = errorCallback;
	
	var token , userJsonStr = localStorage.getItem("loginuserinfo");
	if(userJsonStr){
		var _u = JSON.parse(userJsonStr);
		if(_u && _u['token']){
			token = _u['token'];_params['t'] = token;
		}
	}
	
	
	//压缩并上传提交
	zipImageFile(selectedImagesArr);
}

/**
 * 压缩图片、获取图片资源路径
 */
function zipImageFile(imagesArr){
	var actions = [];
	var files = [];
	for (var i = 0; i < imagesArr.length; i++) {
		var path = imagesArr[i];
		var pro = new Promise(resolve => {
			var name = path.substr(path.lastIndexOf('/') + 1);
			// console.log("zip file name:"+name);
			
			plus.zip.compressImage({
				src: path,
				dst: '_doc/' + name,
				overwrite: true,
				quality: 50
			},function(event){
				// console.log(JSON.stringify(event));
				files.push(event.target);
				resolve();
			},function(error){
				console.log(error.code);
			})
		});
		
		actions.push(pro);
	}
	
	Promise.all(actions).then(function(){
		// console.log('压缩图片完成:' + files.length + ' 个');
		var hud = plus.nativeUI.showWaiting('数据提交中');
		uploadFileData(BASE_URL + (_url || publish_url) , _params  , files , function(){
			hud.close();
			
			if(_publishSuccessCallback){
				_publishSuccessCallback()
			}else{
				mui.alert('系统24小时内审核通过后才会显示,感谢关注!','发布成功','知道了',function (e) {
				   mui.back();
				});
			}
		} , function(errorMsg){
			hud.close();
			plus.nativeUI.toast(errorMsg , {verticalAlign: 'center'});
		});
	});
}


/**提交数据到服务器
 * url:提交地址
 * params:请求参数
 * filesArr:要上传的图片
 * success:成功回调
 * failure:失败回调
 */
function uploadFileData(url , params , filesArr , success,failure){
	if(window.plus && plus.networkinfo.getCurrentType() === plus.networkinfo.CONNECTION_NONE) {
		plus.nativeUI.toast('无法连接网络!', {
			verticalAlign: 'top'
		});return;
	}
	
	if(filesArr.length > 0){
		var task = plus.uploader.createUpload(url, {method:"POST"},
			function ( t, status ) {
				// console.log(JSON.stringify(t));
					if ( status == 200 ) { 
						if(success){
							success();
						}
					} else {
						if(failure){
							failure()
						}
					}
				}
		);
		
		for (var key in params) {task.addData(key , params[key]);}
		for (var i = 0; i < filesArr.length; i++) {
			var ig = filesArr[i];
			var k = 'files[' + i + ']';
			task.addFile( ig, {key:k , mime:'image/jpeg'} );
		}

		task.start();
	}else{
		api_post(_url || publish_url , params , function(res){
			if(success){
				success();
			}
		} , function(error){
			if(failure){
				failure(error);
			}
		})
	}
}