import * as THREE from 'three'
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader"

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
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

        const setSize = () => {
            this.renderer.setSize(this.dom.container.offsetWidth, this.dom.container.offsetHeight)
            this.camera.aspect = this.dom.container.offsetWidth / this.dom.container.offsetHeight
            this.camera.updateProjectionMatrix()
            this.update()
        }
        new ResizeObserver(setSize).observe(this.dom.container)

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xffffff)
        const fogStart = 5
        const fogDist = 25
        this.scene.fog = new THREE.Fog(0xffffff, fogStart, fogStart + fogDist);

        this.camera = new THREE.PerspectiveCamera(45, this.dom.container.offsetWidth / this.dom.container.offsetHeight, 0.1, 200)
        this.camera.position.set(0, 4, 5)

        this.grid = new THREE.GridHelper(100, 60, 0xffffff, 0xffffff)

        this.light = new THREE.DirectionalLight(0xffffff, 1)
        this.light.position.set(0, 1, 1)
        this.light.lookAt(0, 0, 0)
        this.light.castShadow = true
        this.light.shadow.mapSize.width = 2048
        this.light.shadow.mapSize.height = 2048
        this.light.shadow.camera.near = 0.5
        this.light.shadow.camera.far = 500

        const shadowCameraSize = 20
        this.light.shadow.camera.top = shadowCameraSize
        this.light.shadow.camera.bottom = -shadowCameraSize
        this.light.shadow.camera.left = -shadowCameraSize
        this.light.shadow.camera.right = shadowCameraSize

        this.plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshStandardMaterial({color: 0xffffff}))
        this.plane.rotateX(THREE.MathUtils.degToRad(-90))
        this.plane.position.set(0, -0.5, -15)
        this.plane.receiveShadow = true

        this.scene.add(this.camera, this.grid, this.light, this.plane)

        this.dom.container.appendChild(this.renderer.domElement)
        this.update()
        setSize()
    }

    async loadModels() {
        const fbxLoader = new FBXLoader()

        const onProgress = (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        }
        const women = async (animationFilePath) => {
            console.group()
            console.time('women')
            const model = await fbxLoader.loadAsync('./models/woman/woman.fbx', onProgress)
            model.castShadow = true
            model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = new THREE.MeshNormalMaterial()
                    child.castShadow = true
                }
            })
            const mixer = new THREE.AnimationMixer(model)
            const animationModel = await fbxLoader.loadAsync(animationFilePath)
            const action = mixer.clipAction(animationModel.animations[0])
            action.play()

            this.scene.add(model)
            model.scale.setScalar(6)

            mixer.update(0.1)
            console.timeEnd('women')
            console.groupEnd()
            return model
        }

        const womenRight = await women('./models/woman/woman@legup.fbx')
        womenRight.position.set(6.3,0 , -10)
        womenRight.scale.setScalar(5.5)
        // womenRight.scale.setX(-6)
        womenRight.rotateY(15.1)
        this.update()

        const womenLeft = await women('./models/woman/woman@laying.fbx')
        womenLeft.position.set(-5, 0 , -8.5)
        womenLeft.scale.setZ(-6)
        womenLeft.rotateY(-160)
    }

    update() {
        this.renderer.render(this.scene, this.camera)
    }
}
