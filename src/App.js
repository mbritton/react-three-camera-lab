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
    onFrameFunction: ({ z }) => {
        // console.log('get().currentCamera', get().currentCamera);
        // console.log('get().currentVector', get().currentVector);
        // console.log('get().currentDollyPosition.amount', get().currentDollyPosition.amount);
        get().currentCamera.position[get().currentVector] = z;
    }
}));

let myTexture = null;

function CameraDolly() {
    const { gl, ref, scene, camera, size } = useThree();

    // Needs vector...default is z.
    // Vector will be the dimensional plane until it becomes object-to-object.
    // Get dynamic config via some accessor function?

    const cv = useStore(state => state.currentVector);
    const cda = useStore(state => state.currentDollyPosition.amount);
    useStore.setState({currentCamera: camera});

    // let wholeObj = {};
    let fromObj = {};
    fromObj[cv !== undefined ? cv : 'z'] = 0;
    let toObj = {};
    toObj[cv !== undefined ? cv : 'z'] = cda;
    // wholeObj['from'] = fromObj;
    // wholeObj[cv ? cv : 'z'] = useStore(state => state.currentDollyPosition.amount);
    //wholeObj['fooFrame'] = JSON.parse('({ '+ cv ? cv : 'z' + ' }) => camera["position"][' + cv ? cv : 'z' + '] = ' + cda);
    //     camera.position['z'] = cda;
    // }

    // Find new way to build spring call dynamically, or use Three differently for this...

    // O = {};
    // newO['from'] = wholeObj['from'];
    // newOlet new[wholeObj[cv ? cv : 'z']] = useStore(state => state.currentDollyPosition.amount);
    //newO['onFrame'] = wholeObj['fooFrame'];
    // useSpring(newO);

    console.log('fromObj', fromObj);
    console.log('toObj', toObj);

    useSpring({
        from: fromObj,
        to: toObj,
        onFrame: useStore(state => state.onFrameFunction)
    })

    // useSpring({
    //     from: { z: 0 },
    //     z: useStore(state => state.currentDollyPosition.amount),
    //     onFrame: ({z}) => {
    //         camera.position.z = z;
    //     }
    // })

    // useSpring({
    //     from: { z: 0 },
    //     z: useStore(state => state.currentDollyPosition.amount),
    //     onFrame: ({z}) => {
    //         camera.position.z = z;
    //     }
    // })

    // useFrame(() => {
        // console.log('camera.position', camera.position);
        // console.log('cda', cda);
        // camera.position.z = -cda;
        // camera.updateMatrix();
        // scene.updateMatrix();
        // gl.autoClear = true;
        // gl.render(scene, camera);
        // gl.autoClear = false;
        // gl.clearDepth();
    // })

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
                    setVector('x');
                    swivelCamera(- 1.6);
                } }>Left</a>
                <a className="pg" onClick={ () => tiltCamera(-1.6) }>Up</a>
                <a className="pg" onClick={ () =>  {
                    tiltCamera(0);
                    swivelCamera(0);
                } }>Ahead</a>
                <a className="pg" onClick={ () =>  {
                    tiltCamera(0);
                    swivelCamera(-3.2);
                } }>Behind</a>
                <a className="pg" onClick={ () => tiltCamera(1.6) }>Down</a>
                <a className="pg" onClick={ () => swivelCamera(1.6) }>Right</a>
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
            <Canvas camera={ { position: [0, 0, -3], rotation: [0, 0, 0] } }>
                <ambientLight/>
                <pointLight position={ [0, 11.713, -2.39] }/>
                {/* Default starts in center of scene. Objects spaced in increments of 5. */}
                <ScreenBox position={ [0, 0, 0] }/>
                <ScreenBox position={ [0, 0, - 5] }/>
                <ScreenBox position={ [0, 0, - 10] }/>
                <ScreenBox position={ [0, 0, - 15] }/>
                <ScreenBox position={ [0, 0, - 20] }/>
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
