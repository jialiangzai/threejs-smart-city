/**
 * 参数：模型文件路径，成功回调函数
 * 
 * 基于 three.js 加载器分别加载模型
 * 
 * 全部加载后通过回调函数传出打印
 */
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'
import gsap from 'gsap'
const manager = new THREE.LoadingManager()
export function loadManager (pathList, successFn) {
  let model = []
  let preValue = 0 // 上一次进度值
  // Instantiate a loader
  const gltfLoader = new GLTFLoader(manager)
  const fbxLoader = new FBXLoader(manager)
  manager.onProgress = function (url, loadedNum, totalNum) {
    // url: 当前被加载完成的模型路径
    // loadedNum: 当前加载完成的个数 
    // totalNum: 总共要加载的个数
    // * 100 目的：为了让 0.5 进度变成 50 后续添加 % 后缀
    // 当前已经加载的进度数字
    let progressRatio = Math.floor(loadedNum / totalNum * 100)
    gsap.fromTo('#processing-number', {
      innerText: preValue // 暂时先传入一个数字（后面再去加 % 字符串）
    }, {
      innerText: progressRatio, // 暂时先传入一个数字（后面再去加 % 字符串）
      onUpdate () {
        // 详细控制显示的内容
        // 取出当前正在做动画的目标对象的属性值（进度数字）
        const num = gsap.getProperty(this.targets()[0], 'innerText')
        this.targets()[0].innerText = num + '%'
        preValue = progressRatio // 把当前最新的加载进度值，赋予到外面变量上
        if (num === 100) {
          // loader 加载器工作完毕
          successFn(model)
          document.querySelector('.loading').style.display = 'none'
        }
      }
    }
    )
    // 对进度条再来做一个动画
    // scaleX 范围是 0 - 1 做横向的缩放
    gsap.fromTo('#loading-bar', {
      scaleX: preValue / 100
    }, {
      scaleX: progressRatio / 100
    })
  }
  // Load a glTF resource
  const loadModel = (path) => {
    return new Promise((resolve) => {
      if (path.indexOf('fbx') > -1) {
        fbxLoader.load(path, (obj) => {
          resolve({
            model: obj,
            url: path
          })
        })
      } else if (path.indexOf('gltf') > -1) {
        gltfLoader.load(path, (gltf) => {
          resolve({
            model: gltf.scene,
            url: path
          })
        })
      }
    })
  };

  (async () => {
    const modelPromises = pathList.map((path) => loadModel(path))
    const model = await Promise.all(modelPromises)
    successFn(model)
  })()

}