import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from 'react-three-fiber';
import create from 'zustand';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { LoadingManager } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const useStore = create((set, get) => ({
    controls: null,
    targetVector: new THREE.Vector3(0, 0, 15),
    selectedQuaternion: new THREE.Quaternion(0, 0, 0, .5),
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

const init = () => {
    useStore.setState({
        targetVector: new THREE.Vector3(0, 0, 15),
        selectedQuaternion: useStore.getState().homeQuaternion,
        enableControls: true
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
    myTargetVector.setZ(myTargetVector.z + .8);

    useFrame(() => {
        camera.quaternion.slerp(dstQ, .08);
        camera.position.lerp(myTargetVector, 0.1);
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
                selectedQuaternion: e.object.quaternion,
                enableControls: false
            });
        } }>
        <boxBufferGeometry attach="geometry" args={ [1.3, 1, .01] }/>
        <meshBasicMaterial color={ 0x006eff } attach="material" side={ THREE.DoubleSide }/>
    </mesh>);
}

function Group() {
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
            targetVector: new THREE.Vector3(0, 0, 15),
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



/**
 * Not using fiber - for inset functionality.
 * @returns {null}
 * @constructor
 */
function InsetNavigation() {
    let myCanvas;
    let material;
    let geometry;
    let box;
    let camera;
    let renderer;
    let myControls;
    let myColladaImport;

    const geometries = [
        new THREE.BoxBufferGeometry(1, 1, 1),
        new THREE.SphereBufferGeometry(0.5, 12, 8),
        new THREE.DodecahedronBufferGeometry(0.5),
        new THREE.CylinderBufferGeometry(0.5, 0.5, 1, 12)
    ];

    const scene = new THREE.Scene();
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(1, 3, 1);
    scene.add(light);

    const init = () => {
        myCanvas = document.getElementById("insetNavigation");

        material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        geometry = geometries[ 1 ];
        box = new THREE.Mesh(geometry, material);
        box.position.set(0, 0, 3);

        scene.add(box);

        camera = new THREE.PerspectiveCamera(50, 1, 1);
        camera.position.set(0,0,5);

        scene.userData.camera = camera;

        renderer = new THREE.WebGLRenderer({ canvas: myCanvas, antialias: true, alpha: true });
        renderer.setClearColor( 0x000000, 0);
        renderer.setSize(600, 400);

        setTimeout(() => {
            myControls = new OrbitControls(camera, renderer.domElement);
            myControls.enable = true;
            // myControls.enableRotate = true;
            // myControls.enablePan = true;
            // myControls.enableZoom = true;
            // myControls.enableDamping = false;
            // myControls.enableKeys = true;
            scene.userData.controls = myControls;

            myControls.target = new THREE.Vector3().copy(box.position);

            const manager = new LoadingManager(() => {
                scene.add(myColladaImport);
            });

            // Import model
            const myLoader = new GLTFLoader(manager);
            myLoader.load("3d/experiment.gltf", (coll) => {
                console.log('load complete!  coll: ', coll);
                myColladaImport = coll.scene;

                // myColladaImport.traverse( function ( node ) {
                //     if ( node.isSkinnedMesh ) {
                //         node.frustumCulled = false;
                //     }
                // } );
            }, (progressEvent) => {
                console.log('PROGRESS', progressEvent);
            }, (errorEvent) => {
                console.log('ERROR', errorEvent);
            });

            animate();
        }, 0);
    }
    
    const animate = () => {
        requestAnimationFrame( animate );
        render();
    }
    
    const render = () => {
        renderer.render( scene, camera );
    }

    setTimeout(() => {
        init();
    }, 0);

    return (
        <canvas id="insetNavigation"></canvas>
    );
}

function Experiment04() {

    init();

    return (
        <div className="App">
            <div className="insetNavigationWrapper">
                <InsetNavigation/>
            </div>
            <Canvas id="scene-container" camera={ { position: [0, 0, 12] } }>
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

export default Experiment04;
