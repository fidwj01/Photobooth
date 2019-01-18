
/* This server, unlike our previous ones, uses the express framework */
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database('photos.db');
var express = require('express');
var formidable = require('formidable');  // we upload images in forms
// this is good for parsing forms and reading in the images

var port = process.env.PORT || 3000;
var LIVE = true;
var request = require('request');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// make a new express server object
var app = express();

// Now we build a pipeline for processing incoming HTTP requests

// Case 1: static files
app.use(express.static('public')); // serve static files from public
// if this succeeds, exits, and rest of the pipeline does not get done

// Case 2: queries
// An example query URL is "138.68.25.50:???/query?img=hula"
app.get('/query', function (request, response){
    console.log("query");
    query = request.url.split("?")[1]; // get query string
    var check = query.split("=")[0];
    var labeladd = query.split("!")[0];
    if(query=="getall"){
        sendall(query,response);
    }
    if (check == "favorite"){
        if(query.split("=")[1]=="all"){
            favoriteAll(query,response);
        }
        else {
            favorite(query,response,query.split("=")[1]);
        }
    }
    if(labeladd == "LabelADD"){
        var xx = query.split("!")[1];
        var name = xx.split("=")[0];
        var tag  = xx.split("=")[1];
        LabelAdd(tag,response,name);
    }
    if(labeladd == "LabelDelete"){
        var xx = query.split("!")[1];
        var name = xx.split("=")[0];
        var tag  = xx.split("=")[1];
        LabelDelete(tag,response,name);
    }
    if(check == "Labelfind"){
        var tag = query.split("=")[1];
        findTag(tag,response);
    }
    if(check == "GetLabels"){
        GetLabels(query.split("=")[1],response);
    }
    if(check == "favoriteFind"){
        favoritefind(query.split("=")[1],response);
    }
    if(check == "google"){
        google(query.split("=")[1],response);
    }

    });

// Case 3: upload images
// Responds to any POST request
app.post('/', function (request, response){
    var stringname;
    var form = new formidable.IncomingForm();
    form.parse(request); // figures out what files are in form

    // callback for when a file begins to be processed
    form.on('fileBegin', function (name, file){
	// put it in /public
    stringname = file.name;
	file.path = __dirname + '/public/' + file.name;
	console.log("uploading ",file.name,name);
    });

    // callback for when file is fully recieved
    form.on('end', function (){
	console.log('success');
    db.run('INSERT OR REPLACE INTO PhotoLabels VALUES (?,"","0")', [stringname]);
	sendCode(201,response,'recieved file');  // respond to browser
    });

});

// You know what this is, right?
app.listen(port);

// sends off an HTTP response with the given status code and message
function sendCode(code,response,message) {
    response.status(code);
    response.send(message);
}

// Stuff for dummy query answering
// We'll replace this with a real database someday!
// function answer(query, response) {
// var labels = {hula:
// "Dance, Performing Arts, Sports, Entertainment, Quinceañera, Event, Hula, Folk Dance",
// 	      eagle: "Bird, Beak, Bird Of Prey, Eagle, Vertebrate, Bald Eagle, Fauna, Accipitriformes, Wing",
// 	      redwoods: "Habitat, Vegetation, Natural Environment, Woodland, Tree, Forest, Green, Ecosystem, Rainforest, Old Growth Forest"};

//     console.log("answering");
//     kvpair = query.split("=");
//     labelStr = labels[kvpair[1]];
//     if (labelStr) {
// 	    response.status(200);
// 	    response.type("text/json");
// 	    response.send(labelStr);
//     } else {
// 	    sendCode(400,response,"requested photo not found");
//     }
// }

function sendall(query, response){
    function dataCall(err, rowdata){
        console.log(rowdata);
        response.status(200);
        response.type("text/json");
        response.send(rowdata);
    }

     db.all('SELECT * FROM PhotoLabels', dataCall);
}

function favorite(query,response,name){
    function dataCall(err,rowdata){
        console.log(rowdata);
        response.status(200);
        response.type("text/json");
        rowdata = JSON.stringify(rowdata);
        rowdata = JSON.parse(rowdata);
        console.log(rowdata);
        response.send(""+rowdata[0].favorite+"");
        if(rowdata[0].favorite == 0){
             db.run('UPDATE PhotoLabels SET favorite = 1 WHERE fileName = "'+ name + '"');
        }
        else{
            db.run('UPDATE PhotoLabels SET favorite = 0 WHERE fileName = "'+ name + '"');
        }
    }
    var n = name.search("%20");
    while(n!=-1){
        name = name.replace("%20"," ");
        n = name.search("%20");
    }
    name = name.trim();

    db.all('SELECT * FROM PhotoLabels WHERE fileName = "'+ name + '"',dataCall);

}

function favoriteAll(query,response){
    function dataCall(err, rowdata){
        console.log(rowdata);
        response.status(200);
        response.type("text/json");
        rowdata = JSON.stringify(rowdata);
        rowdata = JSON.parse(rowdata);
        response.send(rowdata);
    }

     db.all('SELECT fileName FROM PhotoLabels WHERE favorite = 1', dataCall);
}

function LabelAdd(tag,response,name){
    function dataCall(err, rowdata){
        rowdata = JSON.stringify(rowdata);
        rowdata = JSON.parse(rowdata);
        console.log(rowdata[0].labels);
        if (rowdata[0].labels == "" ){

            db.run('UPDATE PhotoLabels SET labels = "'+tag+'" WHERE fileName = "'+ name + '"');
            console.log(tag);
        }
        else{

            var string=rowdata[0].labels;
            tag = string + "," + tag;
            console.log(tag);
            db.run('UPDATE PhotoLabels SET labels = "'+tag+'" WHERE fileName = "'+ name + '"');
        }
    }

    var n = name.search("%20");
    while(n!=-1){
        name = name.replace("%20"," ");
        n = name.search("%20");
    }
    n = tag.search("%20");
    while(n!=-1){
        tag = tag.replace("%20"," ");
        n = tag.search("%20");
    }
    name = name.trim();
    tag = tag.trim();
    db.all('SELECT labels FROM PhotoLabels WHERE fileName = "'+ name + '"',dataCall);
    response.send("done");
}

function LabelDelete(tag,response,name){
    function dataCall(err, rowdata){
        rowdata = JSON.stringify(rowdata);
        rowdata = JSON.parse(rowdata);
        console.log(rowdata[0].labels);
        var data = rowdata[0].labels.split(",");
        var g = 0;
        for (i in data){
            if(data[i]==tag && g == 0){
                data[i] = "";
                g =1;
            }
        }
        for (i in data){
            console.log(i);
            console.log(data[i]);
        }
        var newtag="";
        for (i in data){
            if(data[i]==""){
                newtag=newtag;
            }
            else{
                if (newtag==""){
                    newtag = "" + data[i];
                }
                else{
                    newtag = newtag +","+data[i];
                }
            }
        }
        db.run('UPDATE PhotoLabels SET labels = "'+newtag+'" WHERE fileName = "'+ name + '"');

    }

    var n = name.search("%20");
    while(n!=-1){
        name = name.replace("%20"," ");
        n = name.search("%20");
    }
    n = tag.search("%20");
    while(n!=-1){
        tag = tag.replace("%20"," ");
        n = tag.search("%20");
    }
    name = name.trim();
    tag = tag.trim();
    db.all('SELECT labels FROM PhotoLabels WHERE fileName = "'+ name + '"',dataCall);
    response.send("done");
}


function findTag(tag,response){
    function dataCall(err, rowdata){
        rowdata = JSON.stringify(rowdata);
        rowdata = JSON.parse(rowdata);
        console.log(rowdata);
        var filenames = "";
        for (x in rowdata){
            var g = rowdata[x].labels;
            var labelarray = g.split(",");
            var found = 0;
            for (i in labelarray){
                if (tag == labelarray[i]){
                    found =1;
                }
            }
            if (found==1){
                filenames = filenames + " || " + rowdata[x].fileName;
             }
        }
        console.log(filenames);
        response.status(200);
        response.type("text/json");
        response.send(filenames);

    }

    var n = tag.search("%20");
    while(n!=-1){
        tag = tag.replace("%20"," ");
        n = tag.search("%20");
    }
    tag = tag.trim();
    db.all('SELECT * FROM PhotoLabels', dataCall);

}

function GetLabels(name,response){
    function dataCall(err, rowdata){
        rowdata = JSON.stringify(rowdata);
        rowdata = JSON.parse(rowdata);
        console.log(rowdata[0].labels);
        response.status(200);
        response.type("text/json");
        response.send(rowdata[0].labels);

    }

    var n = name.search("%20");
    while(n!=-1){
        name = name.replace("%20"," ");
        n = name.search("%20");
    }
    name = name.trim();
    db.all('SELECT labels FROM PhotoLabels WHERE fileName = "'+ name + '"',dataCall);

}

function favoritefind(name,response){
    function dataCall(err, rowdata){
        console.log(rowdata);
        response.status(200);
        response.type("text/json");
        rowdata = JSON.stringify(rowdata);
        rowdata = JSON.parse(rowdata);
        response.send(rowdata[0]);
    }

    var n = name.search("%20");
    while(n!=-1){
        name = name.replace("%20"," ");
        n = name.search("%20");
    }
    name = name.trim();
    console.log(name);
    db.all('SELECT * FROM PhotoLabels WHERE fileName = "'+ name + '"',dataCall);
}

function google(name,response){
    var n = name.search("%20");
    while(n!=-1){
        name = name.replace("%20"," ");
        n = name.search("%20");
    }
    name = name.trim();
    console.log("this is the name inside the google function" + name);

    requestObject = {
      "requests": [
      {
       "image": {
        "source": {"imageUri": "http://138.68.25.50:12499/"+name}
    },
    "features": [{ "type": "LABEL_DETECTION" }]
    }
    ]
    }

    url = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyACqsyW_HpLNIVnYXUQRRNKWfTptmLMFb8';
    annotateImage();

function annotateImage() {
    if (LIVE) {
    // The code that makes a request to the API
    // Uses the Node request module, which packs up and sends off
    // an XMLHttpRequest.
    request(
        { // HTTP header stuff
        url: url,
        method: "POST",
        headers: {"content-type": "application/json"},
        // stringifies object and puts into HTTP request body as JSON
        json: requestObject,
        },
        // callback function for API request
        APIcallback
    );
    } else {  // not live! return fake response
    // call fake callback in 2 seconds
    console.log("not live");
    setTimeout(fakeAPIcallback, 2000);
    }
}

// live callback function
function APIcallback(err, APIresponse, body) {
    if ((err) || (APIresponse.statusCode != 200)) {
    console.log("Got API error");
    } else {
    APIresponseJSON = body.responses[0];
    var info = APIresponseJSON;

db.all('SELECT labels FROM PhotoLabels WHERE fileName = "'+ name + '"',dataCall);

    function dataCall(err, rowdata){
        rowdata = JSON.stringify(rowdata);
        rowdata = JSON.parse(rowdata);
        console.log(rowdata[0].labels);
        var string = "";
        for (i in info.labelAnnotations){
            if(i==0){
                string = string + info.labelAnnotations[i].description;
            }
            else{
                string = string + "," + info.labelAnnotations[i].description;
            }
        }

        if (rowdata[0].labels == "" ){

            db.run('UPDATE PhotoLabels SET labels = "'+string+'" WHERE fileName = "'+ name + '"');
            console.log(string);
        }
        else{

            string = rowdata[0].labels + "," + string;
            console.log(string);
            db.run('UPDATE PhotoLabels SET labels = "'+string+'" WHERE fileName = "'+ name + '"');
        }

    }

    response.send(APIresponseJSON);
    console.log(info);
    }
}

// fake callback function
function fakeAPIcallback() {
    console.log("fake");

    console.log( ` { labelAnnotations:    [ { mid: '/m/026bk', description: 'fakeLabel1', score: 0.89219457 },
     { mid: '/m/05qjc',
       description: 'fakeLabel2',
       score: 0.87477195 },
     { mid: '/m/06ntj', description: 'fakeLabel3', score: 0.7928342 },
     { mid: '/m/02jjt',
       description: 'fakeLabel4',
       score: 0.7739482 },
     { mid: '/m/02_5v2',
       description: 'fakeLabel5',
       score: 0.70231736 } ] }` );
}

}
//AIzaSyACqsyW_HpLNIVnYXUQRRNKWfTptmLMFb8
