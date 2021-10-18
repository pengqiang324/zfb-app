import { fmoney } from '/utils/index'
Page({
  data: {
    dataDetail: {},
    compressedSrc: '',
    detailImageList: [],
    loading: true
  },
  onLoad() {
    this.init()
  },
  init() {
    let res = my.getStorageSync({ key: 'list' });
    if (!res.error) {
      const newData = JSON.parse(JSON.stringify(res.data))
      newData['newSaleQty'] = this.splitPrice(newData.saleQty)
      this.setData({
        dataDetail: newData
      })
      my.getImageInfo({
        src:`https://t-images.5296live.com${this.data.dataDetail.image}`,
        success:(res)=>{
          my.compressImage({
            apFilePaths: [res.path],
            compressLevel: 0,
            success: data => {
              this.setData({
                compressedSrc: data.apFilePaths[0],
              })
            }
          })
        }
      })
      // 获取用户信息并存储数据
      var timestamp = Date.parse(new Date())
      var data = {
        "tagId": 0,
        "page": 1,
        "pageSize": 100,
        "isBrushzanli": "true",
        "apiCode": 131,
        "appVer": "1.4.1",
        "channel": "zanli",
        "deviceId": "af72dc99efdf584b",
        "clientType": "ANDROID",
        "idcode": "guest_c3524b8d02f749329498197887127f22",
        "appType": "android",
        "packageName": "com.ninesixshop.say",
        "token": "guest_6642acf47ef746baab10f049be49c5d2",
        "timestamp": timestamp,
        "spuId": newData.id
      };
      // my.showLoading({
      //   content: '加载中...',
      //   delay: 0,
      // });
      my.request({
        url: `https://t-api.5296live.com/mall/shop/spuDetail`,
        method: 'POST',
        headers: {
          "content-type":  'application/x-www-form-urlencoded'
        },
        data,
        success: (result) => {
          const { data } = result.data
          // new add
          if (result.data.code === 0) {
            this.setData({
              loading: false
            })
            my.alert({content: result.data.msg})
            return
          }
          const length = data.detailsImageList.length
          let i = 0
          data.detailsImageList.forEach((item,index) => {
            my.getImageInfo({
              src:`https://t-images.5296live.com${item}`,
              success:(res)=>{
                my.compressImage({
                  apFilePaths: [res.path],
                  compressLevel: 0,
                  success: data => {
                    i ++
                    const key = `detailImageList[${index}]`
                    this.setData({
                      [key]: data.apFilePaths[0]
                    })
                    if (i === length) {
                      // image compress loaded
                      // my.hideLoading();
                      this.setData({
                        loading: false
                      })
                    }
                  }
                })
              }
            })
          })
          this.setData({
            'dataDetail.detailsImageList': data.detailsImageList,
            'dataDetail.totalPrice': fmoney(data.price)
          })
        },
        fail: () => {
          
        }
      });
    }
  },
  splitPrice(num) {
    if(num >= 10000) {
        num = Math.round(num/1000)/10 + 'W';
    } else if (num >= 1000) {
        num = Math.round(num/100)/10 + 'K';
    }
 
    return num;
  },
  handleBuy() {
    my.navigateTo({ url: '/pages/orderBuy/orderBuy' })
  }
});
