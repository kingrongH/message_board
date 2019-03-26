
//get data from user input
function getData(){
	var textarea = document.querySelector("#message");
	var data = textarea.value;
	var result = {};
	if(data.length > 250){
		alert("reach words limitation");
	}else{
		let date = new Date();
		let time = date.getTime();
		result.time = time;
		result.data = data;
		return JSON.stringify(result,null,'  ');
	}
}

//write data to the dom
function writeToDom(data){
	var message_pannel = document.querySelector("#show_message");
	if(data){
		var message_show_card = document.createElement("div");
		message_show_card.className = "message_show_card";
		message_show_card.innerText = data;
		message_pannel.appendChild(message_show_card);
		console.log(message_show_card);
	}
}

//handle the data post it to the server
function submitMessage(){
	var data = getData();
	ajax("/handle_data","POST",data);
	return false;
}

//ajax request 
function ajax(url,method,data){
	var promise = new Promise(function(resolve,reject){
		var request =  new XMLHttpRequest();
		request.onreadystatechange = function(){
			if(request.readyState == 4){
				if(request.status == 200){
					resolve(data,request.responseText);
				}else{
					reject(request.statusText);
				}
			}else{
				console.log("服务器正在处理数据，你可能需要稍等或者重新提交");
			}
		};
		request.open(method,url);
		request.setRequestHeader("Content-Type","text/plain");
		request.send(data);
	});
	promise.then(function(data,responseText){
		//parse the json string
		var data = JSON.parse(data).data;
		console.log(responseText);
		writeToDom(data);
		//operate successfully, delete the value
		document.querySelector("#message").value="";
	}).catch(function(statusText){
		alert("发生错误，请在此提交或者稍后再试,打开终端查看错误详情！");
		console.log(statusText);
	});
}


