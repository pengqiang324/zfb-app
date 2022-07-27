import addressList from '/utils/address'
Page({
  data: {
    form: {
      name: '',
      iphone: '',
      region: '请输入所在地区',
      detailAddress: ''
    }
  },
  onLoad() {
    this.getAddress()
  },
  getAddress() {
    let res = my.getStorageSync({ key: 'address' });
    if (!res.error && res.data) {
      const { name, iphone, detailAddress, region } = res.data
      this.setData({
        'form.name': name || '',
        'form.iphone': iphone || '',
        'form.detailAddress': detailAddress || '',
        'form.region': region || ''
      })
    }
  },
  handleInputName(e) {
    this.setData({
      'form.name': e.detail.value
    })
  },
  handleInputTel(e) {
    this.setData({
      'form.iphone': e.detail.value
    })
  },
  handleInputDetailaddress(e) {
    this.setData({
      'form.detailAddress': e.detail.value
    })
  },
  handleSave() {
    //存储地址
    const { name, iphone, region } = this.data.form
    if (!name || !iphone) {
      my.showToast({
        type: 'none',
        content: '收货人/手机号码不能为空',
        duration: 3000
      });
      return
    } else if (region === '请输入所在地区') {
      my.showToast({
        type: 'none',
        content: '请选择所在地区',
        duration: 3000
      });
      return
    }
    my.setStorageSync({
      key: 'address',
      data: {
        ...this.data.form
      }
    })
    my.navigateBack()
  },
  handleTapAddress() {
    my.multiLevelSelect({
        title: '所在地区', // 级联选择标题
        list: addressList, // 城市级联数据列表
        success:(res)=>{
          if (res.success) {
            let str = ''
            res.result.forEach(item => {
              str += item.name
            });
            this.setData({
              'form.region': str
            })
          }
        }
    });
  }
});
