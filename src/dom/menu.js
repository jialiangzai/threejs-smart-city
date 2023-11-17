import { EventBus } from '@/utils/EventBus'
// 右上角 2 个按钮
let modeArr = [
  {
    mode: 'mode-topView', // id 名字，也作为 EventBus 中自定义事件名字
    isOpen: false // 当前按钮状态-true开始，false关闭中
  },
  {
    mode: 'mode-roaming',
    isOpen: false
  },
]
for (let index = 0; index < modeArr.length; index++) {
  let item = modeArr[index]
  document.getElementById(item.mode).addEventListener('click', () => {
    item.isOpen = !item.isOpen // 控制打开状态等
    EventBus.getInstance().emit(item.mode, item.isOpen)
  })
}