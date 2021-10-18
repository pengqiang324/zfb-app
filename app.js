// 获取全局 app 实例
App({
  onLaunch(options) {
    // 第一次打开 冷启动
    if (options.query) {
      my.setStorageSync({ key: 'query', data: options.query })
    }
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // 热启动 app 打开小程序
    if (options.query) {
      my.setStorageSync({ key: 'query', data: options.query })
    }
    const query = my.getStorageSync({key: 'query'})
    this.methods.getAuthCode(query.data);
  },
  onHide() {
    my.setStorageSync({key: 'isLoading', data: false})
  },
  methods: {
    // 获取授权码
    getAuthCode(query) {
      if (query) {
        // app 跳转小场景
        my.removeStorageSync({ key: 'list' }); // 清除页面详情 解决热启动数据缓存问题
        my.setStorageSync({ key: 'amount', data: query.amount })
      } else {
        // h5 跳转小场景
        my.removeStorageSync({ key: 'tradeNO' }); // 清除页面 tradeNO 数据
        my.removeStorageSync({ key: 'amount' }); // 清除价格数据
      }
      my.getAuthCode({
        scopes: ['auth_base'],
        success: (res) => {
          my.setStorageSync({ key: 'authCode', data: res.authCode });
          if(query) { 
            const isLoading = my.getStorageSync({key: 'isLoading'})
            if (isLoading.data) {
              my.removeStorageSync({key: 'tradeNO'}) // 清除tradeNO
              return              
            }
            my.showLoading({
              content: '处理中...'
            });
            this.getTradNo(query) 
          };
        },
      })
    },

    // 获取 tradNo
    getTradNo(query) {
      let authCode = my.getStorageSync({ key: 'authCode'})
      var timestamp = Date.parse(new Date())
      var queryData = {
        "tagId": 0,
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
        "timestamp": timestamp
      };
      const data = {
        ...queryData,
        ...query,
        authCode: authCode.success && authCode.data
      }
      my.request({
        url: `${query.profile}/mall/order/alxcxPay`,
        method: 'POST',
        headers: {
          "content-type":  'application/x-www-form-urlencoded'
        },
        data,
        success: (result) => {
          if(!result.data.code) {
            my.alert({content: `${result.data.msg}`})
            return
          }
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
          my.setStorageSync({key: 'isLoading', data: true})
          my.hideLoading();
        }
      });
    }
  }
});
