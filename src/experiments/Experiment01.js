import React, { Suspense, useRef } from 'react';
import { Canvas, useThree } from 'react-three-fiber';
import { useSpring } from 'react-spring';
import create from 'zustand';
import { TextureLoader, Vector3 } from 'three';
import * as THREE from 'three';
import myImage from "../resources/images/up.png";

let myTexture = null;

const useStore = create((set, get) => ({
    currentCamera: null,
    currentCameraPosition: null,
    targetVector: null,
    getCurrentAxis: ({x,y,z}) => {
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
    moveAndLookAt: ({x,y,z}) => {
        console.log('moveAndLookAt', {x,y,z});
        console.log('get(\'currentCamera\')', get('currentCamera'));

        let destinationRotation = new THREE.Euler().copy(get().currentCamera.rotation);
        console.log('destinationRotation', destinationRotation);

        // Current camera's quaternion
        let sourceQuaternion = new THREE.Quaternion().copy(get().currentCamera.quaternion);
        console.log('sourceQuaternion', sourceQuaternion);

        // Destination quaternion
        let destinationQuaternion = new THREE.Quaternion().setFromEuler(destinationRotation);
        console.log('destinationQuaternion', destinationQuaternion);
        let finalQuaternion = new THREE.Quaternion();

        get('currentCamera').quaternion = destinationQuaternion;
        get('currentCamera').position = new Vector3(x,y,z);

        THREE.Quaternion.slerp(sourceQuaternion, destinationQuaternion, finalQuaternion, 1);

        get('currentCamera').quaternion.set(finalQuaternion.x, finalQuaternion.y, finalQuaternion.z, finalQuaternion.w);

    }
}));

function PositionCamera() {
    console.log('///////////////////// PositionCamera /////////////////////');
    const { camera } = useThree();

    useStore.setState({currentCamera: camera});

    const targetV = useStore.getState().targetVector ?
        useStore.getState().targetVector :
            new Vector3(camera.position.x,camera.position.y,camera.position.z);

    let origPos = new THREE.Vector3().copy(camera.position);
    let fromObj = {};
    let toObj = {};

    fromObj['x'] = origPos.x;
    fromObj['y'] = origPos.y;
    fromObj['z'] = origPos.z;

    toObj['x'] = targetV.x;
    toObj['y'] = targetV.y;
    toObj['z'] = targetV.z;

    useSpring({
        from: origPos,
        to: targetV,
        onFrame: useStore.getState().moveAndLookAt
    });

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
            <meshBasicMaterial map={ myTexture } attach="material" transparent />
        </mesh>
    );
}

function Menu() {
    function onHomeClicked() {
        
    }
    return (
      <div className="menu experiment-01"><a onClick={() => onHomeClicked() }>Home</a></div>
    );
}

function Experiment01() {

    function onScreenClickHandler(e) {
        console.log('e', e);
        console.log('e.object.position.x', e.object.position.x);
        console.log('e.object.position.y', e.object.position.y);
        console.log('e.object.position.z', e.object.position.z);

        const selectedObjectVector = new Vector3(e.object.position.x, e.object.position.y, e.object.position.z);

        useStore.setState({ targetVector: selectedObjectVector });
    }
    return(
        <div className="App">
            <Canvas>
                <ambientLight />

                <ScreenBox onClick={onScreenClickHandler} rotation={[0, .1, 0]} position={ [0, 0, -1] } />
                <ScreenBox onClick={onScreenClickHandler} position={ [2, 2, -4] } />
                <ScreenBox onClick={onScreenClickHandler} position={ [0, 4, -2] } />
                <ScreenBox onClick={onScreenClickHandler} position={ [-2, -4, -6] } />
                <ScreenBox onClick={onScreenClickHandler} position={ [-6, -4, -12] } />
                <PositionCamera />
            </Canvas>
            <Menu />
        </div>
    );
}

export default Experiment01;
