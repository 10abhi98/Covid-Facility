import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../services/AuthContext';

class PrivateRoute extends Component {
    static contextType = AuthContext;

    render() {
        const { currentUser, userRole } = this.context;
        const { component: Component, role, ...rest } = this.props;
        const path = userRole.includes('ADMIN') ? 'admin' : 'dashboard';
        return (
            <Route
                {...rest}
                render={(props) =>
                    currentUser ? (
                        userRole && userRole === role ? (
                            // Allow User to Access Individual Routes ->
                            <Component {...props} />
                        ) : (
                            // Prevent Admin to access Dashboard Page & Volunteer to access Admin Page ->
                            <Redirect
                                to={{
                                    pathname: '/volunteer/' + path,
                                    state: { from: this.props.location },
                                }}
                            />
                        )
                    ) : (
                        // If not looged in, redirect to Volunteer Page ->
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
