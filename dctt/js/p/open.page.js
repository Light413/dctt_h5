
	function openNewPage( url , title , displayNavigationBar , datasource){
				var barOptions = displayNavigationBar ? {  
														autoBackButton:true,
														titleText:title,                // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
														titleColor:"#FF4500",             // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
														titleSize:"17px",                 // 字体大小,默认17px
														backgroundColor:"#fff",        // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
														splitLine:{                       // 标题栏控件的底部分割线，类似borderBottom
														color:"#CCCCCC",                // 分割线颜色,默认值为"#CCCCCC"  
														height:"1px"                    // 分割线高度,默认值为"2px"
														},
														type: url == 'me/me-homepage.html' ? 'transparent' : 'default'
												} : '';
												
					mui.openWindow({
									url:url,
									id:url,
									styles:{
										bounce : "vertical",												
										titleNView: barOptions								
									},
									extras:datasource,
									createNew:true,
									show:{
										// autoShow:true,
										event:'loaded',
					// 					aniShow:"slide-in-right",
					// 					duration:"2000"
									},
									waiting : {
										autoShow:false
									},
								});
			}