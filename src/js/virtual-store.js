import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class VirtualStore {
    constructor(container) {
        this.dom = { container }
        this.setupThree()
    }

    setupThree() {
        this.renderer = new THREE.WebGLRenderer({antialias: true})
        const setSize = () => {
            this.renderer.setSize(this.dom.container.offsetWidth, this.dom.container.offsetHeight)
            this.update()
        }
        new ResizeObserver(setSize).observe(document.body)

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(0xffffff)

        this.camera = new THREE.PerspectiveCamera(60, this.dom.container.offsetWidth / this.dom.container.offsetHeight, 0.1, 200)
        this.camera.position.set(0, 4, 5)
        this.scene.add(this.camera)

        this.grid = new THREE.GridHelper(100, 20, 0xaaaaaa, 0xaaaaaa)
        this.scene.add(this.grid)

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        // this.controls.addEventListener('change', () => this.update())

        this.dom.container.appendChild(this.renderer.domElement)
        this.update()
        setSize()
    }

    update() {
        this.renderer.render(this.scene, this.camera)
    }
}

new VirtualStore(document.querySelector('section.virtual-store-webgl'))
