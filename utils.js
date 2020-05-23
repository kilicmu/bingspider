const path = require('path')
const fs = require('fs')

/**
 * 检查路径是否存在 如果不存在则创建路径
 * @param {string} folderpath 文件路径
 */
checkDirExist = (folderpath) => {
  const pathArr = folderpath.split('/')
  let _path = ''
  for (let i = 0; i < pathArr.length; i++) {
    if (pathArr[i]) {
      _path += `/${pathArr[i]}`
      if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path)
      }
    }
  }
}
/**
 *  从uri获取扩展名
 * @param {string} _path
 * @return {string} 扩展名
 */
const getExt = (_path) => {
  const reg = /\?id=.*(\..*)&/ //获取扩展名的正则
  _path.match(reg)
  return RegExp.$1
}
module.exports = { checkDirExist, getExt }
