import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import Experiment00 from "./experiments/Experiment00";
import Experiment01 from "./experiments/Experiment01";
import Experiment02 from "./experiments/Experiment02";

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
                        <li>
                            <Link to="/02">Experiment 02</Link>
                        </li>
                    </ul>
                </div>
                <Switch>
                    <Route path="/00" component={ Experiment00 }/>
                    <Route path="/01" component={ Experiment01 }/>
                    <Route path="/02" component={ Experiment02 }/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
