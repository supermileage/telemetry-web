import React from "react";
import config from "../config/config.js";

/**
 * Component that holds our Google map.
 */
export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.lines = null;
    this.state = {
      map: null,
      loaded: false
    };
  }

  initMap = () => {
    let map = new window.google.maps.Map(
      document.getElementById("map"),
      config.map.defaults
    );
    this.setState({
      map: map,
      loaded: true
    });
  };

  drawLineOnMap = () => {
    // If there were valid coordinates, do stuff
    if (this.props.data && this.props.data.length > 0) {
      // Center around middle element
      this.state.map.panTo(
        new window.google.maps.LatLng(
          this.props.data[Math.floor(this.props.data.length / 2)].lat,
          this.props.data[Math.floor(this.props.data.length / 2)].lng
        )
      );
      // If no line initialized, initialize it
      if (this.lines === null) {
        // Set the state
        this.lines = new window.google.maps.Polyline({
          path: this.props.data, // This is just an array of coordinates
          map: this.state.map
        });
      } else {
        this.lines.setMap(this.state.map);
        this.lines.setPath(this.props.data);
      }
    } else {
      // Clear the map property from the line
      if (this.lines !== null) {
        this.lines.setMap(null);
      }
    }
  };

  drawMarkersOnMap = () => {
    if (this.props.data && this.props.data.length > 0) {
      this.props.data.map(position => {
        let marker = new window.google.maps.Marker({
          position: position,
          map: this.state.map
        });
        let info = new window.google.maps.InfoWindow({
          content: new Date(position.timestamp).toLocaleTimeString()
        });
        marker.addListener("mouseover", () => {
          info.open(this.state.map, marker);
        });
        marker.addListener("mouseout", function() {
          info.close();
        })
      })
    }
  }

  // Load the Google map script when this component mounts
  componentDidMount = () => {
    window.initMap = this.initMap;
    let tag = document.createElement("script");
    tag.async = true;
    // Loads only from specific endpoints, safe to commit
    tag.src = config.map.getSrcUrl();
    // Append the script
    document.body.appendChild(tag);
  };

  componentWillUnmount = () => {
    document.querySelector(`[src="${config.map.getSrcUrl()}"`).remove();
    window.google.maps = undefined;
  };

  render = () => {
    if (this.state.loaded) {
      this.drawLineOnMap();
      this.drawMarkersOnMap();
    }
    return <div id="map"></div>;
  };
}
