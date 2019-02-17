import React from 'react';
import ReactDOM from 'react-dom';
import {Scatter} from 'react-chartjs-2';
import moment from 'moment';
import {DatetimePickerTrigger} from 'rc-datetime-picker';
import Toggle from 'react-toggle';
import GoogleLogin from 'react-google-login';
import "./datetime.css";
import "./toggle.css";
import './index.css';

const data = {
  // labels: ['Scatter'],
  datasets: [
    {
      showLine: true,
      label: 'Datapoints',
      fill: true,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [] // Data to update
    }
  ],
};

const request = (state) => {
  return (state.current) ? {
    query: {
      filter: {
        propertyFilter: {
          op: "GREATER_THAN_OR_EQUAL",
          property: {
            name: "published_at"
          },
          value: {
            stringValue: state.startTime.toISOString()
          }
        }
      },
      kind: [
        {
          name: "ParticleEvent"
        }
      ],
      projection: [
        {
          property: {
            name: "data"
          }
        },
        {
          property: {
            name: "published_at"
          }
        }
      ],
    }
    } : {
      query: {
        filter: {
          compositeFilter: {
            filters: [
              {
                propertyFilter: {
                  op: "GREATER_THAN_OR_EQUAL",
                  property: {
                    name: "published_at"
                  },
                  value: {
                    stringValue: state.startTime.toISOString()
                  }
                }
              },
              {
                propertyFilter: {
                  op: "LESS_THAN_OR_EQUAL",
                  property: {
                    name: "published_at"
                  },
                  value: {
                    stringValue: state.endTime.toISOString()
                  }
                }
              }
            ],
            op: "AND"
          }
        }
        ,
        kind: [
          {
            name: "ParticleEvent"
          }
        ],
        projection: [
          {
            property: {
              name: "data"
            }
          },
          {
            property: {
              name: "published_at"
            }
          }
        ]
      }
  }
};

const shortcuts = {
  'Today': moment(),
  'Yesterday': moment().subtract(1, 'days'),
};

// Our graph container to hold all our objects, and also
// to store state of our objects
class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.lastCursor = null;
    this.vals = [];
    this.state = {
      startTime: moment(),
      endTime: moment(),
      current: false,
      loggedIn: false,
      graph: data,
      animations: true,
      updating: false
    }
  }

  // Handle the start time change
  handleChangeStart = (time) => {
    this.setState({
      startTime: time
    })
  }

  // Handle the end time change
  handleChangeEnd = (time) => {
    this.setState({
      endTime: time
    })
  }

  // Handle the current boolean for "live" plotting
  handleCurrent = (e) => {
    let current = e.target.checked;
    if (current) {
      this.setState({
        current: true,
        endTime: null
      })
      this.intervalHandler();
    } else {
      clearTimeout(this.timeout);
      this.setState({
        current: false
      })
      this.handleChangeEnd(moment());
    }
  }

  intervalHandler = () => {
    this.getData().then(() => {
      // Run it again, if current is set
      if (this.state.current) {
        this.timeout = setTimeout(this.intervalHandler, 2000);
      }
    });
  }

  // POST using OAuth creds to retrieve datastore based on time
  // Async means it returns an implicit Promise that we will resolve later
  getDataHandler = async () => {
    // Build our query
    let req = request(this.state);

    // Change our lastCursor value
    if (this.lastCursor !== null) req.query.startCursor = this.lastCursor;
    // Call our fetch
    await fetch('https://datastore.googleapis.com/v1/projects/ubc-supermileage-telemetry-v2:runQuery?prettyPrint=true&alt=json', 
      {
        method: 'POST',
        headers: {
          'Authorization' : 'Bearer ' + this.token,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(req)}).then(val => val.json().then(e => {
        // Try safety
        console.log(e);
        try {
          if ('entityResults' in e.batch) {
            console.log()
            if (this.lastCursor === null) {
              this.vals = [];
            } else {
              this.vals = this.vals.slice(); // Return a copy
            }
            e.batch.entityResults.forEach(d => {
              let elem = {};
              elem.y = parseFloat(d.entity.properties.data.stringValue);
              elem.x = moment(d.entity.properties.published_at.stringValue).unix()
                          -this.state.startTime.unix(); // Return value since num
              elem.t = moment(d.entity.properties.published_at.stringValue);
              this.vals.push(elem);
            });
          } else {
            // Clear our values
            this.vals = [];
          }
          if (e.batch.moreResults === "NOT_FINISHED") {
            console.log("Not done");
            this.lastCursor = e.batch.endCursor;
            return this.getDataHandler();
          } else {
            console.log("Done");
            console.log(this.state);
            this.lastCursor = null;
            return true;
          }
        } catch (error) {
          console.log(error);
        }
      }));
  }

  // Handler for our data, which sets up a promise 
  // that updates once our data has been set up
  getData = () => {
    return new Promise(resolve => {
      this.setState({
        updating: true // Set updating to true so we render notice
      })
      this.getDataHandler().then(() => {
        let newData = {
        ...this.state.graph.datasets[0], // Spread operator allows us to copy things
        data: this.vals
        };
        this.setState({
          graph: {
            datasets: [newData]
          },
          updating: false // done updating
        });
        resolve();
      });
    });
  }

  // OAuth authorized, do stuff
  responseGoogle = (response) => {
    this.setState({
      loggedIn: true
    });
    console.log(response);
    console.log("Success");
    this.token = response.accessToken;
  }

  // OAuth failed, don't do stuff
  responseFail = (response) => {
    console.log(response);
    console.log("Failed");
  }

  buttonInit = () => {
      return (<span className="updateButton">
        <button onClick={this.getData}>Update</button>
      </span>);
  }

  // Render element based on logged in state
  render() {
    if (!this.state.loggedIn) {
      return (<div className="login">
        <GoogleLogin
          clientId = "617338661646-v92ol8vhd4nl44vpntkv4jpjbq5hahmo.apps.googleusercontent.com"
          buttonText = "Login"
          onSuccess = {this.responseGoogle}
          onFailure = {this.responseFail} 
        /></div>);
    } else {
      return (<div><div className="header">
        <DayRange 
          startVal = {this.state.startTime}
          endVal = {this.state.endTime}
          onChangeStart = {this.handleChangeStart}
          onChangeEnd = {this.handleChangeEnd}
        />
        <label className="toggle">
          <Toggle 
            defaultChecked = {this.state.current}
            onChange = {this.handleCurrent}
          />
        </label>
      {
        (this.state.current) ? 
        "" : this.buttonInit()
      }
      {
        (this.state.updating) ?
        <div className="updating">Updating..</div> : ""
      }
      </div>
      <Graph
        data = {this.state.graph}
        animations = {this.state.animations}
      /></div>);
    }
  }
}

/**
 * Component that holds our graph object. 
 */
class Graph extends React.Component {
  render = () => {
    return (<div>
      <Scatter 
        data = {this.props.data}
        options={{
          animation: ((this.props.animations) ? {
            duration : 500,
          } : false),
          scales : {
            xAxes: [{
              type: 'time',
              time: {
                unit: 'second'
              }
            }]
          }
        }}
      />
    </div>);
  }
}


class DayRange extends React.Component {
  // Render my pickers; all the state is lifted up into 
  // the parent element, thus all the changes are handled
  // by props; this element does not have state
  render() {
    return (<div className="pickers">
        <DatetimePickerTrigger
          shortcuts = {shortcuts}
          moment = {this.props.startVal}
          onChange = {this.props.onChangeStart}>
          <input type="text" value={this.props.startVal.format('YYYY-MM-DD HH:mm')} readOnly />
        </DatetimePickerTrigger>
        {' - '}
        <DatetimePickerTrigger
          shortcuts = {shortcuts}
          moment = {this.props.endVal}
          onChange = {this.props.onChangeEnd}
          disabled = {(this.props.endVal === null) ? true : false}>
          <input 
            type = "text" 
            value = {(this.props.endVal === null) ?
              "Current" : this.props.endVal.format('YYYY-MM-DD HH:mm')} 
            readOnly
            disabled = {(this.props.endVal === null) ? true : false}
          />
        </DatetimePickerTrigger>
        </div>);
  }
}

// ========================================

ReactDOM.render(
  <GraphContainer />,
  document.getElementById('root')
);