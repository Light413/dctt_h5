//api接口定义
var BASE_URL = 'http://39.106.164.101:80/tt/';
var get_sy_url = 'getPostList.php'; //首页列表
var publish_url = "publish.php"//发布动态
var comment_url = "comment.php";//评论
var detail_url = "detail.php"//动态详情
var update_profile_url = "updateProfile.php";//更新用户信息
var homepage_url = "getsc.php";//个人主页、个人收藏
var fans_url = "fan.php" //粉丝关注
var blackList_url = "blackList.php"//黑名单
var delete_sc_url = "deletesc.php"//删除动态，删除收藏
var sh_url = "sh.php";

//登录注册
var login_url= "login.php";
var register_url = "register.php";
var get_checkcode_url = 'sendCheckCode.php'//获取验证码

var get_msglist_url = "message.php"
var jubao_url = "jubao.php"
var feedback_url = "feedback.php"
var check_version_url = 'checkUpdate.php';

//html
var publish_note_url = 'p/publishNotes.html';//发布须知
var user_agreement_url = "p/userAgreement.html"
var aboutus_url = "p/aboutus.html"
var contactus_url = "p/contactus.html"
var disclaimer_url = "p/disclaimer.html"
var usehelp_url = "p/usehelp.html"
var privacy_agreement_url = "p/userPrivacy.html"
var feedbackList_url = "p/feedbackList.html"

//http://39.106.164.101:80/tt/p/feedbackList.html
//动态类型
var dt_type_sy = 'sy';
var dt_type_zt = 'zt';
var dt_type_life = 'life';

//根据type获取动态分类（首页、专题、生活）
function getItemCategory(type){
	var _category = dt_type_life;
	var _type = type;
	switch (_type){
		case '10':
		case '11':
		case '12':
		case '13':
		case '14':
		case '15':
		_category = dt_type_sy;break;
		case '6':_category = dt_type_zt;break;
		default:break;
	}
	
	return _category;
}

/**
 * type:请求类型
 * url:地址
 * pars:参数
 * success:成功回调
 * error:失败回调
 */
function _ajax (type , url , pars , success , error){
	if(window.plus && plus.networkinfo.getCurrentType() === plus.networkinfo.CONNECTION_NONE) {
		plus.nativeUI.closeWaiting();
		plus.nativeUI.toast('无法连接网络!', {
			verticalAlign: 'top'
		});//return;
	}
	
	var u = BASE_URL + url;
	var token = localStorage.getItem("userToken");
	mui.ajax(u,{
			data:pars,
			dataType:'json',
			type:type,
			timeout:20000,
			headers:{//'Content-Type':'application/json',
			'Authorization' :  token || '' 
			},
			
			success:function(data){
				// console.log(JSON.stringify(data));
				if('200' == data.status) {
					success(data.body );//|| data
				}else{
					if(error){
						error(data['msg'] || '服务器返回错误');	
					}
				}
			},
			
			error:function(xhr,type,errorThrown){
				console.log('服务器返回错误:' + type);
				if(error){
					error('请求网络失败!');
				}
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

