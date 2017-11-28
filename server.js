var mongo = require('mongodb').MongoClient
require('dotenv').config();
var dataB = process.env.URI
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
        //find the document that has the same tinyurl
        //redirect to the original url
        collection.find().toArray(function(err, items, resObj){
                if (err) throw err
                var match, matchId
                var smallUrl = "https://" + req.hostname +"/new/"+ req.params.url
                console.log("Small url is "+smallUrl)
                console.log(items)

                for(var x = 0; x< items.length;x++){
                    if(items[x].tinyurl == smallUrl){
                        console.log(items[x].tinyurl)
                        match = true
                        matchId = items[x].id
                        }
                    }
                    console.log(items[matchId].originalurl)

                    res.redirect('https://'+items[matchId].originalurl)
        })


        //res.redirect('http://cnn.com/');
        //console.log(req.params.url)
    })

}

var createTiny = function(collection){
    app.get('/:query', function (req, res) {

        var originalurl = req.params.query
        var shorturl = "https://"+req.host + "/new/";

        console.log(req.params.query)

        //if it's not a url -- send error message
        if(validUrl(req.params.query)){


            //if url doesn't exist -- create new entry
            //does the url exist in the database
            var match = false

            collection.find().toArray(function(err, items, resObj){
                if (err) throw err
                var matchId
                for(var x = 0; x< items.length;x++){
                    if(items[x].originalurl == originalurl){
                        console.log(items[x].tinyurl)
                        match = true
                        matchId = items[x].id
                        }
                    }

                if(match > 0){
                    console.log('it already exists \n')
                    console.log(items[matchId])
                    var resObj = {
                        "error": "url already exists",
                        "originalurl": originalurl,
                        "tinyurl": items[matchId].tinyurl
                    }

                    //it exists so find it in the database and return the results
                    res.send(resObj)
                    }
                else{
                    console.log('adding url to database')
                    //add a unique shorturl
                    var count = 0

                    for(var y=0;y< items.length;y++){
                        count++
                    }
                    console.log('count: ' + count)
                    shorturl += count
                    console.log(shorturl)
                    console.log('count is: '+ count)

                    collection.insert(
                        {
                            "originalurl": originalurl,
                            "tinyurl": shorturl,
                            "id":count

                        })
                        var resObj = {
                            "originalurl": originalurl,
                            'shorturl': shorturl
                            }

                        res.send(resObj)
                }
            })
        }
        else{
            //send not a valid url
            var resObj = {
                'error': 'not a valid url -- please retype the url in the proper format.  e.g. http://example.com',
            }
            res.send(resObj)
            console.log('not valid url')
        }

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
