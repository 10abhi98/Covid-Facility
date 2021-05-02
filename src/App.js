// Router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// React
import React, { Component } from 'react'
import { createBrowserHistory } from "history";

// Components ->
import Login from './components/Login';
import Register from './components/Register';
import Error404 from './components/error404';
import Volunteer  from './components/volunteer';

const history = createBrowserHistory();

class App extends Component {
	render(){
		return (
			<>
				<Router history={history}>
					<div>
						<Switch>
							<Route path="/" exact component={HomePage} />
							<Route path="/register" component={Register} /> 
							<Route path="/login" component={Login} /> 
							<Route path="/volunteer" component={Volunteer} /> 
							<Route component={Error404} />
						</Switch>
					</div>
				</Router>
			</>
		);
	}
}

export default App;
