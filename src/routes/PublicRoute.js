import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../services/AuthContext';

class PublicRoute extends Component {
  static contextType = AuthContext;

  render() {
    const { currentUser } = this.context;
    const { component: Component, restricted, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={(props) =>
          currentUser && restricted ? (
            <Redirect
              to={{
                pathname: '/volunteer/dashboard',
                state: { from: this.props.location },
              }}
            />
          ) : (
            <Component {...props} />
          )
        }
      />
    );
  }
}

export default PublicRoute;
