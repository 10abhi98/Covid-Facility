// Router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

// React
import React, { Component } from 'react';

// Components ->
import Login from './components/login';
import Register from './components/register';
import Error404 from './components/error404';
import HomePage from './components/homepage';
import Volunteer from './components/volunteer';
import Header from './components/header';
import volunteerHome from './components/dashboard';
import Admin from './components/admin/admin';
import { AuthProvider } from './services/AuthContext';

class App extends Component {
    render() {
        return (
            <>
                <AuthProvider>
                    <Router>
                        <Header />
                        <div>
                            <Switch>
                                <PublicRoute
                                    restricted={false}
                                    path='/'
                                    exact
                                    component={HomePage}
                                />
                                <PublicRoute
                                    restricted={true}
                                    path='/volunteer/register'
                                    component={Register}
                                />
                                <PublicRoute
                                    restricted={true}
                                    path='/volunteer/login'
                                    component={Login}
                                />
                                <PublicRoute
                                    restricted={true}
                                    path='/volunteer'
                                    exact
                                    component={Volunteer}
                                />
                                <PrivateRoute
                                    path='/volunteer/dashboard'
                                    component={volunteerHome}
                                    role={['ROLE_VOLUNTEER']}
                                />
                                <PrivateRoute
                                    path='/volunteer/admin'
                                    component={Admin}
                                    role={['ROLE_ADMIN']}
                                />
                                <Route component={Error404} />
                            </Switch>
                        </div>
                    </Router>
                </AuthProvider>
            </>
        );
    }
}

export default App;
