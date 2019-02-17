# Telemetrics

View the page [here](http://www.supermileage.ca/telemetrics-view/). You'll have to log in with the UBCST Google account for verification.

Note that, at the moment, a Google Cloud instance needs to be spun up to run our Node script to connect Pub/Sub with Datastore. Otherwise data won't update.

# Build Instructions

1. Clone this repository. 
2. Within the directory, run `npm install` to install dependencies. 
3. Run `npm start` to start the local build server. 

Optionally, `npm run deploy` can be used to update the GitHub Pages site with the latest changes. 