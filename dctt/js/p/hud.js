function hud_show(msg){
	plus.nativeUI.showWaiting(msg);
}

function hud_close(msg){
	plus.nativeUI.closeWaiting();
	plus.nativeUI.toast(msg , {verticalAlign:'center'});
}

function hud_toast(msg){
	plus.nativeUI.toast(msg , {verticalAlign:'center'});
}