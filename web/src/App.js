import React, { Component } from 'react';
import { Chat, NotFound, Register } from './views/index';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {

    render() {
        return (
            <div id="main-container" className="container-fluid">
                <Router>
                    <Switch>
                        <Route path='/' exact component={Chat}/>
                        <Route path='/register' component={Register}/>
                        <Route component={NotFound} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
