import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { CubeCamera, MixOperation } from 'three'



// Canvas
const canvas = document.querySelector('canvas.webgl')

// const canvasWidth = document.getElementById('canvas2').clientWidth
// const canvasHeight = document.getElementById('canvas2').clientHeight

const canvasWidth = 600 
const canvasHeight = 600





const scene = new THREE.Scene()

let previousTime = 0

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
let controls = null

/**
 * Material
 */
 const bakedTexture = textureLoader.load('baked.jpg')
 bakedTexture.flipY = false

 const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })

/**
 * Model
 */
gltfLoader.load (
    'Transit3JS.glb',
    (gltf) => {
        gltf.scene.traverse((child) => {
            child.material = bakedMaterial
            })
        gltf.scene.position.setX(0)  // this is offsetting the imported scene from Blender to avoid moving keyframes
        gltf.scene.position.setY(-0.8)
        gltf.scene.position.setZ(0)

        scene.add(gltf.scene)
        // console.log(gltf)

        mixer = new THREE.AnimationMixer(gltf.scene)
        const sedan = mixer.clipAction(gltf.animations[73])
        const smallBus = mixer.clipAction(gltf.animations[70])
        const bigBus = mixer.clipAction(gltf.animations[67])
        const cloudOne = mixer.clipAction(gltf.animations[0])
        const cloudTwo = mixer.clipAction(gltf.animations[1])
        const cloudThree = mixer.clipAction(gltf.animations[2])
        const bird1 = mixer.clipAction(gltf.animations[3])
        const bird2 = mixer.clipAction(gltf.animations[4])
        const bird3 = mixer.clipAction(gltf.animations[5])
        const bird4 = mixer.clipAction(gltf.animations[6])
        const gpsRing = mixer.clipAction(gltf.animations[63])

       sedan.play()
       smallBus.play()
       bigBus.play()
       cloudOne.play()
       cloudTwo.play()
       cloudThree.play()
       bird1.play()
       bird2.play()
       bird3.play()
       bird4.play()
       gpsRing.play()

    }
)

/**
 * Sizes
 */


const sizes = {
    // width: window.innerWidth,
    // height: window.innerHeight
    width: canvasWidth ,
    height: canvasHeight
}
// window.addEventListener('resize', () =>
// {
//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update camera
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height)
// })


window.addEventListener('resize', () =>
{
    // // Update sizes
    // sizes.width = 600
    // sizes.height = 600
    // // Update camera
    // camera.aspect = sizes.width / sizes.height
    // camera.updateProjectionMatrix()

    // Update renderer
    // renderer.setSize(sizes.width, sizes.height)
    renderer.setSize(600, 600)

})



/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(100, 1, 0.1, 100)
camera.position.x = 2.67
camera.position.y = 0.22
camera.position.z = -0.54
camera.lookAt (new THREE.Vector3(200,100,1000));
scene.add(camera)

// Controls
controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

controls.screenSpacePanning = false
// controls.minAzimuthAngle = 1
controls.maxAzimuthAngle = Math.PI / 2
controls.maxPolarAngle = Math.PI / 2
controls.maxDistance = 4
controls.minDistance = 2
// var gridXZ = new THREE.GridHelper(10, 1);
//     scene.add(gridXZ);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})

scene.background = new THREE.Color(0xffffff)
renderer.setSize(sizes.width, sizes.height)

// if (sizes.width <= 800) {
//     renderer.setSize(sizes.width * 0.5, sizes.height*0.5)
// }
// else {renderer.setSize(sizes.width, sizes.height)}
// // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()
    // console.log (camera.position.x,
    //     camera.position.y,
    //     camera.position.z)

    if (mixer !== null){
        mixer.update(deltaTime)
    }
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()