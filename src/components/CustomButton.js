import React from "react";
import { Button } from "@material-ui/core";

export default class CustomButton extends React.PureComponent {
  render = () => {
    return (
      <Button
        style={{ width: 80 }}
        variant="contained"
        color="primary"
        disabled={this.props.updating || this.props.liveMode}
        onClick={this.props.getDataHandler}
      >
        {this.props.liveMode ? "Live" : "Update"}
      </Button>
    );
  };
}
