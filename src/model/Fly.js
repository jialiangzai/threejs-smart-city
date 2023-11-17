// 飞行器类
import { BaseModel } from './BaseModel'
import * as THREE from 'three'
export class Fly extends BaseModel {
  init () {
    this.scene.add(this.model)
    // 飞行器当前坐标下标
    this.pointIndex = 0
    this.pointsArr = []
    // 控制摄像机是否跟随切换位置的开关
    this.isCameraMove = false
    this.generateMovePath()
  }
  generateMovePath () {
    // aX – 椭圆的中心的X坐标，默认值为0。
    // aY – 椭圆的中心的Y坐标，默认值为0。
    // xRadius – X轴向上椭圆的半径，默认值为1。
    // yRadius – Y轴向上椭圆的半径，默认值为1。
    // aStartAngle – 以弧度来表示，从正X轴算起曲线开始的角度，默认值为0。
    // aEndAngle – 以弧度来表示，从正X轴算起曲线终止的角度，默认值为2 x Math.PI。
    // aClockwise – 椭圆是否按照顺时针方向来绘制，默认值为false。
    // aRotation – 以弧度表示，椭圆从X轴正方向逆时针的旋转角度（可选），默认值为0。
    const curve = new THREE.EllipseCurve(
      0, 0, // 椭圆中心坐标
      110, 110, // x和y轴向上椭圆的半径
      0, -2 * Math.PI, // 开始角度和扫描角度
      false, // 是否按照顺时针来绘制
      0 // 以弧度表示，椭圆从X轴正方向逆时针的旋转角度
    )

    const tempArr = curve.getPoints(3500)
    // 把坐标向 y 轴移动 120 单位（模仿在天空的效果）
    let result = []
    for (var i = 0; i < tempArr.length; i++) {
      // z 轴的坐标位置，是几何图形未旋转之前，垂直于世界坐标系 y 轴的坐标点
      let item = new THREE.Vector3(tempArr[i].x, 120, tempArr[i].y)
      result.push(item)
    }
    this.pointsArr = result
    // const geometry = new THREE.BufferGeometry().setFromPoints(points)

    // const material = new THREE.LineBasicMaterial({ color: 0xff0000 })

    // // Create the final object to add to the scene
    // const ellipse = new THREE.Line(geometry, material)
  }
  // 游船行进方法-切换坐标点位置
  onTick () {
    if (this.pointIndex < this.pointsArr.length - 1) {
      // 重要：如果其他东西也要跟着我的坐标来动
      if (this.isCameraMove) {
        // 更改摄像机位置
        this.camera.position.copy(this.pointsArr[this.pointIndex])
        // 让摄像机中心观察点往上偏移一点
        this.camera.lookAt(0, 10, 0)
      }
      // 游船移动：
      // 取出坐标设置给模型对象
      this.model.position.copy(this.pointsArr[this.pointIndex])
      // 确保船头朝向下一个坐标点位置（前进船头效果）
      this.pointIndex += 1
    } else {
      // 索引回到 0，重新继续做坐标的取值然后做动画效果
      this.pointIndex = 0
    }
  }
}