import VirtualStore from "./virtual-store"
import * as THREE from 'three'

const DOM = {
    virtualStoreWebGlSection: document.querySelector('section.virtual-store-webgl')
}
const virtualStore = new VirtualStore(DOM.virtualStoreWebGlSection)

const onScroll = () => {
    let t = THREE.MathUtils.clamp(window.scrollY / 899, 0, 1.3)
    const y = THREE.MathUtils.lerp(7, 2, t)
    virtualStore.camera.position.setY(y)
    const angle = THREE.MathUtils.lerp(-0.2, 0, t)
    virtualStore.camera.rotation.set(angle, 0, 0)
    virtualStore.update()
}
window.addEventListener('scroll', onScroll)
onScroll()