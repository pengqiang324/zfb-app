// 获取全局 app 实例
const app = getApp();
import { fmoney } from '/utils/index'
Page({
  data: {
    dataList: [
        {
            "code":"02",
            "coin":"0.0",
            "details":"",
            "expressDescription":"",
            "giveCoin":"0.0",
            "goodsType":1,
            "hightCoin":"0.0",
            "hightGiveCoin":"0.0",
            "hightPrice":"596.0",
            "hightShoppingValue":"596.0",
            "hightShoppingValueTitle":"最高",
            "id":22848,
            "image":"/upload/202106/4/2097105636554498863ac01cf7a750b4.png",
            "inventoryQty":5,
            "limitation":-1,
            "name":"酷拉锐跑鞋",
            "presaleCount":0,
            "presaleTotal":0,
            "price":"596.0",
            "priceTitle":"起",
            "saleQty":0,
            "sequence":0,
            "shopId":16104,
            "shoppingValue":"596.0",
            "topCategoryId":70,
            "twoCategoryId":75,
            "type":1,
            "upperShelf":1
        },
        {
            "code":"02",
            "coin":"0.0",
            "details":"",
            "expressDescription":"",
            "giveCoin":"0.0",
            "goodsType":1,
            "hightCoin":"0.0",
            "hightGiveCoin":"0.0",
            "hightPrice":"296.0",
            "hightShoppingValue":"296.0",
            "hightShoppingValueTitle":"最高",
            "id":22849,
            "image":"/upload/202106/4/89173ce41a544d29bc9450200bf6740c.png",
            "inventoryQty":10,
            "limitation":-1,
            "name":"酷拉锐旋风运动鞋",
            "presaleCount":0,
            "presaleTotal":0,
            "price":"296.0",
            "priceTitle":"起",
            "saleQty":0,
            "sequence":0,
            "shopId":16104,
            "shoppingValue":"296.0",
            "topCategoryId":70,
            "twoCategoryId":75,
            "type":1,
            "upperShelf":1
        }
    ],
    isLoading: true,
    imageList: []
  },
  onLoad(query) {
    // 页面加载
    this.getData()
    // this.init()
    this.clearStorage()
  },
  clearStorage() {
    // 清除 app数据缓存
    my.removeStorageSync({
      key: 'query',
    });
    my.removeStorageSync({
      key: 'amount',
    });
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: "商品列表",
      desc: '商品列表',
      path: 'pages/index/index',
    };
  },
  
  splitPrice(num) {
    if(num >= 10000) {
        num = Math.round(num/1000)/10 + 'W';
    } else if (num >= 1000) {
        num = Math.round(num/100)/10 + 'K';
 
    }
 
    return num;
  },
  init() {
    var timestamp = Date.parse(new Date())
    var data = {
      "tagId": 0,
      "page": 1,
      "pageSize": 100,
      "isBrushzanli": "true",
      "apiCode": 131,
      "appVer": "1.4.0",
      "channel": "zanli",
      "deviceId": "af72dc99efdf584b",
      "clientType": "ANDROID",
      "idcode": "guest_c3524b8d02f749329498197887127f22",
      "appType": "android",
      "packageName": "com.ninesixshop.say",
      "token": "guest_6642acf47ef746baab10f049be49c5d2",
      "timestamp": timestamp
    };
   
    // 获取用户信息并存储数据
    my.request({
      url: `https://t-api.5296live.com/mall/goods/search/tag?dt=${timestamp}&signCheck=x8988276LJ5M6f3036gG%3D%3D`,
      method: 'POST',
      headers: {
        "content-type":  'application/x-www-form-urlencoded'
      },
      data,
      timeout: 10000,
      success: (result) => {
        const { dataList } = result.data
        const newData = dataList.slice()
        newData.forEach((item) => {
          item['newSaleQty'] = this.splitPrice(item.saleQty)
          item['totalPrice'] = fmoney(item.price)
        })
        this.setData({
          dataList: newData,
          isLoading: false
        })
      },
      fail: () => {
        
      }
    });
  },
  getData() {
    const newData = this.data.dataList.slice()
    const a = {}
    newData.forEach((item,index) => {
      my.getImageInfo({
        src:`https://t-images.5296live.com${item.image}`,
        success:(res)=>{
          my.compressImage({
            apFilePaths: [res.path],
            compressLevel: 0,
            success: data => {
              const key = `imageList[${index}]`
              this.setData({
                [key]: data.apFilePaths[0]
              })
            }
          })
        }
      })
      item['newSaleQty'] = this.splitPrice(item.saleQty)
      item['totalPrice'] = fmoney(item.price)
    })
    this.setData({
      dataList: newData,
      isLoading: false
    })
  },
  handleTapDetail(ev) {
    my.setStorageSync({ key: 'list', data: ev.target.dataset.list })
    my.navigateTo({ url: '/pages/internal/internal' })
  },
  imageLoad() {
    console.log('加载了')
  }
});
