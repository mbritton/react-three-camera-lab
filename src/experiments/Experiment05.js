import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import create from 'zustand';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const useStore = create((set, get) => ({
    controls: null,
    targetVector: new Vector3(0, 0, 2),
    homeVector: new Vector3(0, 0, 2),
    selectedQuaternion: new THREE.Quaternion(0, 0, 0, .5),
    homeQuaternion: new THREE.Quaternion(0, 0, 0, .5),
    selectedObject: null,
    enableControls: false,
    screens: [
        {
            key: 0,
            label: 'Screen 1',
            position: [0, 0, -2.502],
            rotation: [-20, 0, 0],
            color: 0x006eff
        },
        {
            key: 1,
            label: 'Screen 2',
            position: [2, 0, -2.502],
            rotation: [-20, 0, 0],
            color: 0xa81a7b
        },
        {
            key: 3,
            label: 'Screen 3',
            position: [-2, 0, -2.502],
            rotation: [-20, 0, 0],
            color: 0xfdd600
        }
    ],
}));

const init = () => {
    useStore.setState({
        targetVector: new THREE.Vector3(0, 0, 2),
        selectedQuaternion: useStore.getState().homeQuaternion,
        enableControls: false
    });
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

function CameraZoomer() {
    const { camera } = useThree();
    const enableControls = useStore(state => state.enableControls);
    const targetVector = useStore(state => state.targetVector);
    let myTargetVector = (enableControls === false) ? targetVector : camera.position;
    const selQ = useStore(state => state.selectedQuaternion);
    const dstQ = (enableControls === false) ? selQ : camera.quaternion;

    // Use offsets to center the object in frame
    myTargetVector.setZ(myTargetVector.z + .3);

    useFrame(() => {
        camera.position.lerp(myTargetVector, 0.1);
        camera.quaternion.slerp(dstQ, .08);
    });

    return null;
}

function ScreenObject(props) {
    const mesh = useRef();
    return (<mesh
        { ...props }
        ref={ mesh }
        scale={ [1, 1, 1] }
        onClick={ (e) => {
            useStore.setState({
                targetVector: new THREE.Vector3().copy(e.object.position),
                selectedObject: e.object,
                selectedQuaternion: new THREE.Quaternion().copy(e.object.quaternion),
                enableControls: false
            });
        } }>
        <boxBufferGeometry attach="geometry" args={ [1.3, 1, .01] }/>
        <meshBasicMaterial color={ props.color } attach="material" side={ THREE.DoubleSide }/>
    </mesh>);
}

function Group() {
    return (<group>
        { useStore.getState().screens.map((item) => {
            return (<ScreenObject
                key={ item.key }
                position={ item.position }
                rotation={ item.rotation }
            color={ item.color }/>);
        }) }
    </group>);
}

function Menu() {
    const onHomeClicked = () => {
        useStore.setState({
            targetVector: useStore.getState().homeVector,
            selectedQuaternion: useStore.getState().homeQuaternion,
            enableControls: false
        });
    }
    return (
        <div className="experiment-02">
            <button onClick={ onHomeClicked }>Home</button>
        </div>
    );
}

function RotateButton(ce) {
    const controlsEnabled = useStore(state => state.enableControls);
    const onClicked = () => {
        useStore.setState({
            enableControls: !useStore.getState().enableControls
        });
    }
    return (
        <div>
            <button className="rotate-button"
                    onClick={ onClicked }>{ (controlsEnabled === false) ? "Enable" : "Disable" } Rotate
            </button>
        </div>
    );
}

function Experiment05() {

    init();

    return (
        <div className="App">
            <Canvas id="scene-container">
                <Orbiter/>
                <CameraZoomer/>
                <ambientLight/>
                <pointLight position={ [0, 3, - 2.39] }/>
                <Group/>
            </Canvas>
            <Menu/>
            <RotateButton/>
        </div>
    );
}

export default Experiment05;
