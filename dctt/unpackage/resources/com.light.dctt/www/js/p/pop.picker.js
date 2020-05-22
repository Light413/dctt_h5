///弹框操作，选择日期、选择数据
function addEventForButton(picker){
	///选中区域
	var showLocationPickerBtn = document.getElementById('showLocationPickerBtn');
	showLocationPickerBtn.addEventListener('tap', function(event) {
		if(qyArr.length < 1){mui.alert('没有数据区域!');return;}
		
		picker.setData(qyArr);
		picker.show(function(items) {
		var title = items[0]['text'];
		var index = items[0]['index'];
		showLocationPickerBtn.innerText = title;
		selected_qy = qyOriginDataArr[index];
		
		//清除下一关联级数据
		showstationPickerBtn.innerText = '选择工位';
		devicesPickerBtn.innerText = '选择设备';
		
		sbOriginDataArr = [];
		gwOriginDataArr = [];
		selected_gw = null;
		selected_sb = null;
		
		console.log(window.location.pathname);
		
		if(clearParameter){
			clearParameter();
		}
		
		///加载工位数据
		requestBaseData('gw' , {'nodeId':selected_qy['nodeId']});
		});
	}, false);
	
	///选择工位
	var showstationPickerBtn = document.getElementById('showStationPickerBtn');
	showstationPickerBtn.addEventListener('tap', function(event) {
		if(selected_qy == null){mui.alert('请先选择区域');return;}
		if(gwOriginDataArr == null || gwOriginDataArr.length < 1){
			///加载工位数据
			requestBaseData('gw' , {'nodeId':selected_qy['nodeId']} , function(){
				picker.setData(gwArr);
				picker.show(function(items) {
					var title = items[0]['text'];
					var index = items[0]['index'];
					showstationPickerBtn.innerText = title;
					selected_gw = gwOriginDataArr[index];
					
					devicesPickerBtn.innerText = '选择设备';
					sbOriginDataArr = null;
					selected_sb = null;
					if(clearParameter){
						clearParameter();
					}
					
					requestBaseData('sb' , {'nodeId':selected_gw['nodeId']});
				});
			});return;
		}
		
		picker.setData(gwArr);
		picker.show(function(items) {
			var title = items[0]['text'];
			var index = items[0]['index'];
			showstationPickerBtn.innerText = title;
			selected_gw = gwOriginDataArr[index];
			
			devicesPickerBtn.innerText = '选择设备';
			sbOriginDataArr = null;
			selected_sb = null;
			
			if(clearParameter){
				clearParameter();
			}
			requestBaseData('sb' , {'nodeId':selected_gw['nodeId']});
		});
	}, false);
	
	///选择设备
	var devicesPickerBtn = document.getElementById('showDevicesPicker');
	devicesPickerBtn.addEventListener('tap', function(event) {
		if(selected_gw == null){mui.alert('请先选择工位');return;}
		if(sbOriginDataArr == null || sbOriginDataArr.length < 1){
			requestBaseData('sb' , {'nodeId':selected_gw['nodeId']} , function(){
				picker.setData(sbArr);
				picker.show(function(items) {
					var t = items[0]['text'];
					var index = items[0]['index'];
					devicesPickerBtn.innerText = t;
					
					selected_sb = sbOriginDataArr[index];
					
					if(clearParameter){
						clearParameter();
					}
				});
			});return;
		}
		
		picker.setData(sbArr);
		picker.show(function(items) {
			var t = items[0]['text'];
			var index = items[0]['index'];
			devicesPickerBtn.innerText = t;
			
			selected_sb = sbOriginDataArr[index];
			
			if(clearParameter){
				clearParameter();
			}
		});
	}, false);
	
}




///选择日期
function selectDateAction(pickDateBtn){
	pickDateBtn.addEventListener('tap', function() {
		var isStartDate = pickDateBtn.id == 'pickStartDateBtn';
		var _self = this;
		
		{
			var id = this.getAttribute('id');
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			options['endDate'] = new Date();
			
			var _title = this.innerText;
			if(_title.length > 15){
				options['value']= _title;
			}
			
			_self.picker = new mui.DtPicker(options);
			_self.picker.show(function(rs) {
			pickDateBtn.innerText = rs.text;
			
			if(isStartDate){
				_startDate = rs.text;
			}else{
				_endDate = rs.text;
			}
			
			_self.picker.dispose();
			_self.picker = null;
			});
		}
		
	}, false);
}