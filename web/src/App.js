import React, { Component } from 'react';
import { Chat, NotFound } from 'views';

class App extends Component {

    render() {
        return (
            <div id="main-container" className="container-fluid">
            <Router>
                <Switch>
                    <AppRoute path='/' exact component={Chat}/>
                    <AppRoute component={NotFound} />
                </Switch>
               </Router>
        </div>
        );
    }
}

export default App;
