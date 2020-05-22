//从相机或相册选择图片操作
//plus中调用

var didFinishedSelectedImageHandler;//选择图片完成后的回调方法

//弹框提示选择图片(相机和相册)
function ttShowActionSheetPickerImage(maxImageNum , successCallBack){
	didFinishedSelectedImageHandler = successCallBack;	
	plus.nativeUI.actionSheet({title:'添加图片' , cancel:'取消' , buttons:[{title:'拍照'},{title:'从相册选取'}] }, function(e){
		switch (e.index){
			case 1:selectFromPhotos();break;
			case 2:selectFromAlbum(maxImageNum);break;
			default:break;
		}
	})
}

//拍照获取图片
function selectFromPhotos() {
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		//console.log(e);
		var name = e.substr(e.lastIndexOf('/') + 1);
		plus.zip.compressImage({
			src: e,
			dst: '_doc/' + name,
			overwrite: true,
			quality: 100
		},function(event){
			if(didFinishedSelectedImageHandler){
				didFinishedSelectedImageHandler(event.target);
			}
		},function(error){
			console.log(error.code);
		})
		
	}, function(s) {
		console.log("拍照失败：" + s);
	}, {
		filename: "_doc/camera/"
	})
}

//从相册中选择图片 
function selectFromAlbum(imageNum){
	plus.gallery.pick( function(e){
		if(didFinishedSelectedImageHandler){
			didFinishedSelectedImageHandler(e.files);
		}
	}, function (e) {
		plus.nativeUI.toast('取消选择图片');
	},{
		filter: "image",
		multiple:true,
		maximum: imageNum,
		system: false,
		onmaxed: function() {
			plus.nativeUI.alert('最多只能选择' + imageNum + '张图片');
		}
	}
	);	
}
