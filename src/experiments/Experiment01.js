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
    targetVector: new THREE.Vector3(0,.5,3)
}));

function PositionCamera() {
    
    const { camera, gl, scene, renderer } = useThree();
    // Will receive change every time targetVector changes
    let myTargetVector = useStore(state => state.targetVector);
    // Get the  selected object's quaternion
    let dstQ = useStore(state => state.selectedQuaternion);
    // Use offsets to center the object in frame
    myTargetVector.setZ(myTargetVector.z + .7);
    // myTargetVector.setX(myTargetVector.x + .1);

    useFrame(() => {
        camera.quaternion.slerp(dstQ, .03);
        camera.position.lerp(myTargetVector, 0.1);
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
            <boxBufferGeometry attach="geometry" args={ [1.3, 1, .03] }/>
            <meshBasicMaterial map={ myTexture } attach="material" transparent />
        </mesh>
    );
}

function Menu() {
    const onHomeClickHandler = () => {
        useStore.setState({ targetVector: new THREE.Vector3(0,.5,3), selectedQuaternion: useStore.getState().originalCameraQuaternion });
    }
    return (
      <div className="menu experiment-01"><a onClick={onHomeClickHandler}>Zoom Out</a></div>
    );
}

function Experiment01() {

    const onScreenClickHandler = (e) => {
        useStore.setState({ targetVector: new THREE.Vector3().copy(e.object.position), selectedQuaternion: e.object.quaternion });
    }

    return(
        <div className="App">
            <Menu />
            <Canvas id="scene-container">
                <ambientLight />
                <pointLight position={ [0, 3, -2.39] }/>
                <ScreenBox onClick={onScreenClickHandler} rotation={[0, .3, 0]} position={ [0, 0, -1] } />
                <ScreenBox onClick={onScreenClickHandler} position={ [2, 2, -4] } />
                <ScreenBox onClick={onScreenClickHandler} position={ [0, 4, -2] } />
                <ScreenBox onClick={onScreenClickHandler} position={ [-2, -4, -6] } />
                <ScreenBox onClick={onScreenClickHandler} rotation={[0, -.3, 0]} position={ [-6, -4, -12] } />
                <PositionCamera />
            </Canvas>

        </div>
    );
}

export default Experiment01;
