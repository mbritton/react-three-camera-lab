import React, { useEffect, useRef } from 'react';
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber';
import create from 'zustand';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

let myTexture = null;
let group = new THREE.Object3D();
let myMesh;

extend({ OrbitControls });

const useStore = create((set, get) => ({
    targetVector: new Vector3(0, 0, 15),
    selectedQuaternion: new THREE.Quaternion(0, 0, 0),
    homeQuaternion: new THREE.Quaternion(0, 0, 0, .5),
    selectedObject: null,
    enableControls: false,
    screens: [
        {
            key: 0,
            label: 'Screen 1'
        }, {
            key: 1,
            label: 'Screen 2'
        }, {
            key: 2,
            label: 'Screen 3'
        }, {
            key: 3,
            label: 'Screen 4'
        }, {
            key: 4,
            label: 'Screen 5'
        }, {
            key: 5,
            label: 'Screen 6'
        }, {
            key: 6,
            label: 'Screen 7'
        }, {
            key: 7,
            label: 'Screen 8'
        }, {
            key: 8,
            label: 'Screen 9'
        }, {
            key: 9,
            label: 'Screen 10'
        }
    ],
}));

const CameraController = () => {
    const { camera, gl } = useThree();
    const ec = useStore(state => state.enableControls);
    const controls = new OrbitControls(camera, gl.domElement);
    useEffect(
        () => {
            controls.minDistance = 3;
            controls.maxDistance = 20;
            controls.enabled = ec;
            return () => {
                controls.dispose();
            };
        },
        [camera, gl]
    );
    return null;
};

function CameraZoomie() {
    const { camera } = useThree();
    let myTargetVector = useStore(state => state.targetVector);
    let dstQ = useStore(state => state.selectedQuaternion);

    // Use offsets to center the object in frame
    myTargetVector.setZ(myTargetVector.z + .9);

    useFrame(() => {
        camera.quaternion.slerp(dstQ, .05);
        camera.position.lerp(myTargetVector, 0.05);
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
                targetObject: e.object,
                targetVector: new THREE.Vector3().copy(e.object.position),
                selectedObject: e.object,
                selectedQuaternion: e.object.quaternion,
                enableControls: false
            });
        } }>
        <boxBufferGeometry attach="geometry" args={ [1.3, 1, .01] }/>
        <meshBasicMaterial attach="material" transparent side={ THREE.DoubleSide }/>
    </mesh>);
}

function Group() {
    const { scene, camera } = useThree();

    const material = new THREE.MeshBasicMaterial({
        color: 0xcecece,
        flatShading: true,
        transparent: true,
        opacity: .7
    });

    return (<group>
        { useStore.getState().screens.map((item) => {
            return (<ScreenObject
                key={ Date.now() + Math.random() * 20 }
                position={ [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10] }
                rotation={ [(Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)] }/>);
        }) }
    </group>);
}

function Menu() {
    const onHomeClicked = () => {
        useStore.setState({
            targetVector: new THREE.Vector3(0, 0, 12),
            selectedQuaternion: useStore.getState().homeQuaternion
        });
    }
    return (
        <div className="experiment-02">
            <button onClick={ onHomeClicked }>Home</button>
        </div>
    );
}

function Experiment02() {
    let moved = false;
    let elem = document.querySelector('.App');

    let downListener = (e) => {
        moved = false;
    }

    let upListener = (e) => {
        if (moved) {
            console.log('Moved');
            useStore.setState({enableControls: true});
        } else {
            console.log('Not Moved');
            useStore.setState({enableControls: false});
        }
    }

    let moveListener = (e) => {
        moved = true;
    }

    const init = () => {
        setTimeout(() => {
            elem = document.querySelector('.App');
            elem.addEventListener('mousedown', downListener);
            elem.addEventListener('mouseup', upListener);
            elem.addEventListener('mousemove', moveListener);
        }, 1000);
    }

    init();

    return (
        <div className="App">
            <Canvas id="scene-container" camera={ { position: [0, 0, 12] } }>
                <CameraController/>
                <CameraZoomie/>
                <ambientLight/>
                <pointLight position={ [0, 3, - 2.39] }/>
                <Group/>
            </Canvas>
            <Menu/>
        </div>
    );
}

export default Experiment02;
