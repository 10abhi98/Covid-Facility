import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import AuthContext from "./AuthContext";

class PrivateRoute extends Component {
    static contextType = AuthContext;

    render() {
        const { currentUser } = this.context;
        const { component: Component, ...rest } = this.props;

        return (
            <Route
                {...rest}
                render={(props) =>
                    currentUser ? (
                        <Component {...props} />
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/volunteer",
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
