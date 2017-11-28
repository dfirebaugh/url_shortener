### This is a URL shortening api.  

Create a file named .env in the root directory and save the mongodb URI in a variable called URI
e.g. `URI=mongodb://<dbuser>:<dbpassword>@ds8888.mlab.com:21896/url-shortener`

`https://dfire-url-shortener.glitch.me/<url-to-shorten>` will create a new shorter url
e.g. `https://lovely-hygienic.glitch.me/new/2`
Which you can use to redirect to the orirginal url.




### Example Usage

`https://dfire-url-shortener.glitch.me/www.google.com`
will create:
`https://dfire-url-shortener.glitch.me/new/1`
which will redirect to:
`https://google.com`
