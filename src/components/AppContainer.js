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
  Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const customStyle = theme => ({
  select: {
    minWidth: 120
  },
  container: {
    padding: theme.spacing(2)
  }
});

class AppContainer extends React.Component {
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
      car: undefined
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

    let json = await response.json();

    try {
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
    } catch (error) {
      console.log(error);
    }
    return retval;
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
        datasets: config.datastore.datasets[e.target.value].map(
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

  render = () => {
    const { classes } = this.props;

    return (
      <Fragment>
        <Container className={classes.container}>
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
                        <Switch
                          checked={this.state.liveMode}
                          onChange={this.liveUpdateHandler}
                        />
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
          <Grid container spacing={2}>
            {this.state.car
              ? config.datastore.datasets[this.state.car]
                  .filter(data => this.state.datasets.includes(data.label))
                  .map((dataset, index) => {
                    return (
                      <Grid item xs={12} key={index}>
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
