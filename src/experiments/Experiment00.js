import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useThree } from 'react-three-fiber';
import { HashRouter as Router } from 'react-router-dom';
import { useSpring } from 'react-spring';


import create from 'zustand';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import myImage from '../resources/images/up.png';

let myTexture = null;

const ABOVE = 'a';
const UNDERNEATH = 'u';
const LEFT = 'l';
const RIGHT = 'r';
const BEHIND = 'b'
const FORWARD = 'f';

const useStore = create((set, get) => ({
    currentDollyPosition: 0,
    currentTilt: 0,
    currentSwivel: 0,
    currentPositionVector: 'z',
    currentTiltVector: 'x',
    currentSwivelVector: 'y',
    currentCamera: null,
    currentDirection: FORWARD,
    directionsConfig: [
        {
            key: 1,
            label: 'Left',
            direction: LEFT
        },{
            key: 2,
            label: 'Up',
            direction: ABOVE
        },{
            key: 3,
            label: 'Main',
            direction: FORWARD
        },{
            key: 4,
            label: 'Behind',
            direction: BEHIND
        },{
            key: 5,
            label: 'Down',
            direction: UNDERNEATH
        },{
            key: 6,
            label: 'Right',
            direction: RIGHT
        }
    ],
    positionsConfig: [
        {
            key: 7,
            label: 'Position 1',
            position: 0
        },{
            key: 8,
            label: 'Position 2',
            position: 5
        },{
            key: 9,
            label: 'Position 3',
            position: 10
        },{
            key: 10,
            label: 'Position 4',
            position: 15
        },{
            key: 11,
            label: 'Position 5',
            position: 20
        }
    ],
    getCurrentAxis: ({x,y,z}) => {
        let curAxis = 0;
        if (x) {
            curAxis = x;
        } else if (y) {
            curAxis = y;
        } else if (z) {
            curAxis = z;
        }
        return curAxis;
    },
    onFramePosition: ({x,y,z}) => {
        get().currentCamera.position[get().currentPositionVector] = get().getCurrentAxis({x,y,z});
    },
    onFrameTilt: ({x,y,z}) => {
        get().currentCamera.rotation[get().currentTiltVector] = get().getCurrentAxis({x,y,z});
    },
    onFrameSwivel: ({x,y,z}) => {
        get().currentCamera.rotation[get().currentSwivelVector] = get().getCurrentAxis({x,y,z});
    },
    setHighlight: (interactionType, p) => {
        let positions = document.querySelectorAll('.positions-menu a');
        let directions = document.querySelectorAll('.directions-menu a');
        let hasASelected = false;

        if (interactionType ===  'direction') {
            for (let pos of directions) {
                if (pos.classList.contains('selected')) {
                    pos.classList.remove('selected');
                    pos.classList.add('deselected');
                }
                if (p.key == pos.id) {
                    pos.classList.remove('deselected');
                    pos.classList.add('selected');
                }
            }
            for (let pos of positions) {
                pos.classList.remove('selected');
                positions[0].classList.add('selected');
            }
        }

        if (interactionType === 'position') {
            for (let pos of positions) {
                pos.classList.remove('selected');
                if (pos.classList.contains('selected')) {
                    hasASelected = true;
                    pos.classList.add('deselected');
                }
                if (p.key == pos.id) {
                    pos.classList.remove('deselected');
                    pos.classList.add('selected');
                }
            }
            if (hasASelected) {
                positions[0].classList.add('selected');
            }
        }
    }
}));

function CameraDolly() {
    const { camera } = useThree();
    const cv = useStore(state => state.currentPositionVector);

    useStore.setState({currentCamera: camera});

    let fromObj = {}, toObj = {};
    fromObj[cv] = 0;
    toObj[cv] = useStore(state => state.currentDollyPosition);

    useSpring({ from: fromObj, to: toObj, onFrame: useStore.getState().onFramePosition });

    return null;
}

function CameraTilt() {
    const cv = useStore(state => state.currentTiltVector);
    const cda = useStore(state => state.currentTilt);

    let fromObj = {}, toObj = {};
    fromObj[cv] = 0;
    toObj[cv] = cda;

    useSpring({
        from: fromObj,
        to: toObj,
        onFrame: useStore.getState().onFrameTilt
    })

    return null;
}

function CameraSwivel() {
    const cv = useStore(state => state.currentSwivelVector);

    let fromObj = {}, toObj = {};
    fromObj[cv] = 0;
    toObj[cv] = useStore(state => state.currentSwivel);

    useSpring({
        from: useStore.getState().currentDollyPosition,
        to: 0,
        onFrame: useStore.getState().onFramePosition,
    });

    useSpring({
        from: fromObj,
        to: toObj,
        onFrame: useStore.getState().onFrameSwivel,
    });

    return null;
}

function DirectionsMenu() {
    const currentDirection = useStore.getState().currentDirection;
    const directionsConfig = useStore.getState().directionsConfig;

    function swivelCamera(sNo) {
        // Set vectors
        if (sNo === 0) {
            useStore.setState({ currentSwivelVector : 'y' });
            useStore.setState({ currentPositionVector : 'z' });
            useStore.setState({ currentTiltVector : 'x' });
        } else {
            useStore.setState({ currentSwivelVector : 'y' });
            // Clockwise
            if (sNo < 0) {
                if (sNo === -3.2) {
                    // Behind
                    useStore.setState({ currentPositionVector : 'z' });
                    useStore.setState({ currentTiltVector : 'x' });
                } else {
                    // Right
                    useStore.setState({ currentPositionVector : 'x' });
                    useStore.setState({ currentTiltVector : 'z' });
                }
            } else {
                // Left
                useStore.setState({ currentPositionVector : 'x' });
                useStore.setState({ currentTiltVector : 'z' });
            }
        }
        useStore.setState({ currentSwivel: sNo });
    }

    function tiltCamera(rNo) {
        useStore.setState({ currentTilt: rNo });
        useStore.setState({ currentPositionVector : 'y' });
    }

    function goToForward(p) {
        useStore.setState({currentDollyPosition: 0});

        tiltCamera(0);
        swivelCamera(0);

        useStore.setState({currentPositionVector: 'z'});
        useStore.setState({currentTiltVector: 'x'});
        useStore.setState({currentSwivelVector: 'y'});

        useStore.getState().setHighlight('direction', p);

        setTimeout(() => {
            useStore.setState({currentDirection: p.direction});
            chooseDirection(p);
        }, 1000);
    }

    function chooseDirection(p) {
        switch(p.direction) {
            case LEFT:
                swivelCamera(1.6);
                break;
            case RIGHT:
                swivelCamera(-1.6);
                break;
            case ABOVE:
                tiltCamera(1.6);
                break;
            case FORWARD:
                swivelCamera(0);
                break;
            case BEHIND:
                swivelCamera(-3.2);
                break;
            case UNDERNEATH:
                tiltCamera(-1.6);
                break;
            default:
                swivelCamera(0);
        }
    }

    return(
        <div className="menu directions-menu">
            <div className="rotateMenuWrapper">
                {
                    directionsConfig.map((p) => {
                        return(<a id={p.key} key={p.key} onClick={ () => goToForward(p) }
                                  className={ (p.direction === currentDirection ?
                                      'selected' : 'deselected') }>{p.label}</a>);
                    })
                }
            </div>
        </div>
    );
}

function PositionsMenu() {

    function dollyCamera(pNo) {

        const currentDirection = useStore.getState().currentDirection;
        const isRight = currentDirection === RIGHT;
        const isBehind = currentDirection === BEHIND;
        const isAbove = currentDirection === ABOVE;

        useStore.setState({ currentDollyPosition: (isRight || isAbove || isBehind) ? pNo : -pNo });
    }

    function choosePosition(positionObj) {
        useStore.setState({currentDollyPosition: positionObj.position});
        useStore.getState().setHighlight('position', positionObj);

        dollyCamera(positionObj.position);
    }

    return (
        <div className="menu positions-menu">
            <div className="positionMenuWrapper">
                {
                    useStore.getState().positionsConfig.map(
                        (p) => {
                            return (
                                <a id={p.key} key={p.key} onClick={ () => choosePosition(p) }
                                   className={ (p.position === useStore.getState().currentDollyPosition ?
                                       'selected' : 'deselected') }>{p.label}</a>
                            );
                        }
                    )
                }
            </div>
        </div>
    );
}

function BackgroundDome() {
    return (
        <mesh visible position={[0, 0, -2]} rotation={[0, 0, 0]}>
            <sphereBufferGeometry args={[24, 16, 16]} />
            <meshStandardMaterial name="material" color="grey" side={THREE.BackSide} />
        </mesh>
    );
}

function ScreenBox(props) {
    const mesh = useRef();
    const loader = new TextureLoader();

    myTexture = loader.load(myImage);

    return (
        <mesh
            { ...props }
            ref={ mesh }>
            <boxBufferGeometry attach="geometry" args={ [1, 1, 1] }/>
            <meshBasicMaterial map={ myTexture } attach="material" transparent />
        </mesh>
    );
}

function Experiment00() {
    const { camera } = useThree();

    useStore.setState({currentCamera: camera});

    return (
        <div className="App">
            <Canvas>
                <ambientLight/>
                <pointLight position={ [0, 3, -2.39] }/>
                {/* Objects spaced in increments of 5 units. */}
                <ScreenBox position={ [0, 0, -2] }/>
                <ScreenBox position={ [0, 0, -7] }/>
                <ScreenBox position={ [0, 0, -12] }/>
                <ScreenBox position={ [0, 0, -17] }/>
                <ScreenBox position={ [0, 0, -22] }/>
                {/* Top */}
                <ScreenBox position={ [0, 2, 0] }/>
                <ScreenBox position={ [0, 7, 0] }/>
                <ScreenBox position={ [0, 12, 0] }/>
                <ScreenBox position={ [0, 17, 0] }/>
                <ScreenBox position={ [0, 22, 0] }/>
                {/* Bottom */}
                <ScreenBox position={ [0, -2, 0] }/>
                <ScreenBox position={ [0, -7, 0] }/>
                <ScreenBox position={ [0, -12, 0] }/>
                <ScreenBox position={ [0, -17, 0] }/>
                <ScreenBox position={ [0, -22, 0] }/>
                {/* Left */}
                <ScreenBox position={ [-2, 0, 0] }/>
                <ScreenBox position={ [-7, 0, 0] }/>
                <ScreenBox position={ [-12, 0, 0] }/>
                <ScreenBox position={ [-17, 0, 0] }/>
                <ScreenBox position={ [-22, 0, 0] }/>
                {/* Right */}
                <ScreenBox position={ [2, 0, 0] }/>
                <ScreenBox position={ [7, 0, 0] }/>
                <ScreenBox position={ [12, 0, 0] }/>
                <ScreenBox position={ [17, 0, 0] }/>
                <ScreenBox position={ [22, 0, 0] }/>
                {/* Behind */}
                <ScreenBox position={ [0, 0, 2] }/>
                <ScreenBox position={ [0, 0, 7] }/>
                <ScreenBox position={ [0, 0, 12] }/>
                <ScreenBox position={ [0, 0, 17] }/>
                <ScreenBox position={ [0, 0, 22] }/>

                {/* Camera hooks */}
                <CameraDolly/>
                <CameraTilt/>
                <CameraSwivel/>

                {/*Background / environment*/}
                <Suspense>
                    <BackgroundDome/>
                </Suspense>
            </Canvas>

            {/*Navigation*/}
            <DirectionsMenu/>
            <PositionsMenu/>

        </div>
    );
}

export default Experiment00;
