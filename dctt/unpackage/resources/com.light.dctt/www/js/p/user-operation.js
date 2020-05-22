var USER_OP = {
	/**
	 * 删除动态
	 * item:动态对象
	 */
	deletePost: function(item){
		mui.confirm("确定删除这条动态?", ["确定", "取消"], function(e) {
			if(e.index == 0){
				var _category = getItemCategory(item['type']);
				var d = {"uid":getLoginUid() ,
					 "pid": item['pid'],
					 "category":_category,
					 "type":0};
				
			   hud_show('正在删除');
			   api_post(delete_sc_url , d , function(res){
				hud_close('删除成功');
				
				//删除列表元素
				var l = document.getElementById(item['pid']);
				l.parentNode.removeChild(l);
			   } , function(error){
				hud_close(error);
			   }) 
			}
		});
	},
	
	//
	
}	