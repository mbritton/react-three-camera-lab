import React, { useRef } from 'react';
import { Canvas, useThree } from 'react-three-fiber';
import { useSpring } from 'react-spring';

import create from 'zustand';
import { Mesh, TextureLoader } from 'three';
import myImage from '../resources/images/up.png';
import sphereTexture from "../resources/images/01_10Pattern06.jpg";
import * as THREE from "three";

let myTexture = null;

const ABOVE = 'a';
const UNDERNEATH = 'u';
const LEFT = 'l';
const RIGHT = 'r';
const BEHIND = 'b'
const FORWARD = 'f';

const useStore = create((set, get) => ({
    backgroundColor: 0xbe763a,
    componentJustMounted: true,
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
            direction: LEFT,
            color: 0xcecece
        }, {
            key: 2,
            label: 'Up',
            direction: ABOVE,
            color: 0x81be3a
        }, {
            key: 3,
            label: 'Main',
            direction: FORWARD,
            color: 0xff0000
        }, {
            key: 4,
            label: 'Behind',
            direction: BEHIND,
            color: 0xffff00
        }, {
            key: 5,
            label: 'Down',
            direction: UNDERNEATH,
            color: 0x6f6f6f
        }, {
            key: 6,
            label: 'Right',
            direction: RIGHT,
            color: 0x2a2a2a
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
    backgroundDomePosition: null,
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
    },
    getHomePosition: () => {
        let homePos = 0;
        get().positionsConfig.forEach((itm) => {
            if (itm && itm.position === 0) {
                homePos = itm;
            }
        })
        return homePos;
    },
    getColor: (p) => {
        get().directionsConfig.forEach((itm) => {
            if (itm.key == p.key) {
                return itm.color;
            }
        })
    }
}));

const loader = new TextureLoader();
let tLoad = loader.load(sphereTexture, (texture) => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.offset.set( 0, 0 );
    texture.repeat.set( 6, 6 );
});

function CameraDolly() {
    const { camera } = useThree();
    const cv = useStore(state => state.currentPositionAxis);

    let fromObj = {}, toObj = {};
    fromObj[ cv ] = 0;
    toObj[ cv ] = useStore(state => state.currentDollyPosition);

    useSpring({
        from: fromObj, to: toObj,
        onFrame: ({x, y, z}) => {
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
    const positionsConfig = useStore(state => state.positionsConfig);

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

    function goToMain(p) {
        useStore.setState({ backgroundColor: p.color });
        setTimeout(() => {
            useStore.setState({ currentDollyPosition: 0 });
            setHighlight(p);
            setTimeout(() => {

                tiltCamera(0);
                swivelCamera(0);

                setTimeout(() => {
                    useStore.setState({ currentDirection: p.direction });
                    chooseDirection(p);
                }, 1200);
            }, 700);
        }, 500);
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

    if (useStore.getState().componentJustMounted === true) {
        setTimeout(() => {
            setHighlight({
                key: 7,
                label: "Position 1",
                position: 0
            });
            setHighlight({
                key: 3,
                label: 'Main',
                direction: FORWARD
            });
        }, 1000);
        useStore.setState({componentJustMounted: false});
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
                        positionsConfig.map(
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

const setHighlight = (interaction) => {
    let hasPosition = (interaction.position !== undefined) ? true : false;
    let hasDirection = (interaction.direction !== undefined) ? true : false;
    let homePosition = useStore.getState().getHomePosition();

    if (hasDirection === true) {
        document.querySelectorAll('.menu.positions-menu a').forEach((itm) => {
            itm.classList.remove('selected');
            if (itm.id == homePosition.key) {
                itm.classList.add('selected');
            }
        });
        document.querySelectorAll('.menu.directions-menu a').forEach((itm) => {
            itm.classList.remove('selected');
            if (itm.id == interaction.key) {
                itm.classList.add('selected');
            }
        });
    }

    if (hasPosition === true) {
        document.querySelectorAll('.menu.positions-menu a').forEach((itm) => {
            itm.classList.remove('selected');
            if (itm.id == interaction.key) {
                itm.classList.add('selected');
            }
        });
    }
}

function BackgroundDome() {
    const { scene } = useThree();
    const cv = useStore(state => state.currentSwivelAxis);

    let fromObj = {}, toObj = {};
    fromObj[ cv ] = 0;
    toObj[ cv ] = useStore(state => state.currentSwivel);

    let myDome = scene.getObjectByName('dome') !== undefined ? scene.getObjectByName('dome') : new Mesh();

    useSpring({
        from: fromObj,
        to: toObj,
        onFrame: ({ x, y, z }) => {
            myDome.rotation[ useStore.getState().currentSwivelAxis ] = .8 * useStore.getState().getCurrentAxis({ x, y, z });
        }
    });

    return (
        null
    );
}

function Experiment06() {
    if (useStore.getState().componentJustMounted === false) {
        setTimeout(()  => {
            setHighlight({key: 3, label: "Main", direction: "f"});
        }, 1000);
    }
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

                {/* Camera components */ }
                <CameraDolly/>
                <CameraTilt/>
                <CameraSwivel/>


                <mesh name='dome' visible position={ [0, 0, - 2] } rotation={ [0, 0, 0] }>
                    <sphereBufferGeometry args={ [24, 24, 24] }/>
                    <meshStandardMaterial map={tLoad} name="material" color="grey" side={ THREE.BackSide }/>
                </mesh>

                {/*Background / environment */ }
                <BackgroundDome />
            </Canvas>
            <Navigation/>
        </div>
    );
}

export default Experiment06;
