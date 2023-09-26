import React, { Component } from 'react';
import { Chat, NotFound, Register, Login } from './views/index';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AppRoute from './AppRoute';
import Auth from './Auth';

class App extends Component {

    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <AppRoute path='/' exact component={Chat} can={Auth.auth} redirect='/login' />                        <Route path='/register' component={Register}/>
                        <AppRoute path='/register' component={Register} can={Auth.guest} redirect='/' />
                        <AppRoute path='/Login' component={Login} can={Auth.guest} redirect='/' />
                        <AppRoute component={NotFound} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
