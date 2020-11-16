import React, { useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import { useSpring, UseSpringProps } from 'react-spring';
import './App.css';
import create from 'zustand';
import { TextureLoader } from 'three';
import myImage from './logo512.png';

const useStore = create((set, get) => ({
    currentDollyPosition: 0,
    currentTilt: 0,
    currentSwivel: 0,
    currentPositionVector: 'z',
    currentTiltVector: 'x',
    currentSwivelVector: 'y',
    currentCamera: null,
    currentDirection: 'f',
    onFramePosition: ({x,y,z}) => {
        let curDim = 0;
        if (x) {
            curDim = x;
        } else if (y) {
            curDim = y;
        } else if (z) {
            curDim = z;
        }
        
        get().currentCamera.position[get().currentPositionVector] = curDim;
    },
    onFrameTilt: ({x,y,z}) => {
        let curDim = 0;
        if (x) {
            curDim = x;
        } else if (y) {
            curDim = y;
        } else if (z) {
            curDim = z;
        }
        
        get().currentCamera.rotation[get().currentTiltVector] = curDim;
    },
    onFrameSwivel: ({x,y,z}) => {
        let curDim = 0;
        if (x) {
            curDim = x;
        } else if (y) {
            curDim = y;
        } else if (z) {
            curDim = z;
        }
        
        get().currentCamera.rotation[get().currentSwivelVector] = curDim;
    }
}));

let myTexture = null;

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
        from: fromObj,
        to: toObj,
        onFrame: useStore.getState().onFrameSwivel
    })

    return null;
}

function Menu() {

    function dollyCamera(pNo) {
        const isRight = useStore.getState().currentDirection === 'r';
        const isBehind = useStore.getState().currentDirection === 'b';
        const isAbove = useStore.getState().currentDirection === 'a';
        const isUnder = useStore.getState().currentDirection === 'u';
        useStore.setState({ currentDollyPosition: (isRight || isBehind || isAbove)  ? pNo : -pNo });
    }

    function tiltCamera(rNo) {
        console.log('rNo', rNo);

        useStore.setState({ currentTilt: rNo });
        useStore.setState({ currentDirection : (rNo > 0) ? 'a' : 'u' })

        useStore.setState({ currentSwivelVector : 'x' });
        useStore.setState({ currentPositionVector : 'y' });
        useStore.setState({ currentTiltVector : 'x' });
    }

    function swivelCamera(sNo) {
        if (sNo === 0) {
            useStore.setState({ currentDirection : 'f' });
            useStore.setState({ currentSwivelVector : 'y' });
            useStore.setState({ currentPositionVector : 'z' });
            useStore.setState({ currentTiltVector : 'x' });
        } else {
            // It's going clockwise
            if (sNo < 0) {
                // It's behind
                if (sNo == -3.2) {
                    useStore.setState({ currentDirection: 'b' });
                    useStore.setState({ currentSwivelVector : 'y' });
                    useStore.setState({ currentPositionVector : 'z' });
                    useStore.setState({ currentTiltVector : 'x' });
                // Else it's right
                } else {
                    useStore.setState({ currentDirection: 'r' });
                    useStore.setState({ currentSwivelVector : 'y' });
                    useStore.setState({ currentPositionVector : 'x' });
                    useStore.setState({ currentTiltVector : 'z' });
                }
            // Else it's left
            } else {
                useStore.setState({ currentDirection : 'l' });
                useStore.setState({ currentSwivelVector : 'y' });
                useStore.setState({ currentPositionVector : 'x' });
                useStore.setState({ currentTiltVector : 'z' });
            }
        }
        useStore.setState({ currentSwivel: sNo });
    }

    return (
        <div className="menu">
            <div className="rotateMenuWrapper">
                <a className="pg" onClick={ () => {
                    swivelCamera(1.6);
                } }>Left</a>
                <a className="pg" onClick={ () => tiltCamera(1.6) }>Up</a>
                <a className="pg" onClick={ () =>  {
                    tiltCamera(0);
                    swivelCamera(0);
                } }>Ahead</a>
                <a className="pg" onClick={ () =>  {
                    tiltCamera(0);
                    swivelCamera(-3.2);
                } }>Behind</a>
                <a className="pg" onClick={ () => tiltCamera(-1.6) }>Down</a>
                <a className="pg" onClick={ () => swivelCamera(-1.6) }>Right</a>
            </div>
            <div className="positionMenuWrapper">
                <a className="pg" onClick={ () => dollyCamera(0) }>Position 1</a>
                <a className="pg" onClick={ () => dollyCamera(5) }>Position 2</a>
                <a className="pg" onClick={ () => dollyCamera(10) }>Position 3</a>
                <a className="pg" onClick={ () => dollyCamera(15) }>Position 4</a>
                <a className="pg" onClick={ () => dollyCamera(20) }>Position 5</a>
            </div>
        </div>
    );
}

function ScreenBox(props) {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);
    const loader = new TextureLoader();

    myTexture = loader.load(myImage);

    return (
        <mesh
            { ...props }
            ref={ mesh }
            onPointerOver={ e => setHover(true) }
            onPointerOut={ e => setHover(false) }>
            <boxBufferGeometry attach="geometry" args={ [1, 1, 1] }/>
            <meshBasicMaterial map={ myTexture } attach="material" color={ hovered ? 'blue' : 'black' }/>
        </mesh>
    );
}

function App() {
    const { camera } = useThree();
    useStore.setState({currentCamera: camera});
    return (
        <div className="App">
            <Canvas camera={ { position: [0, 0, 0], rotation: [0, 0, 0] } }>
                <ambientLight/>
                <pointLight position={ [0, 11.713, -2.39] }/>
                {/* Default starts in center of scene. Objects spaced in increments of 5. */}
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
            </Canvas>
            <Menu/>
        </div>
    );
}

export default App;
