import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import Experiment00 from "./experiments/Experiment00";
import Experiment01 from "./experiments/Experiment01";

function App() {
    return (
        <Router>
            <div>
                <div className="index-menu">
                    <ul>
                        <li>
                            <Link to="/">Index</Link>
                        </li>
                        <li>
                            <Link to="/00">Experiment 00</Link>
                        </li>
                        <li>
                            <Link to="/01">Experiment 01</Link>
                        </li>
                    </ul>
                </div>
                <Switch>
                    <Route exact path="/00" component={ Experiment00 }/>
                    <Route exact path="/01" component={ Experiment01 }/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
