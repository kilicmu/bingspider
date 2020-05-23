# 获取Bing的每日壁纸
提供了两个函数：
- savePicture
  * 从bing获取图片保存到目标目录
  * @param {*} downloadPath 图片下载位置, 必须使用绝对路径, 默认位置为images文件夹
  * @param {*} currentNo 图片获取编号[0,1,2....]
- getExistPictureList
  * 获取目前已经保存的图片列表
  * @return {array}
你可以使用getExistPictureList获取图片已经下载的图片列表，其他关于部署问题，可以参考我的blog：[Bing每日壁纸获取](http://blog.kilic.site/2020/05/23/BING%E6%AF%8F%E6%97%A5%E5%A3%81%E7%BA%B8%E8%8E%B7%E5%8F%96/)