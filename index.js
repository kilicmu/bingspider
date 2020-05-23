const https = require('https')
const Log = require('./log.js')
const fs = require('fs')
const path = require('path')
const { URL } = require('url')
const { checkDirExist, getExt } = require('./utils.js')

const l = new Log()
const pictureList = path.resolve(__dirname, './picturelist.json')
const baseURL = 'https://cn.bing.com/'

/**
 * 从bing获取图片保存到目标目录
 * @param {*} downloadPath 图片下载位置, 必须使用绝对路径, 默认位置为images文件夹
 * @param {*} currentNo 图片获取编号[0,1,2....]
 */
const savePicture = (downloadPath = './images', currentNo = 0) => {
  const timeStemp = Date.now()
  const JSONResourceURI = `/HPImageArchive.aspx?format=js&idx=${currentNo}&n=1&nc=${timeStemp}&pid=hp`
  const firstReqURL = new URL(JSONResourceURI, baseURL).href

  checkDirExist(downloadPath)

  https.get(firstReqURL, (res) => {
    const _firstJSONChunks = []

    res.on('data', (data) => {
      _firstJSONChunks.push(data)
    })

    res.on('error', (error) => {
      l.log(error.toString())
    })

    res.on('end', () => {
      const resJSON = JSON.parse(Buffer.concat(_firstJSONChunks))
      const resourceURI = resJSON.images[0].url
      const secondReqURL = new URL(resourceURI, baseURL).href
      const ext = getExt(secondReqURL)
      const resourceName = (resJSON.images[0].copyright + ext).replace(
        /\s|\/*/g,
        ''
      )
      const resourcePath = path.resolve(downloadPath, resourceName)

      https.get(secondReqURL, (res) => {
        const _secondDataChunks = []
        res.on('data', async (data) => {
          _secondDataChunks.push(data)
        })

        res.on('end', async () => {
          const imgBuffer = Buffer.concat(_secondDataChunks)
          const absDir = path.resolve(downloadPath, resourceName)
          const fd = await fs.openSync(resourcePath, 'w')
          fs.writeSync(fd, imgBuffer)
          fs.closeSync(fd)
          let list
          try {
            list = require(pictureList)
          } catch (_) {
            l.log(`error: no file, created ${pictureList}`)
            fs.writeFileSync(pictureList, JSON.stringify([]))
            list = require(pictureList)
          }
          list.push(absDir)
          list = Array.from(new Set(list))
          l.log(`writed ${resourceName} to ${absDir}`)
          fs.writeFileSync(pictureList, JSON.stringify(list))
        })

        res.on('error', () => {
          l.log(error.toString())
        })
      })
    })
  })
}

/*
 * 获取目前已经保存的图片列表
 * @return {array}
 */
const getExistPictureList = () => {
  let res = []
  try {
    res = require(path.resolve(__dirname, pictureList))
  } catch (_) {
    l.log(`error: no file, created ${pictureList}`)
    fs.writeFileSync(pictureList, JSON.stringify([]))
  }
  return res
}

module.exports = { savePicture, getExistPictureList }
