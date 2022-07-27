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
    console.log(res)
    if (!res.error) {
      const newData = JSON.parse(JSON.stringify(res.data))
      // newData['newSaleQty'] = this.splitPrice(newData.saleQty)
      this.setData({
        dataDetail: newData,
        'dataDetail.totalPrice': fmoney(newData.price)
      })
      my.getImageInfo({
        src:`https://t-images.52zanyou.com${this.data.dataDetail.image}`,
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
      var headers = {
        "tagId": 0,
        "page": 1,
        "pageSize": 100,
        "isBrushzanli": "true",
        "apiCode": 300,
        "appVer": "3.0.0",
        "channel": "zanyou",
        "deviceId": "af72dc99efdf584b",
        "clientType": "ANDROID",
        "idcode": "guest_c3524b8d02f749329498197887127f22",
        "appType": "android",
        "packageName": "zanyouninesix.say",
        "token": "guest_6642acf47ef746baab10f049be49c5d2",
        "timestamp": timestamp,
        "spuId": newData.spuId
      };
      my.request({
        url: `https://t-app-gw.52zanyou.com/api/app/shops/product/detail/spu/idcode/guest_c3524b8d02f749329498197887127f22/${newData.spuId}`,
        method: 'get',
        headers,
        success: (result) => {
          const { data: { detailsImageList }, code } = result.data
          // new add
          if (code !== '200') {
            this.setData({
              loading: false
            })
            my.alert({content: result.data.msg})
            return
          }
          if (detailsImageList) {
            const length = detailsImageList.length
            let i = 0
            detailsImageList.forEach((item,index) => {
              my.getImageInfo({
                src:`https://t-images.52zanyou.com${item}`,
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
              'dataDetail.detailsImageList': detailsImageList
            })
          } else {
            this.setData({
              loading: false
            })
          }
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
