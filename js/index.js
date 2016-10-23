var weights = [];
var localStore = window.localStorage;
var console = {log: function(){}};

$(function() {
	loadWeights();
	showWeights();
	$('#weightInput').on('click',function() {
		var newWeight = $('#newWeight').val();
		if(newWeight == ''){
			return;
		}
		$('#newWeight').val('');		
		var weight = {wt: parseFloat(newWeight), tm: Date.now()};
		weights.push(weight);
		saveWeight();
		showWeights();
	});
	$('body').on('click','.remove',function() {
		var tm = $(this).attr('data-tm');
		removeWeight(tm);
	});
});

function showWeights(){
	$('#weightList').html(weights.slice().reverse().map(function(x){
		var d = getAddedWeight(x);
		var color = 'background-color:rgb('+d.color.join(',')+');';
		return '<div class="weui-cell" style="'+color+'"><p>'+getShownTime(x.tm)+' <span class="rt">'+getShownWeight(x.wt)+'kg</span><span class="remove" data-tm="'+x.tm+'">×</span></p></div>';
	}).join(''));
}

/** 从localStorage读取数据 **/
function loadWeights () {
	weights = JSON.parse(localStorage.getItem('weights')||'[]');
}

/** 保存数据到localStorage **/
function saveWeight(){
	localStorage.setItem('weights', JSON.stringify(weights));	
}

/** 展示用: 时间,补零 **/
function getShownTime(time2show){
	function fx2(s){
		return ('00'+s).slice(-2);
	}
	var t = new Date(time2show);
	return t.getFullYear() +'.'+fx2(t.getMonth()+1)+'.'+fx2(t.getDate())+' '+fx2(t.getHours())+':'+fx2(t.getMinutes());
}

/** 展示用：weight */
function getShownWeight(w){
	var s = w*10>>0;
	return (s/10>>0)+'.'+s%10;
}

/** 展示用的背景色,返回rgb组成的数组 **/
function getShowBgColor(distence){
	function fix(a){
		return a.map(function(x) {
			x = x>>0;
			return x<0?0:(x>255)?255:x;
		});
	}
	var d = distence*1000;//按照克计算
	console.log(d);
	var i;
	if(d>500){
		d = d>1000?1000:d;
		i = (d-500) / 500;
		return fix([200+55*i, 255-i*255, 200-i*200]);
	} else {
		d= d<0?0:d;
		i = Math.max(d,0) / 500;
		return fix([200+(1-i)*55, 255, 200-200*i]);
	}
	return [255,255,255];
}

/** 得到上周的值，使用线性插值计算 **/
function getWeightLastWeek(curData){
	var t = curData.tm - 24*7*3600*1000;
	for(var i=0,leng=weights.length;i<leng;i++){
		if(weights[i].tm > t){
			break;
		}
	}
	if(i>=leng-1 || i===0){
		return curData.wt-0.5;
	}
	else{
		var lastMin = weights[i-1];
		var firstMax = weights[i];
		return lastMin.wt + (firstMax.wt - lastMin.wt)*(curData.tm-lastMin.tm)/(firstMax.tm-lastMin.tm);
	}
}

/** 获取当前体重与一周前的差值 **/
function getAddedWeight(curData){
	var dw = curData.wt - getWeightLastWeek(curData);
	return {wt:dw, color:getShowBgColor(dw)};
}

/** 根据时间戳删除一个记录 **/
function removeWeight(tm){
	console.log(tm);
	weights = weights.filter(function(x){return x.tm != tm});
	saveWeight();
	showWeights();
}