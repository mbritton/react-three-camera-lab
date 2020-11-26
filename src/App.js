import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
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
