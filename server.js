var express = require('express');
var favicon = require('serve-favicon');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var nodemailer = require('nodemailer');

var app = express();

app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/gfx')));
app.use(express.static(path.join(__dirname, 'public/thumbnails')));
app.use(express.static(path.join(__dirname, 'public/views')));

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'dawid.skorewicz@gmail.com', // Your email id
        pass: '!Szarawary171!g' // Your password
    }
});

app.get('/content/:selector', function(req,res,next){
    var contents;
    var selector = req.params.selector;
    var filename = path.join(__dirname, "views/" + selector + ".html");
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) {
            var err = new Error();
            err.status = 404;
            next(err);
        }
        else{
            console.log('OK Reading: ' + filename);
            contents = data;
            res.send(contents);
        }
    });
});

app.post('/sendMessage', function(req,res,next){
    var mailOptions = {
        from: req.body.address, // sender address
        to: 'dawid.skorewicz@gmail.com', // list of receivers
        subject: req.body.topic, // Subject line
        html: "<i>You have received e-mail from "+req.body.address+"</i><br><br><b>Message:</b><br><br>"+req.body.message
    };
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.json({yo: 'error'});
        }
        else{
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        };
    });
});

app.get('/projects', function(req,res,next){
    var projects;
    var projectsResult;
    var dbPath = path.join(__dirname, "db/json/db.json");
    fs.readFile(dbPath, 'utf8', function(err, data) {
        if (err) {
            var err = new Error();
            err.status = 404;
            next(err);
        }
        else{
            console.log('OK Reading: ' + dbPath);
            projects = JSON.parse(data);
            projectsResult = parseProjects(projects);
            res.send(projectsResult);
        }
    });
});

app.use(function (err, req, res, next) {
    res.send('<h1 class="col-12 col-m-12 col-p-12">404</h1>This is not a page you are looking for.');
})

app.listen(8080,function(){
    console.log("Listening on port 3000");  
});

function parseProjects(projects){
    var result = "";
    for(var i=0;i<projects.projects.length;i++){
        var project = projects.projects[i];
        result += '<div class="project col-6 col-m-12 col-p-12">';
        result += '<div class="thumbnail" style="background: url('+project.thumbnail+')" onclick="window.open(\''+project.url+'\',\'window\');\"></div>';
        result += '<a class="title" href="'+project.url+'" target="_blank">'+project.name+'</a>';
        result += '<p class="description">'+project.description+'</p>';
        result += '</div>';
    }
    return result;
}