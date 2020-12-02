import React, { useEffect, useRef } from 'react';
import { Canvas, extend, useFrame, useThree } from 'react-three-fiber';
import create from 'zustand';
import * as THREE from 'three';
import {Quaternion} from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three";

let myTexture = null;
let group = new THREE.Object3D();
let myMesh;

extend({ OrbitControls });

const useStore = create((set, get) => ({
    targetVector: new Vector3(0,0,15),
    selectedQuaternion: new Quaternion(0,0,0),
    selectedObject: null,
    enableControls: true
}));

const CameraController = () => {
    const { camera, gl } = useThree();
    const ec = useStore(state => state.enableControls);
    useEffect(
        () => {
            const controls = new OrbitControls(camera, gl.domElement);

            controls.minDistance = 3;
            controls.maxDistance = 20;
            controls.enabled = false;
            controls.enablePan = false;
            controls.enableRotate = ec;
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
    let myTargetVector  = useStore(state => state.targetVector);
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
                enableControls: false});
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
        { [1, 1, 1, 1, 1, 1, 1].map((item) => {
            return (<ScreenObject
                key={ Date.now() + Math.random() * 20 }
                position={ [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10] }
                rotation={ [(Math.random() - 0.5), (Math.random() - 0.5), (Math.random() - 0.5)] }/>);
        }) }
    </group>);
}

function Experiment02() {

    function init() {
        console.log('init'  );
    }
    return (
        <div className="App">
            <Canvas onLoad={() => init()} id="scene-container" camera={ { position: [0, 0, 12] } }>
                <CameraController/>
                <CameraZoomie/>
                <ambientLight/>
                <pointLight position={ [0, 3, - 2.39] }/>
                <Group/>
            </Canvas>
        </div>
    );
}

export default Experiment02;
