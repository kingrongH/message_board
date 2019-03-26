const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");


//resolve path
var file_path = path.resolve("..");
console.log("file path:"+file_path);

const appendData = require(file_path+"/server/data_handle.js");

//handle the request
var server = http.createServer((req,res)=>{
	
	var reqPath = url.parse(req.url).pathname;
	console.log(req.method+ " request on "+ reqPath);

	if(req.method=="GET"){
		fs.access(file_path+reqPath,(err)=>{
			if(err){
				console.log(err);
			}else{
				if(reqPath === "/"){
					var readstream = fs.createReadStream(file_path+"/index.html");
				}else{
					var readstream = fs.createReadStream(file_path+reqPath);
				}
				res.writeHead(200,{
					"Access-Control-Allow-Origin":"http://localhost:3000"
				});
				readstream.pipe(res);
			}
		});
	}else if(req.method=="POST"){
		if(reqPath == "/handle_data"){
			//handle the data received
			req.on("readable",()=>{
				let chunk = req.read();
				if(chunk !== null){
					//write the received data to the data file
					console.log("received data: "+chunk.toString());
					appendData(chunk);
				}
			});
			res.writeHead(200,{
				"Content-Type":"text/plain"
			});
			res.write("this a response","utf8");
			//res.end() should always be called after you finish operating res
			res.end(()=>{
				console.log("res finished");
			});
		}
	}
});


server.listen(3000);
console.log("server started");
