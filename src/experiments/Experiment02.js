import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import create from 'zustand';
import * as THREE from 'three';
import { TextureLoader, Object3D } from "three";
import myImage from "../resources/images/up.png";

let myTexture = null;
let group = new THREE.Object3D();
let myMesh;

const useStore = create((set, get) => ({

}));

function CameraController() {
    const { camera } = useThree();

    useFrame(() => {

    });

    return null;
}

function Menu() {
    const onClickHandler = () => {
    }
    return (
      <div className="experiment-02"><button onClick={onClickHandler}>Back</button></div>
    );
}

function Group() {
    const { scene, camera } = useThree();
    let geometry = new THREE.BoxGeometry(1.3, 1, .01);

    const material = new THREE.MeshBasicMaterial({
        color: 0xcecece,
        flatShading: true,
        transparent: true,
        opacity: .7,
    });

    for (let i=0; i<7; i++) {
        myMesh = new THREE.Mesh(geometry, material);
        myMesh.position.x = (Math.random() - 0.5) * 10;
        myMesh.position.y = (Math.random() - 0.5) * 10;
        myMesh.position.z = (Math.random() - 0.5) * 10;
        myMesh.rotation.x = Math.random();
        myMesh.rotation.y = Math.random();
        myMesh.rotation.z = Math.random();

        group.add(myMesh);
    }
    const helper = new THREE.CameraHelper(camera);
    scene.add(helper);
    scene.add(group);

    return null;
}

function ScreenBox(props) {
    const mesh = useRef();

    return (
        <mesh
            ref={ mesh }>
            <boxBufferGeometry attach="geometry" args={ [1, 1, 1] } />
            <meshBasicMaterial color="blue" attach="material" transparent />
        </mesh>
    );
}

function Experiment02() {

    return(
        <div className="App">
            <Canvas id="scene-container" camera={{position: [0,0,12]}}>
                <ambientLight />
                <pointLight position={ [0, 3, -2.39] } />
                <Group />

                {/*<ScreenBox rotation={[0, .3, 0]} position={ [0, 0, -1] } />*/}
                {/*<ScreenBox rotation={[0, -.5, 0]} position={ [2, 2, -4] } />*/}
                {/*<ScreenBox rotation={[0, .5, 0]} position={ [0, 3, -2] } />*/}
                {/*<ScreenBox rotation={[0, .2, 0]} position={ [-2, -4, -6] } />*/}
                {/*<ScreenBox rotation={[0, -.3, 0]} position={ [-6, -4, -12] } />*/}
                <CameraController />
            </Canvas>
            {/*<Menu />*/}

        </div>
    );
}

export default Experiment02;
