import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import create from 'zustand';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import myImage from "../resources/images/up.png";

let myTexture = null;

const useStore = create((set, get) => ({
    originalCameraQuaternion: new THREE.Quaternion(0,0,0,.5),
    selectedQuaternion: new THREE.Quaternion(0,0,0,.5),
    targetVector: new THREE.Vector3(0,.5,3),
    selectedObject: null
}));

function CameraController() {
    const { camera, scene } = useThree();

    const helper = new THREE.CameraHelper(camera);
    scene.add(helper);

    // Will receive change every time targetVector changes
    let myTargetVector = useStore(state => state.targetVector);
    // Get the  selected object's quaternion
    let dstQ = useStore(state => state.selectedQuaternion);
    let targetObject = useStore(state => state.selectedObject);
    // Use offsets to center the object in frame
    myTargetVector.setZ(myTargetVector.z + .9);

    useFrame(() => {
        camera.quaternion.slerp(dstQ, .05);
        camera.position.lerp(myTargetVector, 0.05);
    })

    return null;
}

function ScreenBox(props) {
    const mesh = useRef();
    const loader = new TextureLoader();

    myTexture = loader.load(myImage);

    return (
        <mesh
            { ...props }
            ref={ mesh }>
            <boxBufferGeometry attach="geometry" args={ [1.3, 1, .01] } />
            <meshBasicMaterial map={ myTexture } attach="material" transparent />
        </mesh>
    );
}

function Menu() {

    const onHomeClickHandler = () => {
        useStore.setState({ targetVector: new THREE.Vector3(0,.5,3), selectedQuaternion: useStore.getState().originalCameraQuaternion });
    }

    return (
      <div className="experiment-01"><button onClick={onHomeClickHandler}>Back</button></div>
    );
}

function Experiment01() {

    const onScreenClickHandler = (e) => {
        useStore.setState({ targetVector: new THREE.Vector3().copy(e.object.position),
            selectedQuaternion: e.object.quaternion,
            selectedObject: e.object});
    }

    return(
        <div className="App">
            <Canvas id="scene-container">
                <ambientLight />
                <pointLight position={ [0, 3, -2.39] } />
                <ScreenBox onClick={onScreenClickHandler} rotation={[0, .3, 0]} position={ [0, 0, -1] } />
                <ScreenBox onClick={onScreenClickHandler} rotation={[0, -.5, 0]} position={ [2, 2, -4] } />
                <ScreenBox onClick={onScreenClickHandler} rotation={[0, .5, 0]} position={ [0, 3, -2] } />
                <ScreenBox onClick={onScreenClickHandler} rotation={[0, .2, 0]} position={ [-2, -4, -6] } />
                <ScreenBox onClick={onScreenClickHandler} rotation={[0, -.3, 0]} position={ [-6, -4, -12] } />
                <CameraController />
            </Canvas>
            <Menu />
        </div>
    );
}

export default Experiment01;
