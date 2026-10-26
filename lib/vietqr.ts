export function getVietQRUrl({
  amount,
  orderId,
  description,
}: {
  amount: number
  orderId: string
  description?: string
}) {
  const bankCode = process.env.BANK_CODE || 'VCB'
  const accountNumber = process.env.BANK_ACCOUNT_NUMBER || '1032429169'
  const addInfo = encodeURIComponent(description || `Thanh toan don hang ${orderId}`)

  // VietQR img API
  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${addInfo}&accountName=${encodeURIComponent(process.env.BANK_ACCOUNT_NAME || 'DANG VU')}`
}

export function getZaloPayUrl(phone: string, productName: string, orderId: string) {
  const msg = encodeURIComponent(`Xin chào! Tôi muốn mua: ${productName} - Mã đơn: ${orderId}`)
  return `https://zalo.me/${phone}?text=${msg}`
}

export function getTelegramDeepLink(botUsername: string, orderId: string) {
  return `https://t.me/${botUsername.replace('@', '')}?start=ord_${orderId}`
}
