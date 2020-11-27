import React, { Suspense, useRef } from 'react';
import { Canvas, useThree } from 'react-three-fiber';
import { useSpring } from 'react-spring';

import create from 'zustand';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import myImage from '../resources/images/up.png';
import sphereTexture from '../resources/images/01_10Pattern06.jpg';

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
    currentPositionAxis: 'z',
    currentTiltAxis: 'x',
    currentSwivelAxis: 'y',
    currentCamera: null,
    currentDirection: FORWARD,
    directionsConfig: [
        {
            key: 1,
            label: 'Left',
            direction: LEFT
        }, {
            key: 2,
            label: 'Up',
            direction: ABOVE
        }, {
            key: 3,
            label: 'Main',
            direction: FORWARD
        }, {
            key: 4,
            label: 'Behind',
            direction: BEHIND
        }, {
            key: 5,
            label: 'Down',
            direction: UNDERNEATH
        }, {
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
        }, {
            key: 8,
            label: 'Position 2',
            position: 5
        }, {
            key: 9,
            label: 'Position 3',
            position: 10
        }, {
            key: 10,
            label: 'Position 4',
            position: 15
        }, {
            key: 11,
            label: 'Position 5',
            position: 20
        }
    ],
    getCurrentAxis: ({ x, y, z }) => {
        let curAxis = 0;
        if (x) {
            curAxis = x;
        } else if (y) {
            curAxis = y;
        } else if (z) {
            curAxis = z;
        }
        return curAxis;
    }
}));

function CameraDolly() {
    const { camera } = useThree();
    const cv = useStore(state => state.currentPositionAxis);

    let fromObj = {}, toObj = {};
    fromObj[ cv ] = 0;
    toObj[ cv ] = useStore(state => state.currentDollyPosition);

    useSpring({
        from: fromObj, to: toObj, onFrame: ({x,y,z}) => {
            camera.position[ useStore.getState().currentPositionAxis ] = useStore.getState().getCurrentAxis({ x, y, z });
        }
    });

    return null;
}

function CameraTilt() {
    const { camera } = useThree();
    const cv = useStore(state => state.currentTiltAxis);
    const cda = useStore(state => state.currentTilt);

    let fromObj = {}, toObj = {};
    fromObj[ cv ] = 0;
    toObj[ cv ] = cda;

    useSpring({
        from: fromObj,
        to: toObj,
        onFrame: ({ x, y, z }) => {
            camera.rotation[ useStore.getState().currentTiltAxis ] = useStore.getState().getCurrentAxis({ x, y, z });
        }
    })

    return null;
}

function CameraSwivel() {
    const { camera } = useThree();
    const cv = useStore(state => state.currentSwivelAxis);

    let fromObj = {}, toObj = {};
    fromObj[ cv ] = 0;
    toObj[ cv ] = useStore(state => state.currentSwivel);

    useSpring({
        from: useStore(state => state.currentDollyPosition),
        to: 0,
        onFrame: ({x,y,z}) => {
            camera.position[ useStore.getState().currentPositionAxis ] = useStore.getState().getCurrentAxis({ x, y, z });
        }
    });

    useSpring({
        from: fromObj,
        to: toObj,
        onFrame: ({ x, y, z }) => {
            camera.rotation[ useStore.getState().currentSwivelAxis ] = useStore.getState().getCurrentAxis({ x, y, z });
        }
    });

    return null;
}

function Navigation() {
    const currentDirection = useStore(state => state.currentDirection);
    const directionsConfig = useStore(state => state.directionsConfig);

    function swivelCamera(sNo) {
        // Set vectors
        if (sNo === 0) {
            useStore.setState({ currentSwivelAxis: 'y' });
            useStore.setState({ currentPositionAxis: 'z' });
            useStore.setState({ currentTiltAxis: 'x' });
        } else {
            useStore.setState({ currentSwivelAxis: 'y' });
            // Clockwise
            if (sNo < 0) {
                if (sNo === - 3.2) {
                    // Behind
                    useStore.setState({ currentPositionAxis: 'z' });
                    useStore.setState({ currentTiltAxis: 'x' });
                } else {
                    // Right
                    useStore.setState({ currentPositionAxis: 'x' });
                    useStore.setState({ currentTiltAxis: 'z' });
                }
            } else {
                // Left
                useStore.setState({ currentPositionAxis: 'x' });
                useStore.setState({ currentTiltAxis: 'z' });
            }
        }
        useStore.setState({ currentSwivel: sNo });
    }

    function tiltCamera(rNo) {
        useStore.setState({ currentTilt: rNo });
        useStore.setState({ currentPositionAxis: 'y' });
    }

    function setHighlight(p) {
        let menuItems = document.querySelectorAll('.menu.directions-menu a');
        let hasPosition = false;
        if (p.position !== undefined) {
            hasPosition = true;
        }
        if (hasPosition === false) {
            document.querySelectorAll('.menu.directions-menu a').forEach((itm) => {
                if (itm.id == p.key) {
                    itm.classList.add('selected');
                } else {
                    itm.classList.remove('selected')
                }
            });
        }
        document.querySelectorAll('.menu.positions-menu a').forEach((itm) => {
            if (itm.id == p.key) {
                itm.classList.add('selected');
            } else  {
                itm.classList.remove('selected');
            }

        });

        if (p.direction !== undefined) {
            document.querySelectorAll('.menu.positions-menu a').forEach((itm) => {
                if (itm.id == 7) {
                    console.log('MATCH', itm);
                    itm.classList.remove('deselected');
                    itm.classList.add('selected');
                }
            })
        }
    }

    function goToMain(p) {
        console.log('goToMain', p);
        setHighlight(p);

        setTimeout(() => {
            useStore.setState({ currentDollyPosition: 0 });
            setTimeout(() => {

                tiltCamera(0);
                swivelCamera(0);

                setTimeout(() => {
                    useStore.setState({ currentDirection: p.direction });
                    chooseDirection(p);
                }, 1200);
            }, 700);
        }, 100);
    }

    function chooseDirection(p) {
        switch (p.direction) {
            case LEFT:
                swivelCamera(1.6);
                break;
            case RIGHT:
                swivelCamera(- 1.6);
                break;
            case ABOVE:
                tiltCamera(1.6);
                break;
            case FORWARD:
                swivelCamera(0);
                break;
            case BEHIND:
                swivelCamera(- 3.2);
                break;
            case UNDERNEATH:
                tiltCamera(- 1.6);
                break;
            default:
                swivelCamera(0);
        }
    }

    function choosePosition(positionObj) {
        useStore.setState({ currentDollyPosition: positionObj.position });
        dollyCamera(positionObj.position);
        setHighlight(positionObj);
    }

    function dollyCamera(pNo) {
        const isRight = currentDirection === RIGHT;
        const isBehind = currentDirection === BEHIND;
        const isAbove = currentDirection === ABOVE;

        useStore.setState({ currentDollyPosition: (isRight || isAbove || isBehind) ? pNo : - pNo });
    }

    return (
        <div>
            <div className="menu directions-menu">
                <div className="rotateMenuWrapper">
                    {
                        directionsConfig.map((p) => {
                            return (<a id={ p.key } key={ p.key } onClick={ (e) => goToMain(p) }>{ p.label }</a>);
                        })
                    }
                </div>
            </div>
            <div className="menu positions-menu">
                <div className="positionMenuWrapper">
                    {
                        useStore.getState().positionsConfig.map(
                            (p) => {
                                return (
                                    <a id={ p.key } key={ p.key } onClick={ () => choosePosition(p) }
                                       className="deselected">{ p.label }</a>
                                );
                            }
                        )
                    }
                </div>
            </div>
        </div>
    );
}

function BackgroundDome() {
    const { mesh } = useRef();
    const loader = new TextureLoader();

    let tLoad = loader.load(sphereTexture, (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set( 0, 0 );
        texture.repeat.set( 6, 6 );
    });

    return (
        <mesh visible position={ [0, 0, - 2] } rotation={ [0, 0, 0] }>
            <sphereBufferGeometry args={ [24, 24, 24] }/>
            <meshStandardMaterial map={tLoad} name="material" color="grey" side={ THREE.BackSide }/>
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
            <meshBasicMaterial map={ myTexture } attach="material" transparent/>
        </mesh>
    );
}

function Experiment00() {

    return (
        <div className="App">
            <Canvas>
                <ambientLight/>
                <pointLight position={ [3.546, 7.387, 5.455] }/>
                <pointLight position={ [- 4.012, - 10.924, - 4.518] }/>
                {/* Objects spaced in increments of 5 units. */ }
                <ScreenBox position={ [0, 0, - 2] }/>
                <ScreenBox position={ [0, 0, - 7] }/>
                <ScreenBox position={ [0, 0, - 12] }/>
                <ScreenBox position={ [0, 0, - 17] }/>
                <ScreenBox position={ [0, 0, - 22] }/>
                {/* Top */ }
                <ScreenBox position={ [0, 2, 0] }/>
                <ScreenBox position={ [0, 7, 0] }/>
                <ScreenBox position={ [0, 12, 0] }/>
                <ScreenBox position={ [0, 17, 0] }/>
                <ScreenBox position={ [0, 22, 0] }/>
                {/* Bottom */ }
                <ScreenBox position={ [0, - 2, 0] }/>
                <ScreenBox position={ [0, - 7, 0] }/>
                <ScreenBox position={ [0, - 12, 0] }/>
                <ScreenBox position={ [0, - 17, 0] }/>
                <ScreenBox position={ [0, - 22, 0] }/>
                {/* Left */ }
                <ScreenBox position={ [- 2, 0, 0] }/>
                <ScreenBox position={ [- 7, 0, 0] }/>
                <ScreenBox position={ [- 12, 0, 0] }/>
                <ScreenBox position={ [- 17, 0, 0] }/>
                <ScreenBox position={ [- 22, 0, 0] }/>
                {/* Right */ }
                <ScreenBox position={ [2, 0, 0] }/>
                <ScreenBox position={ [7, 0, 0] }/>
                <ScreenBox position={ [12, 0, 0] }/>
                <ScreenBox position={ [17, 0, 0] }/>
                <ScreenBox position={ [22, 0, 0] }/>
                {/* Behind */ }
                <ScreenBox position={ [0, 0, 2] }/>
                <ScreenBox position={ [0, 0, 7] }/>
                <ScreenBox position={ [0, 0, 12] }/>
                <ScreenBox position={ [0, 0, 17] }/>
                <ScreenBox position={ [0, 0, 22] }/>

                {/* Camera hooks */ }
                <CameraDolly/>
                <CameraTilt/>
                <CameraSwivel/>

                {/*Background / environment*/ }
                <Suspense>
                    <BackgroundDome/>
                </Suspense>
            </Canvas>

            <Navigation/>

        </div>
    );
}

export default Experiment00;
