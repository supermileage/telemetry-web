import { Scatter } from "react-chartjs-2";
import React from "react";

/**
 * Component that holds our graph object.
 */
export default class Graph extends React.PureComponent {
  render = () => {
    return <Scatter data={this.props.data} options={this.props.options} />;
  };
}
