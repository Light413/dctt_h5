/**
 * 当前登录用户信息
 */

//用户ID
function getLoginUid(){
	var u = this.getUserInfo();
	if(!u){return ;}
	return u['user_id'];
}

//是否登录
function userHasLogined(){
	var b = this.getLoginUid() != null;
	if(!b){
		console.log('还没有登录....');
	}
	return b;
}


function getUserInfo(){
	var s = localStorage.getItem('loginuserinfo');
	var u = JSON.parse(s);
	return u;
}

//获取用户头像缩略图-废弃
function getUserAvatarUrl(thumbUrl , defaultUrl){
	if(thumbUrl){
		thumbUrl = thumbUrl.replace('avatar' , 'avatar_thumb');
// 		var timestamp = new Date().getTime();
// 		thumbUrl = thumbUrl + '?s=' + timestamp;
	}
	
	return thumbUrl || defaultUrl;
}

//获取动态列表缩略图
function getDtImageUrl(thumbUrl , defaultUrl){
	if(thumbUrl){
		thumbUrl = thumbUrl.replace('.jpg' , '_thumb.jpg');
	}
	
	return thumbUrl || defaultUrl;
}