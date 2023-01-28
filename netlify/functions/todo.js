const fetch = require("node-fetch");
const API_ENDPOINT = process.env.demo_endpoint;

exports.handler = async (event, context) => {
//console.log(`{\ncontext: ${JSON.stringify(context,null,2)},\nevent: ${JSON.stringify(event,null,2)}\n}`);
const ipa = event.headers['x-nf-client-connection-ip'];
const ip = ipa.replace(/\./g, '').replace(/\:/g, '');	


	if (event.httpMethod == "GET") {	
	
	const QData = `[{"query":{"sfsql":"SELECT  $o:.${ip}.todos.oid() as oid, $s:.${ip}.todos.name as name, $b:.${ip}.todos.completed as completed,$$s:.${ip}.todos.desc as desc ORDER BY oid DESC"}}]`;
		 
				return fetch(API_ENDPOINT, {
					  headers: {
							"content-type": "application/json",
							"x-sfsql-apikey": process.env.demo_api_key
						  }, 
						  method: "POST",
						  body: QData,
					  })
					 .then((response) => response.json())
					 .then((data) => ({
						statusCode: 200,
						body:JSON.stringify(data),
					 }))
					 .catch((error) => ({ statusCode: 422, body: String(error) }));
		 	 
	}else{
			const updatedtodo = JSON.parse(event.body)
			const oid = updatedtodo.todos.oid;
		        delete updatedtodo.todos.oid;
			const todostring=JSON.stringify(updatedtodo.todos);
			console.log(todostring);
			const putData = `[{"modify":{"data":{"o:cftodos":{"${ip}":{"todos":[{"#set":{"where":"$o:todos.oid()=${oid}"}},${todostring}]}}}}},{"query":{"sfsql":"SELECT  $o:.${ip}.todos.oid() as oid, $s:.${ip}.todos.name as name, $b:.${ip}.todos.completed as completed,$$s:.${ip}.todos.desc as desc ORDER BY oid DESC"}}]`
			return fetch(API_ENDPOINT, {
					  headers: {
							"content-type": "application/json",
							"x-sfsql-apikey": process.env.demo_api_key
						  }, 
						  method: "POST",
						  body: putData,
					  })
					 .then((response) => response.json())
					 .then((data) => ({
						statusCode: 200,
						body:JSON.stringify(data),
					 }))
					 .catch((error) => ({ statusCode: 422, body: String(error) }));
			
			
		} 
	  
	 
};	 
