import React, { useRef } from 'react';
import { Canvas, useThree } from 'react-three-fiber';
import { useSpring } from 'react-spring';

import create from 'zustand';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import myImage from '../resources/images/up.png';
import sphereTexture from '../resources/images/01_10Pattern06.jpg';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

let myTexture = null;

const ABOVE = 'a';
const UNDERNEATH = 'u';
const LEFT = 'l';
const RIGHT = 'r';
const BEHIND = 'b';
const FORWARD = 'f';

const useStore = create((set, get) => ({
    componentJustMounted: true,
    currentDollyPosition: 0,
    currentTilt: 0,
    currentSwivel: 0,
    currentPositionAxis: 'z',
    currentTiltAxis: 'x',
    currentSwivelAxis: 'y',
    currentCamera: null,
    currentDirection: FORWARD,
    directionsConfig: [
        {
            key: 1,
            label: 'Left',
            direction: LEFT
        }, {
            key: 2,
            label: 'Up',
            direction: ABOVE
        }, {
            key: 3,
            label: 'Main',
            direction: FORWARD
        }, {
            key: 4,
            label: 'Behind',
            direction: BEHIND
        }, {
            key: 5,
            label: 'Down',
            direction: UNDERNEATH
        }, {
            key: 6,
            label: 'Right',
            direction: RIGHT
        }
    ],
    positionsConfig: [
        {
            key: 7,
            label: 'Position 1',
            position: 0
        }, {
            key: 8,
            label: 'Position 2',
            position: 5
        }, {
            key: 9,
            label: 'Position 3',
            position: 10
        }, {
            key: 10,
            label: 'Position 4',
            position: 15
        }, {
            key: 11,
            label: 'Position 5',
            position: 20
        }
    ],
    getCurrentAxis: ({ x, y, z }) => {
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
    getHomePosition: () => {
        let homePos = 0;
        get().positionsConfig.forEach((itm) => {
            if (itm && itm.position === 0) {
                homePos = itm;
            }
        })
        return homePos;
    }
}));

function CameraDolly() {
    const { camera } = useThree();
    const cv = useStore(state => state.currentPositionAxis);

    let fromObj = {}, toObj = {};
    fromObj[ cv ] = 0;
    toObj[ cv ] = useStore(state => state.currentDollyPosition);

    useSpring({
        from: fromObj, to: toObj,
        onFrame: ({x, y, z}) => {
            // camera.position[ useStore.getState().currentPositionAxis ] = useStore.getState().getCurrentAxis({ x, y, z });
        }
    });

    return null;
}

function CameraTilt() {
    const { camera } = useThree();
    const cv = useStore(state => state.currentTiltAxis);
    const cda = useStore(state => state.currentTilt);

    let fromObj = {}, toObj = {};
    fromObj[ cv ] = 0;
    toObj[ cv ] = cda;

    useSpring({
        from: fromObj,
        to: toObj,
        onFrame: ({ x, y, z }) => {
            // camera.rotation[ useStore.getState().currentTiltAxis ] = useStore.getState().getCurrentAxis({ x, y, z });
        }
    })

    return null;
}

function CameraSwivel() {
    const { camera } = useThree();
    const cv = useStore(state => state.currentSwivelAxis);

    let fromObj = {}, toObj = {};
    fromObj[ cv ] = 0;
    toObj[ cv ] = useStore(state => state.currentSwivel);

    // TODO: Try useFrame here and consolidate this duplication.

    useSpring({
        from: useStore(state => state.currentDollyPosition),
        to: 0,
        onFrame: ({x,y,z}) => {
            // camera.position[ useStore.getState().currentPositionAxis ] = useStore.getState().getCurrentAxis({ x, y, z });
        }
    });

    useSpring({
        from: fromObj,
        to: toObj,
        onFrame: ({ x, y, z }) => {
            // camera.rotation[ useStore.getState().currentSwivelAxis ] = useStore.getState().getCurrentAxis({ x, y, z });
        }
    });

    return null;
}

function BackgroundDome() {
    const { mesh } = useRef();
    const loader = new TextureLoader();

    let tLoad = loader.load(sphereTexture, (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set( 0, 0 );
        texture.repeat.set( 6, 6 );
    });

    return (
        <mesh visible position={ [0, 0, - 2] } rotation={ [0, 0, 0] }>
            <sphereBufferGeometry args={ [24, 24, 24] }/>
            <meshStandardMaterial map={tLoad} name="material" color="grey" side={ THREE.BackSide }/>
        </mesh>
    );
}

function ScreenBox(props) {
    // const mesh = useRef();
    // const loader = new TextureLoader();

    // myTexture = loader.load(myImage);


    const div = document.createElement( 'div' );
				div.style.width = '480px';
				div.style.height = '360px';
				div.style.backgroundColor = '#000';

				const iframe = document.createElement( 'iframe' );
				iframe.style.width = '480px';
				iframe.style.height = '360px';
				iframe.style.border = '0px';
				iframe.src = [ 'https://www.youtube.com/embed/', 'vpl', '?rel=0' ].join( '' );
				div.appendChild( iframe );

				const object = new CSS3DObject( div );




    let renderer = new CSS3DRenderer();
    renderer.setSize(480,360);
    let container = document.createElement('div');
    container.attributes.id = 'container';
    container.appendChild(renderer.domElement);
    // return renderer.domElement?

    // const group = new THREE.Group();
    // group.add(div);




    // const canvas = document.createElement('canvas');
    // canvas.width = 512;
    // canvas.height = 512;

    // const ctx = canvas.getContext('2d');
    // ctx.font = '48px sans-serif';
    // ctx.width = 512;
    // ctx.height = 512;
    // ctx.fillText('Labore sint cillum cupidatat irure deserunt aliqua nisi reprehenderit.', 10, 100);

    // const texture = new THREE.CanvasTexture(canvas);

    // return (
    //     <mesh
    //         { ...props }
    //         ref={ mesh }>
    //         <boxBufferGeometry attach="geometry" args={ [1, 1, 1] }/>
    //         <meshBasicMaterial map={ texture } attach="material" />
    //     </mesh>
    // );

    return (
        <div>{object}</div>
    );
}

const setHighlight = (interaction) => {
    let hasPosition = (interaction.position !== undefined) ? true : false;
    let hasDirection = (interaction.direction !== undefined) ? true : false;
    let homePosition = useStore.getState().getHomePosition();

    if (hasDirection === true) {
        document.querySelectorAll('.menu.positions-menu a').forEach((itm) => {
            itm.classList.remove('selected');
            if (itm.id === homePosition.key) {
                itm.classList.add('selected');
            }
        });
        document.querySelectorAll('.menu.directions-menu a').forEach((itm) => {
            itm.classList.remove('selected');
            if (itm.id === interaction.key) {
                itm.classList.add('selected');
            }
        });
    }

    if (hasPosition === true) {
        document.querySelectorAll('.menu.positions-menu a').forEach((itm) => {
            itm.classList.remove('selected');
            if (itm.id === interaction.key) {
                itm.classList.add('selected');
            }
        });
    }
}

function BlogPOC() {
    if (useStore.getState().componentJustMounted === false) {
        setTimeout(()  => {
            // setHighlight({key: 3, label: "Main", direction: "f"});
        }, 1000);
    }
    return (
        <div className="App">
            <Canvas>
                <ambientLight/>
                <pointLight position={ [3.546, 7.387, 5.455] }/>
                <pointLight position={ [- 4.012, - 10.924, - 4.518] }/>
                {/* Objects spaced in increments of 5 units. */ }
                <ScreenBox position={ [0, 0, - 2] }/>
                <ScreenBox position={ [0, 0, - 7] }/>
                <ScreenBox position={ [0, 0, - 12] }/>
                <ScreenBox position={ [0, 0, - 17] }/>
                <ScreenBox position={ [0, 0, - 22] }/>
                {/* Top */ }
                <ScreenBox position={ [0, 2, 0] }/>
                <ScreenBox position={ [0, 7, 0] }/>
                <ScreenBox position={ [0, 12, 0] }/>
                <ScreenBox position={ [0, 17, 0] }/>
                <ScreenBox position={ [0, 22, 0] }/>
                {/* Bottom */ }
                <ScreenBox position={ [0, - 2, 0] }/>
                <ScreenBox position={ [0, - 7, 0] }/>
                <ScreenBox position={ [0, - 12, 0] }/>
                <ScreenBox position={ [0, - 17, 0] }/>
                <ScreenBox position={ [0, - 22, 0] }/>
                {/* Left */ }
                <ScreenBox position={ [- 2, 0, 0] }/>
                <ScreenBox position={ [- 7, 0, 0] }/>
                <ScreenBox position={ [- 12, 0, 0] }/>
                <ScreenBox position={ [- 17, 0, 0] }/>
                <ScreenBox position={ [- 22, 0, 0] }/>
                {/* Right */ }
                <ScreenBox position={ [2, 0, 0] }/>
                <ScreenBox position={ [7, 0, 0] }/>
                <ScreenBox position={ [12, 0, 0] }/>
                <ScreenBox position={ [17, 0, 0] }/>
                <ScreenBox position={ [22, 0, 0] }/>
                {/* Behind */ }
                <ScreenBox position={ [0, 0, 2] }/>
                <ScreenBox position={ [0, 0, 7] }/>
                <ScreenBox position={ [0, 0, 12] }/>
                <ScreenBox position={ [0, 0, 17] }/>
                <ScreenBox position={ [0, 0, 22] }/>

                {/* Camera hooks */ }
                <CameraDolly/>
                <CameraTilt/>
                <CameraSwivel/>

                {/*Background / environment*/ }
                <BackgroundDome/>
            </Canvas>
        </div>
    );
}

export default BlogPOC;
