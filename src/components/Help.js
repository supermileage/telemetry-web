import React, { Fragment } from "react";
import { Snackbar, IconButton, Button } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/HelpOutline";

export default class Help extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      helpOpen: false
    };
  }

  closeHelp = () => {
    this.setState({
      helpOpen: false
    });
  };

  openHelp = () => {
    this.setState({
      helpOpen: true
    });
  };

  render = () => {
    return (
      <Fragment>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={this.state.helpOpen}
          message="The start and stop time determine your data time range. 
          The toggle controls whether you'll update the data, live. If you're 
          getting errors, check if you have permissions to view the datastore, 
          or refresh the page. You can expand the panel to select which graphs 
          to show."
          action={
            <Button
              variant="contained"
              color="secondary"
              onClick={this.closeHelp}
            >
              Okay
            </Button>
          }
          onClose={this.closeHelp}
        />

        <IconButton onClick={this.openHelp}>
          <HelpIcon />
        </IconButton>
      </Fragment>
    );
  };
}
