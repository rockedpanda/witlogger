var weights = [];
var localStore = window.localStorage;


$(function() {
	loadWeights();
	showWeights();
	$('#weightInput').click(function() {
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
});

function showWeights(){
	$('#weightList').html(weights.reverse().map(function(x){
		return '<div class="weui-cell"><p>'+getShownTime(x.tm)+' <span class="rt">'+getShownWeight(x.wt)+'kg</span></p></div>';
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
	var s = (w*10>>0) / 10;
	return s;
}

/** 展示用的背景色,返回rgb组成的数组 **/
function getShowBgColor(distence){
	return [255,255,255];
}

/** 得到上周的值，使用线性插值计算 **/
function getWeightLastWeek(){
	return 50;
}