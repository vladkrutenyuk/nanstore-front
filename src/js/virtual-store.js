import * as THREE from 'three'
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export default class VirtualStore {
    constructor(container) {
        this.dom = { container }
        this.setupThree()
        this.loadModels()
            .then(() => console.log('READY'))
            .catch(e => console.error(e))
            .finally(() => this.update())
    }

    setupThree() {
        this.renderer = new THREE.WebGLRenderer({antialias: true})
        const setSize = () => {
            this.renderer.setSize(this.dom.container.offsetWidth, this.dom.container.offsetHeight)
            this.camera.aspect = this.dom.container.offsetWidth / this.dom.container.offsetHeight
            this.camera.updateProjectionMatrix()
            this.update()
        }
        new ResizeObserver(setSize).observe(this.dom.container)

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xffffff)

        this.camera = new THREE.PerspectiveCamera(45, this.dom.container.offsetWidth / this.dom.container.offsetHeight, 0.1, 200)
        this.scene.add(this.camera)

        this.grid = new THREE.GridHelper(100, 20, 0xaaaaaa, 0xaaaaaa)
        this.scene.add(this.grid)

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        // this.controls.addEventListener('change', () => this.update())
        this.camera.position.set(0, 4, 5)

        this.dom.container.appendChild(this.renderer.domElement)
        this.update()
        setSize()
    }

    async loadModels() {
        const fbxLoader = new FBXLoader()

        const onProgress = (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        }

        const textureLoader = new THREE.TextureLoader()
        const womenSkinTex = await textureLoader.loadAsync('models/woman/textures/woman_skin.jpg')
        const womenEyeTex = await textureLoader.loadAsync('models/woman/textures/woman_eye.jpg')

        const women = async (animationFilePath) => {
            const model = await fbxLoader.loadAsync('models/woman/woman.fbx')
            model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshMatcapMaterial({})
                }
            })
            const mixer = new THREE.AnimationMixer(model)
            const animationModel = await fbxLoader.loadAsync(animationFilePath)
            const action = mixer.clipAction(animationModel.animations[0])
            action.play()

            this.scene.add(model)
            model.scale.setScalar(6)

            mixer.update(0.1)
            return model
        }

        const womenRight = await women('models/woman/woman@legup.fbx')
        womenRight.position.set(6.5,0 , -11)
        // womenRight.scale.setX(-6)
        womenRight.rotateY(15.1)
        this.update()

        const womenLeft = await women('models/woman/woman@laying.fbx')
        womenLeft.position.set(-5, 0 , -5.5)
        womenLeft.scale.setZ(-6)
        womenLeft.rotateY(-160)
    }

    update() {
        this.renderer.render(this.scene, this.camera)
    }
}
