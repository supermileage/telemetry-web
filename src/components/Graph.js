import { Scatter } from "react-chartjs-2";
import React from "react";

/**
 * Component that holds our graph object.
 */
export default class Graph extends React.Component {
  render = () => {
    return (
      <div>
        <Scatter data={this.props.data} options={this.props.options} />
      </div>
    );
  };
}
