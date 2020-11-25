import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Experiment00 from "./experiments/Experiment00";
import Experiment01 from "./experiments/Experiment01";
import ExperimentIndex from "./experiments/ExperimentIndex";
import './App.css';

function App() {
    return (
        <Router>
            <ExperimentIndex />
        </Router>
    );
}

export default App;
