import { fmoney } from '/utils/index'
const app = getApp();
Page({
  data: {
    dataInfo: {},
    authCode: '',
    isAmount: false
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
  handleComfirm() {
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
          }
        });
      }
    } else {
      // 正常页面交互
      my.request({
        url: `https://t-api.5296live.com/mall/xcxpay/create?amount=${this.data.dataInfo.price}&code=${this.data.authCode}`,
        method: 'POST',
        success: (result) => {
          if (result.data.code == 0) {
            my.alert({content: result.data.msg})
            return
          }
          const tradeNO = result.data.data
          my.tradePay({
            // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
            tradeNO,
            success: (res) => {
              console.log(res.data)
            },
            fail: (res) => {
            }
          });
        },
        fail: () => {
          
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
        return
      }
      var timestamp = Date.parse(new Date())
      var queryData = {
        "tagId": 0,
        "isBrushzanli": "true",
        "apiCode": 131,
        "appVer": "1.3.1",
        "channel": "zanli",
        "deviceId": "af72dc99efdf584b",
        "clientType": "ANDROID",
        "idcode": "guest_c3524b8d02f749329498197887127f22",
        "appType": "android",
        "packageName": "com.ninesixshop.say",
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
        return
      }
      my.request({
        url: `${query.data.profile}/mall/order/alxcxPay`,
        method: 'POST',
        headers: {
          "content-type":  'application/x-www-form-urlencoded'
        },
        data,
        success: (result) => {
          const tradeNO = result.data.data
          my.setStorageSync({ key: 'tradeNO', data: tradeNO })
          my.tradePay({
            // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
            tradeNO,
            success: (res) => {
              console.log(res.data)
            },
            fail: (res) => {
              my.alert({content: JSON.stringify(res)})
            }
          });
        },
        fail: () => {
          my.alert({content: '请求出错啦！'})
        },
        complete: () => {
          my.hideLoading();
        }
      });
    }
});
