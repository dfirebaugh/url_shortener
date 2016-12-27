var mongo = require('mongodb').MongoClient
var dataB = 'mongodb://localhost:27017/tiny'
var express = require('express')
var app = express()

var port = process.env.PORT || 8800

mongo.connect(dataB, function(err,db){
    if (err) throw err
    
    db.createCollection("urls", {
        capped: true,
        size: 5242880,
        max: 5000
        });
        
    var collection = db.collection('urls')
    
    createTiny(collection)
    redirect(collection)
})

var redirect = function(collection){
    app.get('/new/:url*',function(req,res){
        //handle redirect here.
        //make a connection to the document
        //find the document that has the same tinyurl
        //redirect to the original url
        
        
        //res.redirect('http://cnn.com/');
        console.log(req.params.url)
    })
    
}

var createTiny = function(collection){
    app.get('/:query', function (req, res) {
        
        var originalurl = req.params.query
        var shorturl = "https://"+req.host + "/new/1";

        console.log(req.params.query)
        
        //if it's not a url -- send error message
        if(validUrl(req.params.query)){
            var resObj = {
                "originalurl": originalurl,
                'shorturl': shorturl,
            }

            //if url doesn't exist -- create new entry
            //does the url exist in the database
            var match = false
            
            collection.find().toArray(function(err, items){
                if (err) throw err 
                
                for(var x = 0; x< items.length;x++){
                    if(items[x].originalurl == originalurl){
                        console.log(items[x].tinyurl)
                        match = true
                        
                    }
                    
                }
                
                if(match > 0){
                    console.log('it already exists \n')
                    
                }
                else{
                    console.log('adding url to database')
                    //add a unique shorturl
                    
                    collection.insert(
                        {
                            "originalurl": originalurl,
                            "tinyurl": shorturl
                            
                        })
                    
                }
                
            })
            }
        else{
            var resObj = {
                'error': 'not a valid url',
            }
            console.log('not valid url')
        }
        
        res.send(resObj)
        //console.log(resObj)
            

        

  })
}


app.listen(port, function () {
  console.log('listening on port: '+ port)
})



function validUrl(str) {
    var regex = /(https?:\/\/)?(([a-z\d]([a-z\d-]*[a-z\d])*)\.)+([a-z]{2,})/ig
    
  if(!regex.test(str)) {
    console.log("Please enter a valid URL.");
    return false;
    }
    else {
      return true;
      }
}