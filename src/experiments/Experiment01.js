import React, { useRef, Suspense } from 'react';
import { Canvas, useThree } from 'react-three-fiber';
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
    targetVector: new THREE.Vector3(0,0,5),
    onFrame: ({x,y,z}) => {
        let destinationRotation = new THREE.Euler().copy(get().currentCamera.rotation);

        // Current camera's quaternion
        let sourceQuaternion = new THREE.Quaternion().copy(get().currentCamera.quaternion);

        // Destination quaternion
        let destinationQuaternion = new THREE.Quaternion().setFromEuler(destinationRotation);
        let finalQuaternion = new THREE.Quaternion();

        get().currentCamera.position.set(x,y,z + 1);

        THREE.Quaternion.slerp(sourceQuaternion, destinationQuaternion, finalQuaternion, 1);

        get().currentCamera.quaternion.set(finalQuaternion.x, finalQuaternion.y, finalQuaternion.z, finalQuaternion.w);

        // Scene will not render on first load without this.
        get().currentGL.render(get().currentScene, get().currentCamera);
    }
}));

function PositionCamera() {
    
    const { camera, gl, scene, renderer } = useThree();
    const myTargetVector = useStore.getState().targetVector;
    
    useStore.setState({currentCamera: camera, currentGL: gl, currentScene: scene, currentRenderer: renderer});

    let targetV = myTargetVector ? myTargetVector : new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);
    let origPos = new THREE.Vector3().copy(camera.position);

    useSpring({
        to: {
            x: useStore ? useStore.getState().targetVector.x : 0,
            y: useStore ? useStore.getState().targetVector.y : 0,
            z: useStore ? useStore.getState().targetVector.z : 0
        },
        from: {
            x: origPos ? origPos.x : 0,
            y: origPos ? origPos.y : 0,
            z: origPos ? origPos.z : 0
        },
        onFrame: useStore.getState().onFrame
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
        let selectedObjectVector = new THREE.Vector3(e.object.position.x, e.object.position.y, e.object.position.z);
        useStore.setState({ targetVector: selectedObjectVector });
    }

    return(
        <div className="App">
            <Canvas id="scene-container" camera={{position: [0,0,0], name:"larry"}}>
                <ambientLight />
                <pointLight position={ [0, 3, -2.39] }/>

                <ScreenBox onClick={onScreenClickHandler} rotation={[0, .3, 0]} position={ [0, 0, -1] } />
                <ScreenBox onClick={onScreenClickHandler} position={ [2, 2, -4] } />
                <ScreenBox onClick={onScreenClickHandler} position={ [0, 4, -2] } />
                <ScreenBox onClick={onScreenClickHandler} position={ [-2, -4, -6] } />
                <ScreenBox onClick={onScreenClickHandler} rotation={[0, -.3, 0]} position={ [-6, -4, -12] } />

                <Suspense>
                    <PositionCamera />
                </Suspense>
            </Canvas>
            <Menu />
        </div>
    );
}

export default Experiment01;
