# Telemetry

View the page [here](http://www.supermileage.ca/telemetry-web/). You'll have to log in with the UBCST Google account for verification.

The data is sent to a Pub/Sub listener, which has a cloud function subscribed to it that will push that data to the cloudstore. 

# Build Instructions

1. Clone this repository. 
2. Within the directory, run `npm install` to install dependencies. 
3. Run `npm start` to start the local build server. 

Optionally, `npm run deploy` can be used to update the GitHub Pages site with the latest changes. 