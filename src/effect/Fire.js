// 火灾标记类
import * as THREE from 'three'
export class Fire {
  constructor(scene, center, size) {
    this.scene = scene
    // 中心点
    this.center = center
    // 大小
    this.size = size
    this.init()
  }
  init () {
    const texture = new THREE.TextureLoader().load('icon/fire.png')
    texture.colorSpace = THREE.SRGBColorSpace
    const material = new THREE.SpriteMaterial({ map: texture })
    const sprite = new THREE.Sprite(material)
    // +3 让精灵物体中心点不在建筑物顶点，再往上移动一些单位
    sprite.position.set(this.center.x, this.center.y + this.size.y / 2 + 3, this.center.z)
    sprite.scale.set(10, 10, 10)
    this.scene.add(sprite)
  }
  clear () { this.scene.remove(this.model) }
}