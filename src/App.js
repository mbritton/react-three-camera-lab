import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import Experiment00 from "./experiments/Experiment00";
import Experiment01 from "./experiments/Experiment01";
import Experiment02 from "./experiments/Experiment02";
import Experiment03 from "./experiments/Experiment03";
import Experiment04 from "./experiments/Experiment04";
import Experiment05 from "./experiments/Experiment05";
import Experiment06 from "./experiments/Experiment06";

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
                        <li>
                            <Link to="/03">Experiment 03</Link>
                        </li>
                        <li>
                            <Link to="/04">Experiment 04</Link>
                        </li>
                        <li>
                            <Link to="/05">Experiment 05</Link>
                        </li>
                        <li>
                            <Link to="/06">Experiment 06</Link>
                        </li>
                    </ul>
                </div>
                <Switch>
                    <Route exact path="/00" component={ Experiment00 }/>
                    <Route exact path="/01" component={ Experiment01 }/>
                    <Route exact path="/02" component={ Experiment02 }/>
                    <Route exact path="/03" component={ Experiment03 }/>
                    <Route exact path="/04" component={ Experiment04 }/>
                    <Route exact path="/05" component={ Experiment05 }/>
                    <Route exact path="/06" component={ Experiment06 }/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
