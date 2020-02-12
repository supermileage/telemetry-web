import React from "react";
import config from "../config/config.js";
import moment from "moment";

import "ol/ol.css";
import * as ol from "ol";
import * as layer from "ol/layer";
import * as proj from "ol/proj";
import * as geom from "ol/geom";
import * as style from "ol/style";
import * as source from "ol/source";
import * as control from "ol/control";

/**
 * Component that holds our map.
 */
export default class MapContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.features = {};
    this.state = {
      map: null,
      loaded: false,
      height: 0
    };
  }

  clearFeature = feature => {
    if (this.features[feature]) {
      this.features[feature]
        .getSource()
        .getFeatures()
        .forEach(feat =>
          this.features[feature].getSource().removeFeature(feat)
        );
    }
  };

  formatCoordinate = coord => {
    return proj.fromLonLat([coord.lng, coord.lat]);
  };

  componentDidMount = () => {
    window.addEventListener("resize", this.resizeListener);
    this.setState(
      {
        height: document.getElementById("map").clientWidth * 0.5
      },
      () => {
        let map = new ol.Map({
          view: new ol.View({
            center: this.formatCoordinate(config.map.defaults.center),
            zoom: config.map.defaults.zoom
          }),
          layers: [
            new layer.Tile({
              source: new source.OSM()
            })
          ],
          controls: control
            .defaults()
            .extend([new control.FullScreen(), new control.ScaleLine()]),
          target: "map"
        });

        this.setState(
          {
            map: map,
            loaded: true
          },
          this.bootstrapOverlay
        );
      }
    );
  };

  resizeListener = () => {
    this.setState({
      height: document.getElementById("map").clientWidth * 0.5
    });
  };

  componentWillUnmount = () => {
    window.removeEventListener("resize", this.resizeListener);
    this.features = {};
    this.setState({
      map: null,
      loaded: false,
      height: 0
    });
  };

  bootstrapOverlay = () => {
    this.features.overlay = new ol.Overlay({
      element: document.getElementById("popup"),
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    this.state.map.addOverlay(this.features.overlay);

    this.state.map.on("pointermove", e => {
      if (this.state.map.hasFeatureAtPixel(e.pixel) === true) {
        let features = this.state.map.getFeaturesAtPixel(e.pixel);
        if (features.length < 5) {
          features.forEach(feature => {
            if (feature.get("name") === "point") {
              document.getElementById("popup-content").innerHTML = `<b>${moment(
                feature.get("timestamp")
              ).format("HH:mm:ss A")}</b>`;
              this.features.overlay.setPosition(e.coordinate);
            }
          });
        }
      } else {
        this.features.overlay.setPosition(undefined);
      }
    });
  };

  centerMap = () => {
    if (this.props.data && this.props.data.length > 0) {
      this.state.map
        .getView()
        .setCenter(
          this.formatCoordinate(this.props.data[this.props.data.length - 1])
        );
    }
  };

  drawLineOnMap = () => {
    if (this.props.data && this.props.data.length > 0) {
      if (this.features.lines) {
        this.clearFeature("lines");
      }
      let feature = new ol.Feature({
        geometry: new geom.LineString(
          this.props.data.map(e => this.formatCoordinate(e))
        ),
        name: "lines"
      });
      this.features.lines = new layer.Vector({
        source: new source.Vector({
          features: [feature]
        })
      });
      feature.setStyle(
        new style.Style({ stroke: new style.Stroke({ width: 4 }) })
      );
      this.state.map.addLayer(this.features.lines);
    } else {
      // Clear the map property from the line
      this.clearFeature("lines");
    }
  };

  drawMarkersOnMap = () => {
    if (this.props.data && this.props.data.length > 0) {
      if (this.features.markers) {
        this.clearFeature("markers");
      }
      let features = [];
      this.props.data.forEach(e => {
        features.push(
          new ol.Feature({
            geometry: new geom.Point(this.formatCoordinate(e)),
            name: "point",
            timestamp: e.timestamp
          })
        );
      });

      this.features.markers = new layer.Vector({
        source: new source.Vector({
          features
        })
      });

      this.state.map.addLayer(this.features.markers);
    } else {
      this.clearFeature("markers");
    }
  };

  render = () => {
    if (this.state.loaded) {
      this.drawLineOnMap();
      this.drawMarkersOnMap();
      this.centerMap();
    }
    return (
      <div id="map" style={{ height: this.state.height }}>
        <div
          id="popup"
          style={{
            backgroundColor: "white",
            border: "1px solid white",
            borderRadius: "8px"
          }}
        >
          <div id="popup-content"></div>
        </div>
      </div>
    );
  };
}
