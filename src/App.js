import React, { useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import { useSpring } from 'react-spring';
import './App.css';
import create from 'zustand';
import { TextureLoader } from 'three';
import myImage from './logo512.png';

const useStore = create((set, get) => ({
    currentDollyPosition: {amount: 2, vector: 'z'},
    currentTilt: 0,
    currentSwivel: 0,
    currentVector: 'z',
    currentCamera: null,
    currentDollyPositionX: 0,
    onFrameFunction: ({z}) => {
        get().currentCamera.position[get().currentVector] = z;
        console.log('Camera Position: ', get().currentCamera.position[get().currentVector]);
        console.log('Camera Direction: ', get().currentVector);
    }
}));

let myTexture = null;

function CameraDolly() {
    const { gl, scene, camera, size } = useThree();

    const cv = useStore(state => state.currentVector);
    const cda = useStore(state => state.currentDollyPosition.amount);

    useStore.setState({currentCamera: camera});

    let fromObj = {}, toObj = {};
    fromObj[cv !== undefined ? cv : 'z'] = 0;
    toObj[cv !== undefined ? cv : 'z'] = cda;

    useSpring({  from: fromObj, to: toObj, onFrame: useStore.getState().onFrameFunction })

    return null;
}

function CameraTilt() {
    const { camera } = useThree();

    useSpring({
        from: {
            x: 0
        },
        x: useStore(state => state.currentTilt),
        onFrame: ({ x }) => {
            camera.rotation.x = x;
        }
    })

    return null;
}

function CameraSwivel() {
    const { camera } = useThree();

    useSpring({
        from: {
            y: 0
        },
        to: {
            y: useStore(state => state.currentSwivel)
        },
        onFrame: ({ y }) => {
            camera.rotation.y = y;
        }
    })

    return null;
}

function Menu() {
    function dollyCamera(pNo) {
        useStore.setState({ currentDollyPosition: { amount: pNo } });
    }

    function tiltCamera(rNo) {
        useStore.setState({ currentTilt: rNo });
    }

    function swivelCamera(sNo) {
        useStore.setState({ currentSwivel: sNo });
    }

    function setVector(vD) {
        useStore.setState({ currentVector: vD });
    }

    return (
        <div className="menu">
            <div className="rotateMenuWrapper">
                <a className="pg" onClick={ () => {
                    // Maybe trigger a sequence instead?
                    // setVector('x');
                    swivelCamera(1.6);
                } }>Left</a>
                <a className="pg" onClick={ () => tiltCamera(1.6) }>Up</a>
                <a className="pg" onClick={ () =>  {
                    setVector('z');
                    tiltCamera(0);
                    swivelCamera(0);
                } }>Ahead</a>
                <a className="pg" onClick={ () =>  {
                    setVector('z');
                    tiltCamera(0);
                    swivelCamera(-3.2);
                } }>Behind</a>
                <a className="pg" onClick={ () => tiltCamera(-1.6) }>Down</a>
                <a className="pg" onClick={ () => swivelCamera(-1.6) }>Right</a>
            </div>

            <div className="positionMenuWrapper">
                <a className="pg" onClick={ () => dollyCamera(2) }>Position 1</a>
                <a className="pg" onClick={ () => dollyCamera(-3) }>Position 2</a>
                <a className="pg" onClick={ () => dollyCamera(-8) }>Position 3</a>
                <a className="pg" onClick={ () => dollyCamera(-13) }>Position 4</a>
                <a className="pg" onClick={ () => dollyCamera(-18) }>Position 5</a>
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
    )
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
                <ScreenBox position={ [0, 0, 0] }/>
                <ScreenBox position={ [0, 0, -5] }/>
                <ScreenBox position={ [0, 0, -10] }/>
                <ScreenBox position={ [0, 0, -15] }/>
                <ScreenBox position={ [0, 0, -20] }/>
                {/* Top */}
                <ScreenBox position={ [0, 2, 2] }/>
                <ScreenBox position={ [0, 7, 2] }/>
                <ScreenBox position={ [0, 12, 2] }/>
                <ScreenBox position={ [0, 17, 2] }/>
                <ScreenBox position={ [0, 22, 2] }/>
                {/* Bottom */}
                <ScreenBox position={ [0, -2, 2] }/>
                <ScreenBox position={ [0, -7, 2] }/>
                <ScreenBox position={ [0, -12, 2] }/>
                <ScreenBox position={ [0, -17, 2] }/>
                <ScreenBox position={ [0, -22, 2] }/>
                {/* Left */}
                <ScreenBox position={ [2, 0, 2] }/>
                <ScreenBox position={ [7, 0, 2] }/>
                <ScreenBox position={ [12, 0, 2] }/>
                <ScreenBox position={ [17, 0, 2] }/>
                <ScreenBox position={ [22, 0, 2] }/>
                {/* Right */}
                <ScreenBox position={ [-2, 0, 2] }/>
                <ScreenBox position={ [-7, 0, 2] }/>
                <ScreenBox position={ [-12, 0, 2] }/>
                <ScreenBox position={ [-17, 0, 2] }/>
                <ScreenBox position={ [-22, 0, 2] }/>
                {/* Behind */}
                <ScreenBox position={ [0, 0, 4] }/>
                <ScreenBox position={ [0, 0, 9] }/>
                <ScreenBox position={ [0, 0, 14] }/>
                <ScreenBox position={ [0, 0, 19] }/>
                <ScreenBox position={ [0, 0, 24] }/>

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
