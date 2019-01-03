//api接口定义
var BASE_URL = 'http://39.106.164.101:80/tt/';
var get_sy_url = 'getPostList.php'; //首页列表
var publish_url = "publish.php"//发布动态
var comment_url = "comment.php";//评论
var detail_url = "detail.php"//动态详情
var update_profile_url = "updateProfile.php";//更新用户信息
var homepage_url = "getsc.php";//个人主页、个人收藏

var user_agreement_url = "p/userAgreement.html"
var aboutus_url = "p/aboutus.html"
var contactus_url = "p/contactus.html"
var disclaimer_url = "p/disclaimer.html"
var usehelp_url = "p/usehelp.html"
var privacy_agreement_url = "p/userPrivacy.html"
var feedbackList_url = "p/feedbackList.html"

//动态类型
var dt_type_sy = 'sy';
var dt_type_zt = 'zt';
var dt_type_life = 'life';


/**
 * type:请求类型
 * url:地址
 * pars:参数
 * success:成功回调
 * error:失败回调
 */
function _ajax (type , url , pars , success , error){
	if(window.plus && plus.networkinfo.getCurrentType() === plus.networkinfo.CONNECTION_NONE) {
		plus.nativeUI.toast('无法连接网络!', {
			verticalAlign: 'top'
		});return;
	}
	
	var u = BASE_URL + url;
	var token = localStorage.getItem("userToken");

	mui.ajax(u,{
			data:pars,
			dataType:'json',
			type:type,
			timeout:20000,
			headers:{//'Content-Type':'application/json',
			'Authorization' : 'eyJraWQiOiJzaWcwMTU0MjY5OTU0MTA3MCIsImFsZyI6IkhTMjU2In0.eyJzdWIiOiIyNEEzOTkxNjA3MEY0NTMyOTJGNzcwQUE5QjM0RkZBQiIsImF1ZCI6IkNMSUVOVF9VU0VSIiwiaXNzIjoiaHR0cDpcL1wvd3d3LmdlbmVyLXNvZnQuY29tXC9hcGNtIiwiaWF0IjoxNTQyNzY4NzI4LCJqdGkiOiI0MGYxOTgwZi01OTIxLTQ0MWMtOTcxOC1hMDZiYjRjNmMzNDcifQ.1wigxPRf95N4OQFKp_zgCpNBwmxiAzt7ZOw5xBp7aF8' 
			},
			
			success:function(data){
				//console.log(JSON.stringify(data));
				if('200' == data.status) {
					success(data.body );//|| data
				}else{
					console.log(JSON.stringify(data));
					error('服务器返回错误');
				}
			},
			
			error:function(xhr,type,errorThrown){
				console.log('服务器返回错误:' + type);
				error('请求网络失败!');
			}
	});
}

/**
 * Get请求操作
 */
function api_get(url , pars , success , error){
	_ajax('get' , url , pars , success , error);
}

/**
 * Post请求操作
 */
function api_post(url , pars , success , error){
	_ajax('post' , url , pars , success , error);
}

