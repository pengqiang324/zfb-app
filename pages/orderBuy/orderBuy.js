import { fmoney } from '/utils/index'
Page({
  data: {
    dataInfo: {},
    addressInfo: {}
  },
  onLoad() {
    this.init()
  },
  onShow() {
    this.getAddress()
  },
  init() {
    let res = my.getStorageSync({ key: 'list' });
    if (!res.error) {
      this.setData({
        dataInfo: res.data,
        'dataInfo.totalPrice': fmoney(res.data.price)
      })
    }
  },
  getAddress() {
    let res = my.getStorageSync({ key: 'address' });
    if (!res.error && res.data) {
      this.setData({
        addressInfo: res.data || {},
        'addressInfo.tel': this.splitTel(res.data.iphone)
      })
    }
  },
  handleAddress() {
    my.navigateTo({ url: '/pages/address/address' })
  },
  handleSubmit() {
    if (this.isEmptyObject()) {
      // 地址为空
      my.showToast({
        type: 'none',
        content: '请先新增收货地址',
        duration: 3000
      });
      return
    }
    my.navigateTo({ url: '/pages/payment/payment' })
  },
  isEmptyObject() {
    const { data: Address } = my.getStorageSync({ key: 'address' });
    console.log(Address)
    return !Address || Object.keys(Address).length === 0 || !Address['name']
  },
  splitTel(str) {
    return str.substr(0,3)+'****'+str.substr(7);
  },
  onGetAuthorize() {

     my.getPhoneNumber({
        success: (res) => {
            let encryptedData = res.response;
            console.log(encryptedData)
        },
        fail: (res) => {
            console.log(res);
            console.log('getPhoneNumber_fail');
        },
    });
  },
  onAuthError() {}
});
