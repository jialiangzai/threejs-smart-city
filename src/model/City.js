// 城市类
import { EdgesLine } from "@/effect/EdgesLine"
import { BaseModel } from "./BaseModel"
import * as THREE from 'three'
import { modifyCityDefaultMaterial } from "../shader/modifyCityDefaultMaterial"
import { CityWater } from '@/effect/CityWater.js'
export class City extends BaseModel {
  // 子类无 constructor，默认走父类的，而且 this 为子类的实例对象
  init () {
    this.scene.add(this.model)
    this.initEffect()
  }
  initEffect () {
    // 中心城市建筑材质
    const centerMaterial = new THREE.MeshBasicMaterial({
      color: 0xA8CDED,
      transparent: true
    })
    // 外围城市建筑材质
    const periphery = new THREE.MeshBasicMaterial({
      color: 0xA8CDED,
      transparent: true
    })
    this.model.traverse(model => {
      if (model.name === 'Text') {
        // 隐藏默认建筑名字
        model.visible = false
        return
      }
      if (model.name !== 'Shanghai-09-Floor' && model.name !== 'Shanghai-08-River') {
        // 修改城市建筑模型材质
        if (model.name == 'Shanghai-02' || model.name == 'Shanghai-03' || model.name == 'Shanghai-04' || model.name == 'Shanghai-05' || model.name == 'Shanghai-06' || model.name == 'Shanghai-07') {
          // 周围建筑
          model.material = periphery
          new EdgesLine(this.scene, model, new THREE.Color('#666666'))
          // 对物体追加混合的着色器代码（渐变色白膜效果）
          modifyCityDefaultMaterial(model, false)
        } else {
          // 中心建筑
          model.material = centerMaterial
          new EdgesLine(this.scene, model, new THREE.Color('#00ffff'))
          // 对物体追加混合的着色器代码（渐变色白膜效果）
          modifyCityDefaultMaterial(model, true)
        }
      }
      // 针对水物体单独处理
      if (model.name === 'Shanghai-08-River') {
        // 把原本水物体隐藏
        model.visible = false
        // 创建更加真实的水面效果物体
        new CityWater(model, this.scene)
        // 把水波纹物体传入到动效管理类当中
        // EffectManager.getInstance().addObj(theWater)
      }
    })
  }
}