import React, { useRef, useState } from 'react';
import { Canvas, useThree } from 'react-three-fiber';
import { useSpring } from 'react-spring';
import './App.css';
import create from 'zustand';
import { TextureLoader } from 'three';
import myImage from './logo512.png';

const useStore = create(set => ({
    currentPosition: 2,
    currentTilt: 0,
    currentSwivel: 0,
    setPosition: (cp) => set(state => ({ currentPosition: cp })),
    incrementPosition: () => set(state => ({ currentPosition: state.currentPosition + 1 })),
    resetPosition: () => set({ currentPosition: 0 })
}));

let myTexture = null;

function CameraDolly() {
    const { camera } = useThree();

    useSpring({
        from: {
            z: 0
        },
        z: useStore(state => state.currentPosition),
        onFrame: ({ z }) => {
            camera.position.z = z;
        }
    })

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
        y: useStore(state => state.currentSwivel),
        onFrame: ({ y }) => {
            camera.rotation.y = y;
        }
    })

    return null;
}

function Menu() {
    function positionCamera(pNo) {
        useStore.setState({ currentPosition: pNo });
    }

    function tiltCamera(rNo) {
        useStore.setState({ currentTilt: rNo });
    }

    function swivelCamera(sNo) {
        useStore.setState({ currentSwivel: sNo });
    }

    return (
        <div className="menu">
            <div className="rotateMenuWrapper">
                <a className="pg" onClick={ () => swivelCamera(-1.6) }>Left</a>
                <a className="pg" onClick={ () => tiltCamera(-1.6) }>Up</a>
                <a className="pg" onClick={ () =>  {
                    tiltCamera(0);
                    swivelCamera(0);
                } }>Straight</a>
                <a className="pg" onClick={ () => tiltCamera(1.6) }>Down</a>
                <a className="pg" onClick={ () => swivelCamera(1.6) }>Right</a>
            </div>

            <div className="positionMenuWrapper">
                <a className="pg" onClick={ () => positionCamera(2) }>Position 1</a>
                <a className="pg" onClick={ () => positionCamera(-3) }>Position 2</a>
                <a className="pg" onClick={ () => positionCamera(-8) }>Position 3</a>
                <a className="pg" onClick={ () => positionCamera(-13) }>Position 4</a>
                <a className="pg" onClick={ () => positionCamera(-18) }>Position 5</a>
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
            <meshBasicMaterial map={ myTexture } attach="material" color={ hovered ? 'beige' : 'white' }/>
        </mesh>
    )
}

function App() {
    return (
        <div className="App">
            <Canvas camera={ { position: [0, 0, - 3], rotation: [0, 0, 0] } }>
                <ambientLight/>
                <pointLight position={ [0, 2.588, - 3.764] }/>
                {/* Default starts in center of scene */}
                <ScreenBox position={ [0, 0, 0] }/>
                <ScreenBox position={ [0, 0, - 5] }/>
                <ScreenBox position={ [0, 0, - 10] }/>
                <ScreenBox position={ [0, 0, - 15] }/>
                <ScreenBox position={ [0, 0, - 20] }/>
                {/* Top */}
                <ScreenBox position={ [0, 2, 2] }/>
                <ScreenBox position={ [0, 2, 5] }/>
                {/* Bottom */}
                <ScreenBox position={ [0, -2, 2] }/>
                {/* Left */}
                <ScreenBox position={ [2, 0, 2] }/>
                {/* Right */}
                <ScreenBox position={ [-2, 0, 2] }/>
                <CameraDolly/>
                <CameraTilt/>
                <CameraSwivel/>
            </Canvas>
            <Menu/>
        </div>
    );
}

export default App;
