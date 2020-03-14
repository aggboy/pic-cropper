//index.js
//获取应用实例
// const myCamera = wx.createCameraContext();
const app = getApp()
Page({
  data: {
    outImg: '../../image/aa.png',
    // ---相机------
    show_condition: false,
    isRound: true,
    imgW: 261, //例子的图片是522 宽 因为不能超出屏幕 缩小一倍
    imgH: 413 //例子的图片是826 高 因为不能超出屏幕 缩小一倍

  },
  onLoad() {
    this.initHeight(this.data.imgW, this.data.imgH)
    const myCamera = wx.createCameraContext();
    const cameraFirstCanvas = wx.createCanvasContext('firstCanvas', this)
    this.setData({
      myCamera,
      cameraFirstCanvas,
    })
  },

  initHeight(imgW = 200, imgH = 400) {
    // 默认传进来的图片 在 屏幕的中间
    // imgW 传进来的图片的宽
    // imgW 传进来的图片的高
    // 图片的尺寸必须在 手机屏幕尺寸的范围内
    let cwidth = wx.getSystemInfoSync().windowWidth
    let cheight = wx.getSystemInfoSync().windowHeight
    if (imgW > cwidth) {
      wx.showModal({
        content: '图片的宽必须小于手机屏幕的宽',
      })
      return
    }
    if (imgH > cheight) {
      wx.showModal({
        content: '图片的高必须小于手机屏幕的高',
      })
    }

    // cwidth 是整个屏幕的宽
    // cheight 是整个屏幕的高
    //  canvasx 截取图片 画布的x轴坐标
    //  canvasy 截取图片 画布的y轴坐标

    let canvasx = parseInt((cwidth - imgW) / 2)
    let canvasy = parseInt((cheight - imgH) / 2)
    this.setData({
      cwidth,
      cheight,
      canvasx,
      canvasy
    })
  },
  selectImg(e) {
    // 采用相机模式
    this.setData({
      show_condition: true,
    })
  },
  // 取消拍照
  back_index() {
    this.setData({
      show_condition: false
    })
  },
  take_photo() {
    let imgW = this.data.imgW
    let imgH = this.data.imgH
    const myCamera = this.data.myCamera
    const cameraFirstCanvas = this.data.cameraFirstCanvas
    var that = this;
    myCamera.takePhoto({
      quality: 'high',
      frameSize: 'large',
      success: function(res) {
        wx.showLoading({
          title: '图片生成中',
        })
        console.log(res.tempImagePath)
        that.setData({
          //返回的是单张
          tempFilePaths: res.tempImagePath,
        });
        // 返回拍好的路径
        // canvas画图
        // 拍照的时候 是手机屏幕多大 就可以拍到多少范围
        // 所以是 0，0 点
        // 到 手机屏幕的宽高
        cameraFirstCanvas.drawImage(res.tempImagePath, 0, 0, that.data.cwidth, that.data.cheight)
        // 
        // canvas 开始截取
        // x: 截取区域开始的x轴坐标
        // y:截取区域开始的y轴坐标 
        // width: 截取区域图片的宽
        // height: 截取区域图片的高
        cameraFirstCanvas.draw(false, function() {
          wx.canvasToTempFilePath({
            x: that.data.canvasx,
            y: that.data.canvasy,
            width: imgW,
            height: imgH,
            destWidth: imgW * 2,
            destHeight: imgH * 2,
            fileType: 'jpg',
            quality: 1,
            canvasId: 'firstCanvas',
            success(res) {
              console.log(res.tempFilePath)
              that.setData({
                firstCanvasMiddleImg: res.tempFilePath
              })
              wx.hideLoading()
              that.setData({
                show_condition: false
              })
            }
          })
        })

      },
      fail: () => {
        console.log('fail')
      }
    })
  },
 





})