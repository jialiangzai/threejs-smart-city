// 城市类
import { EdgesLine } from "@/effect/EdgesLine"
import { BaseModel } from "./BaseModel"
import * as THREE from 'three'
import { modifyCityDefaultMaterial } from "@/shader/modifyCityDefaultMaterial"
import { CityWater } from '@/effect/CityWater.js'
import { Fire } from '@/effect/Fire.js'
import { getBoxCenter } from '@/utils/getBoxCenter.js'
import { FireBall } from "@/effect/FireBall"
import { BuildInfo } from "@/dom/BuildInfo"
import { EffectManager } from '@/effect/EffectManager.js'
import { ClickHandler } from "@/utils/ClickHandler"
import { EventBus } from '@/utils/EventBus.js'
export class City extends BaseModel {

  // 子类无 constructor，默认走父类的，而且 this 为子类的实例对象
  init () {
    this.buildNameObj = { // 模型名字和建筑显示名字对应关系
      '01-shanghaizhongxindasha': '上海中心大厦',
      "02-huanqiujinrongzhongxin": "环球金融中心",
      "03-jinmaodasha": "金茂大厦",
      "04-dongfangmingzhu": "东方明珠",
    }
    this.scene.add(this.model)
    this.initEffect()
    this.initFire('01-shanghaizhongxindasha')
    this.bindClick()
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
        let theWater = new CityWater(model, this.scene)
        // 把水波纹物体传入到动效管理类当中
        EffectManager.getInstance().addObj(theWater)
      }
    })
  }
  // 创建火灾标记
  // buildName 就是建模师模型中的小物体名字
  initFire (buildName) {
    const build = this.model.getObjectByName(buildName)
    const { center, size } = getBoxCenter(build)

    const fire = new Fire(this.scene, center, size)
    const ball = new FireBall(this.scene, center)

    // 注册动效管理
    EffectManager.getInstance().addObj(ball)

    // 过了 15 秒以后清除标记
    setTimeout(() => {
      fire.clear()
      ball.clear()

      // 移除动效
      EffectManager.getInstance().removeObj(ball)
    }, 15000)
  }
  // 只有单独设置有名字的物体，才能被获取到并绑定事件
  initDesc (scene, center, byName) {
    new BuildInfo(scene, center, {
      "squareMeters": "200",
      "name": this.buildNameObj[byName],
      "officesRemain": "200",
      "accommodate": "500",
      "parkingRemain": "88",
      "cameraPosition": {
        "x": "-27.60404773326758",
        "y": "77.6723594934777",
        "z": "190.86129619259177"
      }
    })
  }
  // 中心 4 个建筑绑定点击事件
  bindClick () {
    Object.keys(this.buildNameObj).forEach(key => {
      const build = this.model.getObjectByName(key)
      ClickHandler.getInstance().addMesh(build, (object) => {
        // object: 3d 物体
        const { center } = getBoxCenter(object)
        new BuildInfo(this.scene, center, {
          name: `${this.buildNameObj[object.name]}`,
          squareMeters: '666',
          accommodate: '666',
          officesRemain: '666',
          parkingRemain: '666',
        })
      })
    })
  }
}