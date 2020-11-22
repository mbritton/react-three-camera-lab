import React, { Suspense, useRef } from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import Experiment00 from './Experiment00'

export default function ExperimentIndex() {
    let match = useRouteMatch('/experiments/:name')
    return (
        <Suspense fallback={() => {
            console.log('fallback...');
        }}>
            <Switch>
                <Route exact path="/" component={Experiment00} />
            </Switch>
        </Suspense>
    );
}
