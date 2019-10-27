import config from "./config/config.js";
import GoogleLogin from "react-google-login";
import Container from "./components/Container.js";
import React from "react";
import "./css/index.css";
import "bulma/css/bulma.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infoOn: true,
      loggedOn: false,
      token: undefined
    };
  }

  oauthSuccess = response => {
    this.setState({
      loggedOn: true,
      token: response.accessToken
    });
  };

  oauthFailure = response => {
    console.log(response, "Oauth Failed.");
  };

  infoHide = () => {
    this.setState({
      infoOn: false
    });
  };

  render = () => {
    const headerInfo = (
      <div className="container">
        <div className="notification is-info">
          Welcome! If it's your first time here, the toggle sets whether the
          data is updated live. Otherwise, you can grab specific data by
          selecting your time range, then pressing "Update". You may encounter
          errors if you're not authorized to access the datastore. You can close
          this message on the top right.
          <button onClick={this.infoHide} className="delete"></button>
        </div>
      </div>
    );

    const headerLogin = (
      <div className="container notification is-link floater">
        To get started, log in to generate an OAuth token.
      </div>
    );

    return this.state.loggedOn ? (
      <div>
        {this.state.infoOn ? headerInfo : undefined}
        <Container token={this.state.token} />
      </div>
    ) : (
      <div>
        {headerLogin}
        <div className="login">
          <GoogleLogin
            clientId={config.oauth.clientId}
            scope="profile email https://www.googleapis.com/auth/datastore"
            buttonText="Login"
            onSuccess={this.oauthSuccess}
            onFailure={this.oauthFailure}
          />
        </div>
      </div>
    );
  };
}
