export default {
	data() {
		return {
			share: {
				title: '金丝玉玛',
				imageUrl: '',
			}
		}
	},
	//发送给朋友
	onShareAppMessage(res) {
		// 来自页面内分享按钮
		if (res.from === 'button') {
			console.log('按钮', res.target)
		}
		return {
			title: this.share.title,
			imageUrl: getApp().globalData.share_banner,
		}
	},
	//分享到朋友圈
	onShareTimeline() {
		return {
			title: this.share.title,
			imageUrl: getApp().globalData.share_banner,
		}
	},
}