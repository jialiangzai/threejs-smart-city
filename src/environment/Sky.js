// 天空背景类
import * as THREE from 'three'
export class Sky {
  constructor(scene) {
    this.scene = scene
  }
  setBack (publicPath, pathList) {
    new THREE.CubeTextureLoader().setPath(publicPath).load(pathList, (cube) => {
      this.scene.background = cube
    })
  }
}