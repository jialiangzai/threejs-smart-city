// 游船类
import * as THREE from 'three'
import { BaseModel } from './BaseModel'

export class Ship extends BaseModel {
  init () {
    this.pointIndex = 0 // 保存当前游船所在位置坐标的索引

    this.generatorMovePath() // 生成游船移动的路径

    // this.isMoveCamera = false // 开关属性（控制摄像机是否跟随游船移动）

    // this.onModelAttach() // 鼠标事件
    this.scene.add(this.model)
  }
  // 游船行进方法-切换坐标点位置
  onTick () {
    if (this.pointIndex < this.pointArr.length - 1) {
      const { x, y, z } = this.pointArr[this.pointIndex + 1]
      // 游船移动：
      // 取出坐标设置给模型对象
      this.model.position.copy(this.pointArr[this.pointIndex])
      // 确保船头朝向下一个坐标点位置（前进船头效果）
      // 让物体朝着自己 z 轴正方向作为前面
      this.model.lookAt(this.pointArr[this.pointIndex + 1])
      this.pointIndex += 1
    } else {
      // 索引回到 0，重新继续做坐标的取值然后做动画效果
      this.pointIndex = 0
    }
  }
  generatorMovePath () {
    const shipPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(134.356097129589, 2.0112688541412354, -78.91746888546072),
      new THREE.Vector3(13.132075955743915, 2.0112688541412425, -69.85260460470285),
      new THREE.Vector3(13.132075955743915, 2.0112688541412425, -69.85260460470285),
      new THREE.Vector3(-80.28995611104816, 2.0112688541412282, -12.640254617216172),
      new THREE.Vector3(-71.5470123066941, 2.0112688541412354, 25.641138454485144),
      new THREE.Vector3(-71.5470123066941, 2.0112688541412354, 25.641138454485144),
      new THREE.Vector3(-17.5179164111899, 2.0112688541412354, 139.95062075065943),
      new THREE.Vector3(-67.10547001341894, 2.0112688541412354, 64.30494908329582),
      new THREE.Vector3(-87.03568940230136, 2.0112688541412354, 20.40776369519459),
      new THREE.Vector3(-88.0509634357777, 2.0112688541412425, -32.429601593890354),
      new THREE.Vector3(-70.27457116256328, 2.0112688541412425, -50.370253013515836),
      new THREE.Vector3(-39.206573479212764, 2.0112688541412425, -64.28841112963838),
      new THREE.Vector3(47.33347662423566, 2.0112688541412354, -73.13885409538068),
      new THREE.Vector3(134.356097129589, 2.0112688541412354, -78.91746888546072),
    ])
    // getSpacedPoints 等间距的坐标点
    this.pointArr = shipPath.getSpacedPoints(3500)
    // 把坐标点 => 几何图形 => 线段物体显示一下（辅助我们理解）
    const geometry = new THREE.BufferGeometry().setFromPoints(this.pointArr)
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide })
    const line = new THREE.Line(geometry, material)
    // this.scene.add(line)
  }
  onModelAttach () { }
}