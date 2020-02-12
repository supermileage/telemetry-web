import React from "react";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Grid } from "@material-ui/core";
import MomentUtils from "@date-io/moment";

export default class DayRange extends React.PureComponent {
  // Render my pickers; all the state is lifted up into
  // the parent element, thus all the changes are handled
  // by props; this element does not have state
  render = () => {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Grid container spacing={2} alignItems="center" justify="center">
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              fullWidth
              label="Start time"
              format="MMM D, hh:mm a"
              onChange={this.props.onChangeStart}
              value={this.props.startTime}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              fullWidth
              label="End time"
              format="MMM D, hh:mm a"
              onChange={this.props.onChangeEnd}
              value={this.props.endTime}
              emptyLabel="now"
              disabled={this.props.endTime === null}
            />
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    );
  };
}
