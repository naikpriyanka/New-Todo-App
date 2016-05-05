var mysql = require('mysql');
var path = require('path');

// configuration =================

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'todolist'
});

connection.connect(function(err){
	if(!err) {
    	console.log("Database is connected ... \n\n");  
	} else {
    	console.log("Error connecting database ... \n\n");  
	}
});

function getTodos(res) {
	connection.query('SELECT * from todo', function(err, todos, fields) {
		//connection.end();
  		if (err)
  			console.log(err);
    	res.json(todos);	
  	});
}

//
function getTasksheet(res) {
	connection.query('SELECT * from tasksheet order by createdOn desc LIMIT 5', function(err, tasksheets, fields) {
		//connection.end();
  		if (err)
  			console.log(err);
    	res.json(tasksheets);	
  	});
}

module.exports = function(app) {

	// get all tasksheet
	app.get("/api/tasksheet",function(req,res){
		getTasksheet(res,connection);
	});

	// create tasksheet
    app.post('/api/tasksheet', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        var post = req.body.title;
        connection.query('INSERT into tasksheet(title, createdOn) values("' + post + '", now())', function(err, todos, fields) {
            if (err)
            	console.log(err);
                // res.send(err);

            //get and return all the todos after you create another
            getTasksheet(res);
        });

    });

    // delete a tasksheet
    app.delete('/api/tasksheet/:task_id', function(req, res) {
        var id = req.params.task_id;
        connection.query('DELETE from tasksheet where id = ' + id , function(err, todo) {
            if (err)
                console.log(err);
                
            //get and return all the todos after you create another
            getTasksheet(res);
        });
    });
    
    // update a tasksheet
    app.put('/api/tasksheet/:task_id', function(req, res) {
        var id = req.params.task_id;
        connection.query('UPDATE tasksheet SET createdOn = now() where id = ' + id , function(err, todo) {
            if (err)
                console.log(err);
            //get and return all the todos after you create another
            getTasksheet(res);
        });
    });

	// api ---------------------------------------------------------------------
    // get all todos
    app.get("/api/todos",function(req,res){
		getTodos(res,connection);
	});
	
	app.get("/api/todos/:task_id",function(req,res){
		var id = req.params.task_id;
		connection.query('SELECT * from todo where task_id = ' + id, function(err, todos, fields) {
  			if (err)
  				console.log(err);
    		res.json(todos);	
  		});
	});

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        var post = req.body.text;
        var endDate = req.body.endDate;
        var last_id;
		connection.query('SELECT MAX(id) from tasksheet', function(err, content) {
			if(err)
				console.log(err);
// 			console.log(content[0]['MAX(id)']);
			last_id = content[0]['MAX(id)'];
// 			console.log(last_id);
			connection.query('INSERT into todo(text, endDate, done, task_id) values("' + post + '", "' + endDate + '", 0,' + last_id + ')', function(err, todos, fields) {
			// connection.query('INSERT into todo(text, endDate, done, task_id) values("' + post + '", "' + endDate + '", 0, 1)', function(err, todos, fields) {
            	if (err)
            		console.log(err);

            	// get and return all the todos after you create another
            	getTodos(res);
        	});
		});

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        var id = req.params.todo_id;
        connection.query('DELETE from todo where id = ' + id , function(err, todo) {
            if (err)
                console.log(err);

            // get and return all the todos after you create another
            getTodos(res);
        });
    });
    
    // update a todo
    app.put('/api/todos/:todo_id/:action', function(req, res) {
        var id = req.params.todo_id;
        var action = req.params.action;
        if(action === 'done') {
        	connection.query('UPDATE todo SET done = 1 where id = ' + id , function(err, todo) {
            	if (err)
                	console.log(err);

            	// get and return all the todos after you create another
            	getTodos(res);
        	});
        }
        else {
        	connection.query('UPDATE todo SET done = 0 where id = ' + id , function(err, todo) {
            	if (err)
                	console.log(err);

            	// get and return all the todos after you create another
            	getTodos(res);
        	});
        }
    });

	// application -------------------------------------------------------------
    app.get('*', function(req, res) {
    	res.sendFile(path.resolve('public/index.html'));
        //res.sendFile('index.html', { root: path.join( __dirname, '../public') }); // load the single view file (angular will handle the page changes on the front-end)
    });
    
};	