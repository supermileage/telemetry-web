import config from "./config/config.js";
import GoogleLogin from "react-google-login";
import AppContainer from "./components/AppContainer.js";
import React from "react";
import {
  CssBaseline,
  Container,
  Grid,
  withStyles
} from "@material-ui/core";

const customStyle = {
  root: {
    paddingTop: 200
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  render = () => {
    const { classes } = this.props;
    return (
      <CssBaseline>
        {this.state.loggedOn ? (
          <AppContainer token={this.state.token} />
        ) : (
          <Container maxWidth="xs" className={classes.root}>
            <Grid container spacing={2} justify="center" alignItems="center">
              <Grid container justify="center">
                <Grid item>
                  <GoogleLogin
                    clientId={config.oauth.clientId}
                    scope="profile email https://www.googleapis.com/auth/datastore"
                    buttonText="Login"
                    onSuccess={this.oauthSuccess}
                    onFailure={this.oauthFailure}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Container>
        )}
      </CssBaseline>
    );
  };
}

export default withStyles(customStyle)(App);
