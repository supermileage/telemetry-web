import React from "react";

export default class Button extends React.Component {
  render = () => {
    return this.props.liveMode || this.props.updating ? (
      <button
        className="button is-rounded is-info is-small is-loading"
        onClick={this.props.getDataHandler}
        disabled
      >
        Update
      </button>
    ) : (
      <button
        className="button is-rounded is-info is-small"
        onClick={this.props.getDataHandler}
      >
        Update
      </button>
    );
  };
}
