
# React / Three.js Camera Movement Lab


3D navigation explored as structures accessed via programmatic first-person camera movements. 

These experiments use [Zustand](https://github.com/pmndrs/zustand) for state management, [react-spring](https://www.react-spring.io/) for animation, [react-three-fiber](https://github.com/pmndrs/react-three-fiber) for 3D (integrates [Three.js](https://threejs.org/))

Mike Britton 2020

#### Experiment 1 - Basic Structured Movement
![](experiment-00.png?raw=true)
Move from a central point through one of six routes. 

#### Experiment 2 - Zoom To a Clicked Screen
![](experiment-01.png?raw=true)
Explore an arrangement of screens.

#### Experiment 3 - Rotate Group
![](cameralab-gif-01.gif?raw=true)
Explore an arrangement of randomly positioned and rotated screens. Grouping and an orbit.

## General

Use [this Three.js editor](https://threejs.org/editor/) to load the scene JSON files in the resources/json folder of this repo.
https://threejs.org/editor/

## Stack

- [react-spring](https://www.react-spring.io/docs)
- [react-three-fiber](https://github.com/pmndrs/react-three-fiber) 
- [Three.js](https://threejs.org/)
- [zustand](https://github.com/pmndrs/zustand)
