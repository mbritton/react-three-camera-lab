import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Experiment00 from "./experiments/Experiment00";
import * as experiments from "./experiments";
import './App.css';

const visibleComponents = Object.entries(experiments);

function App() {
    return (
        <Router>
            <Experiment00 />
        </Router>
    );
}

export default App;
