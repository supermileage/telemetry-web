# Telemetry

View the page [here](http://www.supermileage.ca/telemetry-web/). You'll have to log in with the UBCST Google account for verification.

The data is sent to a Pub/Sub listener, which has a cloud function subscribed to it that will push that data to the cloudstore. 

# Build Instructions

1. Clone this repository. 
2. Within the directory, run `npm install` to install dependencies. 
3. Run `npm start` to start the local build server. 

Optionally, `npm run deploy` can be used to update the GitHub Pages site with the latest changes. 

## `config/datasets.js`

Each dataset from the datastore takes the following properties:

`label` - determines the label for the data in the graph (if applicable)  
`id` - the ID (name of the property in the datastore) of the value. This is the same as the yAxes id in options.  
`handler` - the parsing logic for each element of the returned value; it takes a `retval` (which is generally what we'd append to) and `d`, which is the projection element.  
`parser` - the final parser of the retval (array, object, etc) from all the projection queries.  
`element` - the element builder for our react component, takes a data prop (which uses the dataset id as the key when being passed in).  
`options` - for our charts, not necessarily needed (Maps doesn't have it, for example).

## Cloud Resources

In addition to setting up the resources as required by the gcp-deployment-script, we'll need to manually set up our OAuth consent screen (for a clientId), and the Maps JavaScript API (make a key and restrict it to only be able to call from specific referrers for the Maps API specifically).