import React, { Fragment } from "react";
import CustomButton from "./CustomButton.js";
import moment from "moment";
import config from "../config/config.js";
import { queryBuilder } from "../helpers/builders.js";
import DayRange from "./DayRange.js";
import {
  Container,
  Paper,
  Grid,
  Switch,
  MenuItem,
  Select,
  withStyles,
  InputLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Tooltip,
  IconButton,
  Snackbar
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Sizing1Icon from "@material-ui/icons/Filter1";
import Sizing2Icon from "@material-ui/icons/Filter2";
import Sizing3Icon from "@material-ui/icons/Filter3";
import Sizing4Icon from "@material-ui/icons/Filter4";

const customStyle = theme => ({
  select: {
    minWidth: 120
  },
  container: {
    padding: theme.spacing(2)
  }
});

const sizingIcons = {
  1: <Sizing1Icon />,
  2: <Sizing2Icon />,
  3: <Sizing3Icon />,
  4: <Sizing4Icon />
};

class AppContainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startTime: moment(),
      endTime: moment(),
      liveMode: false,
      updating: false,
      dropdownOpen: false,
      datasets: [],
      data: {},
      car: undefined,
      sizing: 1,
      snack: undefined
    };
  }

  // Handler functions for our starttime change, which
  // our dayrange will receieve as a prop
  startTimeChangeHandler = time => {
    this.setState({
      startTime: time
    });
  };

  endTimeChangeHandler = time => {
    this.setState({
      endTime: time
    });
  };

  changeSizing = () => {
    const max = Math.max(...Object.keys(sizingIcons));
    this.setState({
      sizing: this.state.sizing + 1 > max ? 1 : this.state.sizing + 1
    });
  };

  // Handle the current boolean for "live" plotting
  liveUpdateHandler = e => {
    if (e.target.checked) {
      this.setState({
        liveMode: true,
        endTime: null
      });
      this.intervalHandler();
    } else {
      clearTimeout(this.timeout);
      this.setState({
        liveMode: false
      });
      this.endTimeChangeHandler(moment());
    }
  };

  intervalHandler = async () => {
    await this.updateMetrics();
    if (this.state.liveMode) {
      this.timeout = setTimeout(this.intervalHandler, config.refreshInterval);
    }
  };

  getDataHandler = async (lastCursor, retval, datasetId, handler) => {
    try {
      let req = queryBuilder(
        this.state.liveMode,
        this.state.startTime,
        this.state.endTime,
        datasetId
      );

      if (lastCursor !== null) req.query.startCursor = lastCursor;

      let response = await fetch(
        config.datastore.getQueryUrl(),
        config.datastore.generatePayload(this.props.token, JSON.stringify(req))
      );

      if (response.status !== 200) {
        throw new Error("Permisson denied, try refreshing?");
      }

      let json = await response.json();

      if ("entityResults" in json.batch) {
        json.batch.entityResults.forEach(d => {
          handler(retval, d);
        });
      }

      // There are still results remaining
      if (json.batch.moreResults === "NOT_FINISHED") {
        return await this.getDataHandler(
          json.batch.endCursor,
          retval,
          datasetId,
          handler
        );
      }

      return retval;
    } catch (error) {
      this.generateSnack(error.message);
      console.log(error);
    }
  };

  getData = async () => {
    let newData = {};

    if (this.state.car) {
      for (let dataset of config.datastore.datasets[this.state.car]) {
        if (this.state.datasets.includes(dataset.label)) {
          let data = await this.getDataHandler(
            null,
            [],
            dataset.id,
            dataset.handler
          );
          newData[dataset.id] = dataset.parser(data);
        }
      }
    }

    return newData;
  };

  updateMetrics = async () => {
    this.setState({
      updating: true
    });

    let newData = await this.getData();

    this.setState({
      updating: false,
      data: newData
    });
  };

  changeCar = e => {
    if (e.target.value !== this.state.car) {
      this.setState({
        car: e.target.value,
        data: {},
        datasets: (config.datastore.datasets[e.target.value] || []).map(
          data => data.label
        )
      });
    }
  };

  populateCars = () => {
    let ret = [];
    for (let car in config.datastore.datasets) {
      ret.push(
        <MenuItem value={car} key={car}>
          {car}
        </MenuItem>
      );
    }
    return ret;
  };

  modifyDatasets = e => {
    if (e.target.checked) {
      this.state.datasets.push(e.target.value);
      this.setState({
        datasets: this.state.datasets.slice()
      });
    } else {
      this.setState({
        datasets: this.state.datasets.filter(value => value !== e.target.value)
      });
    }
  };

  getCarProperties = () => {
    return this.state.car ? (
      config.datastore.datasets[this.state.car].map(data => {
        return (
          <Grid item key={data.label}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={this.modifyDatasets}
                  value={data.label}
                  checked={this.state.datasets.includes(data.label)}
                ></Checkbox>
              }
              label={data.label}
            ></FormControlLabel>
          </Grid>
        );
      })
    ) : (
      <Typography>You have to select a car first!</Typography>
    );
  };

  generateSnack = snack => {
    this.setState({
      snack: snack
    });
  };

  render = () => {
    const { classes } = this.props;

    return (
      <Fragment>
        <Container className={classes.container}>
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center"
            }}
            open={this.state.snack !== undefined}
            autoHideDuration={5000}
            onClose={() => this.generateSnack(undefined)}
            message={this.state.snack}
          />
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <FormControl
                onClick={e => e.stopPropagation()}
                onFocus={e => e.stopPropagation()}
              >
                <Grid
                  container
                  spacing={1}
                  alignItems="center"
                  justify="flex-start"
                >
                  <Grid item>
                    <DayRange
                      startTime={this.state.startTime}
                      endTime={this.state.endTime}
                      onChangeStart={this.startTimeChangeHandler}
                      onChangeEnd={this.endTimeChangeHandler}
                    />
                  </Grid>
                  <Grid item>
                    <Grid
                      container
                      spacing={1}
                      alignItems="center"
                      justify="flex-start"
                    >
                      <Grid item xs={12} sm="auto">
                        <FormControl>
                          <InputLabel>Car</InputLabel>
                          <Select
                            className={classes.select}
                            label="Car"
                            value={this.state.car || ""}
                            onChange={this.changeCar}
                          >
                            {this.populateCars()}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs="auto" sm="auto">
                        <Tooltip title="Live mode">
                          <Switch
                            checked={this.state.liveMode}
                            onChange={this.liveUpdateHandler}
                          />
                        </Tooltip>
                      </Grid>
                      <Grid item xs="auto" sm="auto">
                        <Tooltip title="Change density">
                          <IconButton onClick={this.changeSizing}>
                            {sizingIcons[this.state.sizing]}
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item xs="auto" sm="auto">
                        <CustomButton
                          liveMode={this.state.liveMode}
                          getDataHandler={this.updateMetrics}
                          updating={this.state.updating}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </FormControl>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={1} alignItems="center" justify="center">
                {this.getCarProperties()}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Container>

        <Container className={classes.container}>
          <Grid container spacing={1} justify="center">
            {this.state.car
              ? config.datastore.datasets[this.state.car]
                  .filter(data => this.state.datasets.includes(data.label))
                  .map((dataset, index) => {
                    return (
                      <Grid
                        item
                        xs={12 / this.state.sizing}
                        key={index + this.state.sizing}
                      >
                        <Paper>
                          {dataset.element(this.state.data[dataset.id])}
                        </Paper>
                      </Grid>
                    );
                  })
              : undefined}
          </Grid>
        </Container>
      </Fragment>
    );
  };
}

export default withStyles(customStyle)(AppContainer);
