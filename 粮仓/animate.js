/*	作者：wj  联系方式：3228798988@qq.com
	版本：7.0.0;

	这是一个轻量级JS文件
	功能：获取计算后样式  、 获取动画最小时间间隔  、 运动框架 、获取节点
	运动框架用法：
	1.  用户最少要传入3个参数
		第一个为要运动对象，类型必须为object
		第二个为JSON格式的对象，里面属性为目标属性，类型必须object
		第三个为时间，单位为毫秒，类型必须为number
	2. 第四个参数，用户可传可不传，如果要传那么类型必须为function
*/

//运动框架
function animate(ele, targetJSON, times, callback){
	//函数节流
	ele.lock = true;

	//判断输入的参数
	if(arguments.length < 3 || typeof arguments[0] != 'object' || typeof arguments[1] != 'object' || typeof arguments[2] != 'number'){
		throw new Error('参数有误,必须要传入三个参数以上，用法请查看JS文件说明')
		return;
	}else if(typeof arguments[3] != 'function'){
		callback = null;
	}


	//获取最小动画时间间隔
	var interval = frame();
	
	//信号量
	//初始值   
	var startJSON = {};
	//遍历目标JSON，需求是要得到相对应的属性
	for(var k in targetJSON){ //targetJSON[k] {'left':'600px', 'top':300, 'opacity':1}
		startJSON[k] = parseFloat(fcs(ele, k)); //传进值的单位去掉用parseFloat  startJSON['left'] = 40
	}

	//总次数
	//3000 走完3000这个定时器总共执行了多少次   定时器是每隔10 interval
	var maxcount = parseInt(times / interval); //让定时器停止的条件，是不是每运行一次定时器咱们就加一次
	//一旦这个次数加到等于  maxcount   就可以让定时器停止

	//步长   560
	var stepJSON = {}; //left top ...
	for(var k in targetJSON){//{'left':'600px', 'top':300, 'opacity':1}
		//纺一把目标值的单位去掉，然后重新赋值
		targetJSON[k] = parseFloat(targetJSON[k]);
		stepJSON[k] = (targetJSON[k] - startJSON[k]) / maxcount;
	}

	//计数器
	var count = 0;

	//定义一个定时器变量
	var timer;

	timer = setInterval(function(){
		//实际步长累加
		//startJSON += stepJSON
		for(var k in stepJSON){// left 40 + 1.8 = 41.8
			startJSON[k] += stepJSON[k]
		}
		//start += step;
		
		//判断用户输入的是不是透明度
		for(var k in startJSON){
			if(k == 'opacity'){
					ele.style[k] = startJSON[k];
					ele.style.filter = 'alpha(opacity=' + startJSON[k] * 100 + ')';
			}else{
				ele.style[k] = startJSON[k] + 'px';
			}
		}
	
		//定时器执行次数累加
		count++;
		//console.log(count)
		//判断停止条件 
		if(count == maxcount){
			//停止定时器
			clearInterval(timer)
			//拉回
			//判断用户输入的是不是透明度
			for(var k in targetJSON){
				if(k == 'opacity'){
						ele.style[k] = targetJSON[k];
						ele.style.filter = 'alpha(opacity=' + targetJSON[k] * 100 + ')';
				}else{
					ele.style[k] = targetJSON[k] + 'px';
				}
			}
			
			//结束完后我们还想干点啥？
			//要写一个通用方法，不能每次想干点啥都到这里面来改
			//ele.style.background = 'green';
			//回调的函数
			//var callback = function(){....}
			//指定函数里面的this对象
			callback && callback.call(ele);
			//top = 0
			//关锁
			ele.lock = false;
		}
	},interval)
}

//获取计算后样式的方法
//用法：传两个参数   第一为对象  第二个为样式名
//fcs  => fetch computed style
function fcs(ele, property){
	//判断检测浏览器支不支这个属性
	if(window.getComputedStyle){
		//有就高版本的方法
		return parseFloat(getComputedStyle(ele)[property]);
	}else{
		//没有就用IE低版本的方法
		return parseFloat(ele.currentStyle[property]);
	}
};

//获取最小动画时间间隔
function frame(){
	var interval = 0;
	//先去判断不同的浏览器，设置最小时间间隔
	if(window.navigator.userAgent.indexOf("MSIE") == -1){
		//条件成立为现代浏览器
		interval = 10;
	}else{
		//条件不成立为低版本浏览器    IE 9 8 7 6 
		interval = 50;
	};
	return interval;
}


//获取节点方法
//可传参数为一个或者两：如果为一个，那必须是一个对象
//如果传两个，第一个为对象第二个为要具体获取的哪一个  类型为number
function fetchChildNodes(ele, num){
	var arr = [];
	//循环所有的节点长度，包括了空文体节点
	for(var i = 0; i < ele.childNodes.length; i++){	
		//去判断类型
		if(ele.childNodes[i].nodeType == 1){
			arr.push(ele.childNodes[i]);
		}
	}
	return num ? arr[num-1] : arr;
}