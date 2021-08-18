let weightEmptyFilter = (value) => {
  if (!value) {
    return '-'
  } else {
    return value + 'KG'
  }
}
let formatEmpty = value => {
  if (value) {
    return value
  } else {
    return '-'
  }
}
let contractTypeFilter = value => {
  if (value === 'VIP_CARD_CONTRACT') {
    return '会员卡'
  } else if (value === 'TRAINING_CONTRACT') {
    return '私教课'
  } else if (value === 'TRANSFER_CARD') {
    return '转/补卡费'
  } else if (value === 'OTHER_SALES') {
    return '其他销售'
  } else if (value === 'GROUP_PURCHASE_PRICE') {
    return '团购补差价'
  } else if (value === 'REFUND') {
    return '退费'
  }
  return '未知'
}
let payTypeFilter = value => {
  if (value === 'ALIPAY') {
    return '支付宝-对公'
  } else if (value === 'WECHAT_PAY') {
    return '微信-对公'
  } else if (value === 'UNION_PAY') {
    return '银联'
  } else if (value === 'CASH') {
    return '现金'
  } else if (value === 'PUBLIC_ACCOUNT') {
    return '对公账户'
  } else if (value === 'PUBLIC_COMMENT') {
    return '大众点评'
  } else if (value === 'ALIPAY_PERSONAL') {
    return '支付宝-对个人'
  } else if (value === 'WECHAT_PERSONAL') {
    return '微信-对个人'
  } else if (!value) {
    return '-'
  }
  return '未知'
}

let contractStatusFilter = value => {
  if (value === 'PREPAYMENT') {
    return '预收费'
  } else if (value === 'NO_START') {
    return '未开始'
  } else if (value === 'IN_PROGRESS') {
    return '进行中'
  } else if (value === 'FINISHED') {
    return '已结束'
  } else if (value === 'EXPIRED') {
    return '过期'
  } else if (value === 'DELETE_MANUALLY') {
    return '手动删除'
  } else if (value === 'REFUNDED') {
    return '已退款'
  }
  return '未知'
}
let clientFilter = value => {
  if (value === 'ADMIN') {
    return '后台管理'
  } else if (value === 'MINI_PROGRAM') {
    return '小程序'
  } else if (value === 'PAD') {
    return '平板'
  }
  return '未知'
}

export {weightEmptyFilter, formatEmpty, contractTypeFilter, payTypeFilter, contractStatusFilter, clientFilter}
