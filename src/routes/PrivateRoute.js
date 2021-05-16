import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../services/AuthContext';

class PrivateRoute extends Component {
    static contextType = AuthContext;

    render() {
        const { currentUser, userRole } = this.context;
        const { component: Component, role, ...rest } = this.props;

        return (
            <Route
                {...rest}
                render={(props) =>
                    currentUser && userRole === role ? (
                        <Component {...props} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: '/volunteer',
                                state: { from: this.props.location },
                            }}
                        />
                    )
                }
            />
        );
    }
}

export default PrivateRoute;
