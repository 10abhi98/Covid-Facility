// Router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// React
import React, { Component } from 'react';
import { createBrowserHistory } from 'history';

// Components ->
import Login from './components/login';
import Register from './components/register';
import Error404 from './components/error404';
import HomePage from './components/homepage';
import Volunteer from './components/volunteer';
import Header from './components/header';
import volunteerHome from './components/dashboard';
import { AuthProvider } from './models/AuthContext';

const history = createBrowserHistory();

class App extends Component {
	render() {
		return (
			<>
			<AuthProvider>
				<Router history={history}>
					<Header />
					<div>
						<Switch>
							<Route path='/' exact component={HomePage} />
							<Route path='/volunteer/register' component={Register} />
							<Route path='/volunteer/login' component={Login} />
							<Route path='/volunteer' exact component={Volunteer} />
							<Route path='/volunteer/dashboard' component={volunteerHome} />
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
