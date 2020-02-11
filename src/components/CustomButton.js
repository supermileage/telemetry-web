import React from "react";
import { Button, withStyles } from "@material-ui/core";

const customStyle = { button: { width: 80 } };

class CustomButton extends React.Component {
  render = () => {
    const { classes } = this.props;
    return (
      <Button
        className={classes.button}
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

export default withStyles(customStyle)(CustomButton);
