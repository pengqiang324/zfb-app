import { fmoney } from '/utils/index'
const app = getApp();
Page({
  data: {
    dataInfo: {},
    authCode: '',
    isAmount: false,
    loading: false
  },
  onLoad() {
    this.init()
  },
  init() {
    let res = my.getStorageSync({ key: 'list' });
    let amountData = my.getStorageSync({ key: 'amount' });
    let authCode = my.getStorageSync({key: 'authCode'});
    if (res.data) {
      // 正常页面交互
      this.setData({
        dataInfo: res.data,
        'dataInfo.totalPrice': fmoney(res.data.price),
        authCode: authCode.data,
        isAmount: false
      })
    } else if (amountData.data) {
      // app 进入小程序页面
      this.setData({
        'dataInfo.totalPrice': fmoney(amountData.data),
        authCode: authCode.data,
        isAmount: true
      })
    }
  },
  hasLoading(loading=true) {
    this.setData({
      loading
    })
  },
  handleComfirm() {
    const payMenting = my.getStorageSync({ key: 'paymenting' })
    if (this.data.loading || payMenting.data) return false
    this.hasLoading(true)
    if (this.data.isAmount) {
      // app 进入小程序页面
      const tradeNO = my.getStorageSync({key: 'tradeNO'});
      if (!tradeNO.data) {
        this.getTradNo()
        return
      } else {
        my.tradePay({
          // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
          tradeNO: tradeNO.data,
          success: (res) => {
            console.log(res.data)
          },
          fail: (res) => {
          },
          complete: () => {
            this.hasLoading(false)
          }
        });
      }
    } else {
      // 正常页面交互
      var timestamp = Date.parse(new Date())
      var data = {
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
      my.request({
        url: `https://t-api.5296live.com/mall/xcxpay/create?amount=${this.data.dataInfo.price}&code=${this.data.authCode}`,
        method: 'POST',
        headers: {
          "content-type":  'application/x-www-form-urlencoded'
        },
        data,
        success: (result) => {
          const tradeNO = result.data.data
          if (result.data.code == 0 || !tradeNO) {
            my.alert({content: result.data.msg})
            this.hasLoading(false)
            return
          }
          my.tradePay({
            // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
            tradeNO,
            success: (res) => {
              console.log(res.data)
            },
            fail: (res) => {
              
            },
            complete: () => {
              this.hasLoading(false)
            }
          });
        },
        fail: () => {
          this.hasLoading(false)
        }
      });
    }
  },

  getTradNo() {
      my.showLoading({
        content: '处理中...'
      })
      let authCode = my.getStorageSync({ key: 'authCode'})
      const query = my.getStorageSync({ key: 'query' })
      if (!query.data || !authCode.data) {
        my.alert({content: '网络繁忙，请稍再试！'})
        this.hasLoading(false)
        return
      }
      var timestamp = Date.parse(new Date())
      var queryData = {
        "tagId": 0,
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
        ...queryData,
        ...query.data,
        authCode: authCode.success && authCode.data
      }
      if (!query.data.profile) {
        my.alert({content: '参数有误！'})
        this.hasLoading(false)
        return
      }
      my.request({
        url: `${query.data.profile}/api/app/shops/order/pay/alxcxPay/idcode/guest_c3524b8d02f749329498197887127f22?appSrc=1`,
        method: 'POST',
        headers: {
          "content-type":  'application/x-www-form-urlencoded'
        },
        data,
        success: (result) => {
          const tradeNO = result.data.data
          if(!result.data.code || !tradeNO) {
            my.alert({content: `${result.data.msg}`})
            this.hasLoading(false)
            return
          }
          my.setStorageSync({ key: 'tradeNO', data: tradeNO })
          my.tradePay({
            // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
            tradeNO,
            success: (res) => {
              console.log(res.data)
            },
            fail: (res) => {
              my.alert({content: JSON.stringify(res)})
            },
            complete: () => {
              this.hasLoading(false)
            }
          });
        },
        fail: () => {
          my.alert({content: '请求出错啦！'})
          this.hasLoading(false)
        },
        complete: () => {
          my.hideLoading();
        }
      });
    }
});
