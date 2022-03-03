import React, { useRef } from 'react';
import { Canvas, useThree } from 'react-three-fiber';
import create from 'zustand';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let videoTexture = null;

const useStore = create((set, get) => ({
    targetVector: new Vector3(0, 0, 15),
    controls: null,
    enableControls: true,
    screens: [
        {
            key: 0,
            label: 'Screen 1'
        }
    ],
}));

const init = () => {
    useStore.setState({
        targetVector: new THREE.Vector3(0, 0, 15)
    });
}

function ScreenPanel(props) {
    const mesh = useRef();

    let video = document.getElementById('video');
    let videoTexture = new THREE.VideoTexture(video);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {

        const constraints = {
            video: {
                width: 1280,
                height: 720,
                facingMode: 'user'
            }
        };

        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            video.srcObject = stream;
            video.play();
        }).catch(function (error) {
            console.error('Unable to access the camera/webcam.', error);
        });

    } else {
        console.error('MediaDevices interface not available.');
    }

    return (<mesh
        { ...props }
        ref={ mesh }
        scale={ [1, 1, 1] }>

        <planeBufferGeometry attach="geometry" args={ [2, 1] }/>
        <meshBasicMaterial map={ videoTexture } color={ 0xcecece } attach="material" side={ THREE.DoubleSide }/>
    </mesh>);
}

const Orbiter = () => {
    const { camera, gl } = useThree();
    const enableControls = useStore(state => state.enableControls);
    let storeControls = useStore(state => state.controls);

    if (storeControls === null) {
        storeControls = new OrbitControls(camera, gl.domElement);
        useStore.setState({ controls: storeControls });
    }

    storeControls.enabled = enableControls;
    storeControls.enableRotate = enableControls;
    storeControls.enablePan = enableControls;
    storeControls.enableZoom = enableControls;
    storeControls.enableDamping = enableControls;
    storeControls.enableKeys = enableControls;
    storeControls.noPan = enableControls;

    return null;
};

function Screen() {
    return (<group>
        { useStore.getState().screens.map((item) => {
            return (<ScreenPanel
                key={ Date.now() + Math.random() * 20 }
                position={ [0, 0, 0] }
                rotation={ [0, 0, 0] }/>);
        }) }
    </group>);
}

function VideoObject() {
    return (<video id="video" autoPlay playsInline style={ { display: 'none' } }></video>)
}

function Menu() {
    const onPlayClicked = () => {
        console.log('onPlayClicked');

    }
    return (
        <div className="experiment-03">
            <button onClick={ onPlayClicked }>Play</button>
        </div>
    );
}

function Experiment03() {

    init();

    return (
        <div className="App">
            <Canvas id="scene-container"
                    camera={ { fov: 45, aspect: window.innerWidth / window.innerHeight, position: [0, 0, 2] } }>
                <Orbiter/>
                <ambientLight/>
                <pointLight position={ [0, 3, - 2.39] }/>
                <Screen/>
            </Canvas>
            <Menu/>
            <VideoObject/>
        </div>
    );
}

export default Experiment03;
