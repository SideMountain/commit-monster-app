class PushNotification {
  constructor(id) {
    this.loadScript().then(() => {
      this.init(id)
    })
  }

  loadScript() {
    return new Promise((resolve) => {
      const doc = document
      const script = doc.createElement('script')
      script.async = false
      script.src = `https://sdk.push7.jp/v2/p7sdk.js`
      doc.body.appendChild(script)
      resolve()
    })
  }

  init(id) {
    const p7 = window.p7
    p7.init(id, {
      mode: 'native',
      subscribe: 'auto',
    }).then(() => {
      console.log('初期化済み')
      // p7.subscribe()
    })
  }
}

export default (_ctx, inject) => {
  const $push7 = new PushNotification('プッシュ通知設定のIDを入れる')
  inject('push7', $push7)
}
