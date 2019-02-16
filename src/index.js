import React from 'react';
import ReactDOM from 'react-dom';
import {Line} from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import Toggle from 'react-toggle';
import GoogleLogin from 'react-google-login';
import "react-datepicker/dist/react-datepicker.css";
import "./toggle.css";
import './index.css';


const data = {
  labels: [], // Labels to update
  datasets: [
    {
      label: 'Test',
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
  ]
};

// Parse a date object into the format we need for the datastore
const parseDate = (d) => {
  if (d == null) return parseDate(new Date())
  return d.getFullYear() + "-" 
        + (d.getMonth() + 1).toString().padStart(2, '0') + "-"
        + d.getDate().toString().padStart(2, '0') + "T" 
        + d.getHours().toString().padStart(2, '0') + ":" 
        + d.getMinutes().toString().padStart(2, '0') + ":" 
        + d.getSeconds().toString().padStart(2, '0') + "." 
        + d.getMilliseconds().toString().padStart(3, '0') + "Z";
}

// Our graph container to hold all our objects, and also
// to store state of our objects
class GraphContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: new Date(),
      endTime: new Date(),
      current: false,
      loggedIn: false,
      animations: true
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
      this.interval = setInterval(() => this.getData(), 1500);
    } else {
      this.setState({
        current: false
      })
      clearInterval(this.interval);
      this.handleChangeEnd(new Date());
    }
  }

  // POST using OAuth creds to retrieve datastore based on time
  getData = () => {
    fetch('https://datastore.googleapis.com/v1/projects/ubc-supermileage-telemetry-v2:runQuery?prettyPrint=true&alt=json', {
      method: 'POST',
      headers: {
        'Authorization' : 'Bearer ' + this.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gqlQuery: {
          queryString: "SELECT * FROM ParticleEvent WHERE ParticleEvent.published_at >= '" 
          + parseDate(this.state.startTime) + ((this.state.current) ? "'" : ("' AND ParticleEvent.published_at <= '"
          + parseDate(this.state.endTime) + "'")),
          allowLiterals: true
        }
      })
  }).then(val => val.json().then(e => {
    console.log(e.batch.entityResults);
    console.log(e);
  }));
  }

  // OAuth authorized, do stuff
  responseGoogle = (response) => {
    this.setState({
      loggedIn: true
    });
    console.log(response);
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
      console.log("rerendering");
      return (<div><div className="header">
        <DayRange 
        startVal = {this.state.startTime}
        endVal = {this.state.endTime}
        onChangeStart = {this.handleChangeStart}
        onChangeEnd = {this.handleChangeEnd}
        isCurrent = {this.state.current}
        isCurrentHandler = {this.handleCurrent}
      />
      {
        (this.state.current) ? 
        "" : this.buttonInit()
      }
      </div>
      <Graph 
        animations = {this.state.animations}
      /></div>);
    }
  }
}

/**
 * Component that holds our graph object. 
 */
class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.val = 1;
    this.state = data;
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      let newLabels = (this.state.labels.length > 10) ?
            this.state.labels.slice() : this.state.labels.slice();
      let oldData = this.state.datasets[0];
      var newData = {
        ...oldData
      };
      newData.data = (oldData.data.length > 10) ? 
              oldData.data.slice() : oldData.data.slice();
      newLabels.push(this.val);
      this.val++;
      newData.data.push(Math.random());
      this.setState({
        labels: newLabels,
        datasets: [newData]
      });
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  render = () => {
    return (<div>
      <Line 
        data = {this.state}
        options={{
          animation: (this.props.animations) ? {
            duration : 500,
          } : false
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
    return (<div id="pickers">{" Start "} <DatePicker
        selected={this.props.startVal}
        selectsStart
        showTimeSelect
        timeIntervals={15}
        startDate={this.props.startVal}
        endDate={this.props.endVal}
        onChange={this.props.onChangeStart}
        dateFormat="MMMM d h:mm:ss aa"
        />
        {" End "} 
        <DatePicker 
        selected={this.props.endVal}
        placeholderText="Current"
        selectsEnd
        showTimeSelect
        timeIntervals={15}
        startDate={this.props.startVal}
        endDate={this.props.endVal}
        onChange={this.props.onChangeEnd}
        dateFormat="MMMM d h:mm:ss aa"
        >
        <div>
          <label>
          <Toggle 
            defaultChecked={this.props.isCurrent}
            onChange={this.props.isCurrentHandler}
          />
           <span>Get current values</span>
          </label>
        </div>
        </DatePicker></div>);
  }
}

// ========================================

ReactDOM.render(
  <GraphContainer />,
  document.getElementById('root')
);