import { Scatter } from "react-chartjs-2";
import React, { Fragment } from "react";

/**
 * Component that holds our graph object.
 */
export default class Graph extends React.Component {
  render = () => {
    return (
      <Fragment>
        <Scatter data={this.props.data} options={this.props.options} />
      </Fragment>
    );
  };
}
