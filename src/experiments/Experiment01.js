import React, { useRef, Suspense } from 'react';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import { useSpring } from 'react-spring';
import create from 'zustand';
import { PerspectiveCamera, TextureLoader } from 'three';
import * as THREE from 'three';
import myImage from "../resources/images/up.png";

let myTexture = null;

const useStore = create((set, get) => ({
    currentCamera: new PerspectiveCamera(),
    currentCameraPosition: new THREE.Vector3(0,0,5),
    currentGL: null,
    currentScene: null,
    currentRenderer: null,
    selectedQuaternion: new THREE.Quaternion(0,0,0,.5),
    targetVector: new THREE.Vector3(0,0,0)
}));

function PositionCamera() {
    
    const { camera, gl, scene, renderer } = useThree();
    // Will receive change every time targetVector changes
    let myTargetVector = useStore(state => state.targetVector);
    let dstQ = useStore(state => state.selectedQuaternion);
    myTargetVector.setZ(myTargetVector.z + 1);

    useFrame(() => {
        camera.quaternion.slerp(dstQ, .03);
        camera.position.lerp(myTargetVector, 0.03);
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
            <boxBufferGeometry attach="geometry" args={ [1.3, 1, .1] }/>
            <meshBasicMaterial map={ myTexture } attach="material" />

        </mesh>
    );
}

function Menu() {
    return (
      <div className="menu experiment-01"><a onClick={() => {
          useStore.setState({ targetVector: new THREE.Vector3(0,0,5) });
      } }>Home</a></div>
    );
}

function Experiment01() {

    const onScreenClickHandler = (e) => {
        console.log('e.object', e.object.quaternion);
        // let selectedObjectVector = new THREE.Vector3(e.object.position.x, e.object.position.y, e.object.position.z);
        useStore.setState({ targetVector: new THREE.Vector3().copy(e.object.position), selectedQuaternion: e.object.quaternion });

        const foo = useStore.getState().selectedQuaternion;
        console.log('foo', foo);
    }

    return(
        <div className="App">
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
            <Menu />
        </div>
    );
}

export default Experiment01;
