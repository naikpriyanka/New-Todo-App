# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary  
This is a web application named ***TodoApp*** used to create and finish daily tasks/todos. To build this application we have used MEAN (MariaDB/MySQL, Express, Angular, Node) stack.  
1. Storing todos in a MariaDB using MySQL  
2. Using the Express framework  
3. Creating a RESTful Node API  
4. Using Angular for the frontend and to access the API  

* Version

* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Requirements (Software to be installed)  
1. MySQL  
2. Node  
   [Download NodeJS](https://nodejs.org/en/download/)  
   [Steps to Install NodeJS](https://docs.npmjs.com/getting-started/installing-node)  

* Summary of set up  
1. Clone the repo  
2. Inside the Todo-App folder, run  
```
#!python

npm install
```
### In Node, the package.json file holds the configuration for our app. Node’s package manager (npm) will use this to install any dependencies or modules that we are going to use. This command npm will look at this file and install Express and Mongoose. ###

* Configuration  
* **Node Configuration**  
  In our ***package.json*** file, we told it that our main file would be server.js. This is the main file for our Node app and where we will configure the entire application. This is the file where we will:  
  1. Configure our application  
  2. Connect to our database  
  3. Create our MySQL models  
  4. Define routes for our RESTful API  
  5. Define routes for our frontend Angular application  
  6. Set the app to listen on a port so we can view it in our browser  

* **Database configuration**  
* Start the mysql server :  
```
#!python

mysql.server start
```
### Run this command everytime you switch off your computer or server. ###
* To start using mysql/mariadb, run 
```
#!python

mysql -u root
```

* Create a new database :
```
#!python

create database todolist;
```

* Create a table tasksheet : 
```
#!python

create table tasksheet(id int not null auto_increment, title varchar(1024), createdOn timestamp, primary key(id));
```

* Create a table todo : 
```
#!python

create table todo(id int not null auto_increment, task_id int, text varchar(1024), endDate date, done tinyint(1), foreign key(task_id) references tasksheet(id), primary key(id));
```

* Insert data in tasksheet : 
```
#!python

insert into tasksheet(title,createdOn) values('Tasksheet1',now());
```

* Insert data in todo : 
```
#!python

insert into todo(text, endDate, done, task_id) values('Node.js', '2015-11-29', 0, 1);
```

* See the inserted values in todo table : 
```
#!python

select * from todo;
```


* Dependencies

* How to run tests

* Deployment instructions  
Now that we have our package.json and server.js started up, we can start up our server and see what’s going on. Just go into your console and use the following command : 
```
#!python

node server.js
```

Now you have a server listening on port 8080. Run http://localhost:8080 in your browser.

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact