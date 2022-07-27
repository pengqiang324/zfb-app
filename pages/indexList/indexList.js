import { fmoney } from '/utils/index'
Page({
  data: {
    isLoading: true,
    loading: true,
    value: '',
    tabs: [
      {
        title: '箱包鞋袜'
      },
      {
        title: '生活百货'
      },
      {
        title: '美妆服饰'
      },
      {
        title: '食品生鲜'
      }
    ],
    name: '',
    activeTab: 0,
    list: []
  },
  onLoad() {
    this.init()
    this.clearStorage()
  },
  onReady() {
    this.setData({
      isLoading: false
    })
  },
  init() {
    this.getData()
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
  getData() {
    const index = this.data.activeTab
    const { title: categoryName } = this.data.tabs[index]
    this.setData({
      loading: true
    })
    const timestamp = Date.parse(new Date())
    const headers = {
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
      "timestamp": timestamp
    };
    const data = {
      categoryName,
      name: this.data.name
    }
    // 获取用户信息并存储数据
    my.request({
      url: `https://t-app-gw.52zanyou.com/api/app/shops/smallProgramGoods/list/idcode/guest_c3524b8d02f749329498197887127f22?dt=${timestamp}&signCheck=x8988276LJ5M6f3036gG%3D%3D`,
      method: 'POST',
      headers,
      data,
      timeout: 10000,
      success: (result) => {
        const { data, code, msg } = result.data
        if (code === 1) {
          my.alert({
            title: msg
          });
        } else {
          if (data) {
            const isObject = Object.prototype.toString.call(data) === '[object Object]'
            console.log(isObject)
            const newData = isObject ? [] : data.slice()
            newData.forEach((item) => {
              item.money = fmoney(item.price)
              item.paymentNumber = this.splitPrice(item.payment)
            })
            this.setData({
              list: newData
            })
          }
        }
      },
      complete: () => {
        this.setData({
          loading: false
        })
      }
    });
  },
  splitPrice(num) {
    if(num >= 10000) {
        num = Math.round(num/1000)/10 + '万';
    } else if (num >= 1000) {
        num += '+';
    }
 
    return num;
  },
  handleInput(value) {
    this.setData({
      value,
    });
  },
  handleClear() {
    this.setData({
      value: '',
    });
  },
  handleCancel() {
    this.setData({
      value: '',
    });
  },
  handleSubmit(value) {
    this.setData({
      name: value
    })
    this.init()
  },
  handleTabClick({ index, tabsName }) {
    this.setData({
      [tabsName]: index,
      name: ''
    });
    this.init()
  },
  handleTap(ev) {
    const { dataset: { list } } = ev.currentTarget
    my.setStorageSync({ key: 'list', data: list })
    my.navigateTo({ url: '/pages/internal/internal' })
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: "商品列表",
      desc: '商品列表',
      path: 'pages/indexList/indexList',
    };
  },
});
