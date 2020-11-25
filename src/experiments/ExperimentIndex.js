import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Experiment00 from './Experiment00';
import Experiment01 from './Experiment01';

export default function ExperimentIndex() {
    return (
        <Switch>
            <Route exact path="/00" component={ Experiment00 }/>
            <Route exact path="/01" component={ Experiment01 }/>
        </Switch>
    );
}
