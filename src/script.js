import './style.css'
import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { CubeCamera, MixOperation } from 'three'



// Canvas
const canvas = document.querySelector('canvas.webgl')

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
        scene.add(gltf.scene)
        console.log(gltf)

        mixer = new THREE.AnimationMixer(gltf.scene)
        const sedan = mixer.clipAction(gltf.animations[73])
        const smallBus = mixer.clipAction(gltf.animations[70])
        const bigBus = mixer.clipAction(gltf.animations[67])
        const cloudOne = mixer.clipAction(gltf.animations[60])
        const cloudTwo = mixer.clipAction(gltf.animations[61])
        const cloudThree = mixer.clipAction(gltf.animations[62])



        
       sedan.play()
       smallBus.play()
       bigBus.play()
       cloudOne.play()
       cloudTwo.play()
       cloudThree.play()
    }
)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3.47
camera.position.y = 1.72
camera.position.z = 2.69
scene.add(camera)

// Controls
controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})

scene.background = new THREE.Color(0xffffff)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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