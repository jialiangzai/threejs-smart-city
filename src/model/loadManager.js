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
export function loadManager (pathList, successFn) {
  let model = []
  // Instantiate a loader
  const gltfLoader = new GLTFLoader()
  const fbxLoader = new FBXLoader()
  // Load a glTF resource
  const loadModel = (path) => {
    return new Promise((resolve) => {
      if (path.indexOf('fbx') > -1) {
        fbxLoader.load(path, (obj) => {
          resolve({
            model: obj,
            url: path
          });
        });
      } else if (path.indexOf('gltf') > -1) {
        gltfLoader.load(path, (gltf) => {
          resolve({
            model: gltf.scene,
            url: path
          });
        });
      }
    });
  };
  
  (async () => {
    const modelPromises = pathList.map((path) => loadModel(path));
    const model = await Promise.all(modelPromises);
    successFn(model);
  })();
  
}