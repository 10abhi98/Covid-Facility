import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../services/AuthContext';

class PrivateRoute extends Component {
    static contextType = AuthContext;

    render() {
        const { currentUser, userRole } = this.context;
        console.log(userRole);
        const { component: Component, role, ...rest } = this.props;
        // console.log(props);
        // const userRole = getRole(currentUser.uid);
        // userRole.then((res) => {
        //     console.log(res);
        // });
        // console.log(userRole, currentUser);
        // this.grantPermission(role, userRole);
        const path = userRole.includes('ADMIN') ? 'admin' : 'dashboard';
        return (
            <Route
                {...rest}
                render={(props) =>
                    currentUser ? (
                        userRole && userRole === role ? (
                            <Component {...props} />
                        ) : (
                            <Redirect
                                to={{
                                    pathname: '/volunteer/' + path,
                                    state: { from: this.props.location },
                                }}
                            />
                        )
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
