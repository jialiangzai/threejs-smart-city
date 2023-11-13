// 游船类
import * as THREE from 'three'
import { BaseModel } from './BaseModel'
export class Ship extends BaseModel {
  init () {
    this.scene.add(this.model)
  }
}