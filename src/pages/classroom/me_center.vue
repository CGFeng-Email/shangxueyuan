<!-- 个人信息 -->
<template>
	<view class="container">
		<view class="info">
			<view class="list">
				<u-transition :show="true" mode="fade">
					<view class="item">
						<view class="left">
							<text class="text">头像</text>
						</view>
						<button class="right cover_box box-shadow head_portrait" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
							<image class="cover" :src="head_portrait"></image>
							<i class="iconfont icon-right-1-copy"></i>
						</button>
					</view>
					<view class="item p_right">
						<view class="left">
							<text class="text">昵称</text>
						</view>
						<view class="right">
							<input class="input" type="nickname" :value="nickname ? nickname : '一只小蘑菇'" @blur="blur_nickname" @confirm="blur_nickname" />
						</view>
					</view>
					<view class="item p_right">
						<view class="left">
							<text class="text">手机号</text>
						</view>
						<view class="right">
							<text class="text phone">{{ phone }}</text>
						</view>
					</view>
					<view class="item p_right">
						<view class="left">
							<text class="text">注册时间</text>
						</view>
						<view class="right">
							<text class="text">{{ registration_date | dateFormat2 }}</text>
						</view>
					</view>
					<view class="item p_right">
						<view class="left">
							<text class="text">所属俱乐部</text>
						</view>
						<view class="right">
							<text class="text">无</text>
						</view>
					</view>
					<view class="item p_right">
						<view class="left">
							<text class="text">课堂等级</text>
						</view>
						<view class="right">
							<text class="text">无</text>
						</view>
					</view>
				</u-transition>
			</view>
			<view class="loading">
				<u-loading-icon text="加载中..." size="12" textSize="12" :show="loading"></u-loading-icon>
			</view>
			<!-- 版本 -->
			<view class="versions">
				<view class="number">版本{{ version }}</view>
				<view class="btn_box">
					<u-button class="button" shape="circle" throttleTime="200" color="#0A2B4E" @click="quit">退出账号</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { dateFormat2 } from '@/utils/regular.js';
export default {
	data() {
		return {
			loading: false,
			head_portrait: '', // 头像
			nickname: '', // 昵称
			phone: '', // 手机号
			registration_date: '', // 注册日期
			version: '' // 版本号
		};
	},
	onLoad() {
		// 获取版本号
		const accountInfo = uni.getAccountInfoSync();
		this.version = accountInfo.miniProgram.version;
		this.get_userData();
	},
	filters: { dateFormat2 },
	methods: {
		// 获取用户信息
		async get_userData() {
			this.loading = true;
			const res = await this.$request.get2('/api/user/center');
			console.log('个人数据', res);
			if (res.code == 200) {
				this.head_portrait = res.data.avatar;
				this.nickname = res.data.nickname;
				this.phone = res.data.mobile;
				this.registration_date = res.data.createTime;
				this.loading = false;
			}
		},
		// 上传用户头像
		async onChooseAvatar(e) {
			console.log('e', e);

			// 处理成base64
			const base_url = 'data:image/jpeg;base64,' + wx.getFileSystemManager().readFileSync(e.detail.avatarUrl, 'base64');
			// console.log('base64', base_url);

			// 上传图片
			const res = await this.$request.post3('/api/upload/base64', {
				base64: base_url
			});
			// console.log('上传', res);

			// 修改保存
			if (res.code == 200) {
				await this.edit_user_data(1, res.data.path);
			} else {
				uni.showToast({
					title: '服务器发生错误，头像更换出错',
					icon: 'none',
					duration: 2000
				});
			}
		},
		// 昵称失去焦点
		blur_nickname(e) {
			this.edit_user_data(2, e.detail.value);
		},
		// 修改头像，昵称
		async edit_user_data(type, value) {
			if (value) {
				uni.showLoading({
					title: '加载中',
					mask: true
				});
				const res = await this.$request.post3('/api/user/edit', {
					field: type == 1 ? 'avatar' : 'nickname',
					value: value
				});
				console.log('修改后的回调', res);
				if (res.code == 200) {
					if (type == 1) {
						this.head_portrait = value;
					} else if (type == 2) {
						this.nickname = value;
					}
				} else {
					uni.showToast({
						title: '服务器发生错误，头像更换出错',
						icon: 'none',
						duration: 2000
					});
				}
				uni.hideLoading();
			}
		},
		// 退出账号
		async quit() {
			uni.showLoading({
				title: '加载中',
				mask: true
			});

			await this.quit_duration();
			uni.removeStorageSync('jinsiyuma_token');
			uni.removeStorageSync('jinsiyuma_user_id');

			uni.switchTab({
				url: '/pages/index/index'
			});

			uni.hideLoading();
		},
		// 退出小程序修改云课堂在线时长
		async quit_duration() {
			const jinsiyuma_token = uni.getStorageSync('jinsiyuma_token');
			const jinsiyuma_user_id = uni.getStorageSync('jinsiyuma_user_id');
			const start_duration_id = uni.getStorageSync('start_duration_id');
			const start_duration = uni.getStorageSync('start_duration');
			// 判断是否有token，是否注册成为云课堂用户
			if (jinsiyuma_token && jinsiyuma_user_id && start_duration_id && start_duration) {
				const date = new Date().getTime();
				const end_duration = (date - start_duration) / 1000;
				const res = await this.$request.post3('/api/time/edit', {
					id: start_duration_id,
					duration: end_duration
				});
				console.log('退出小程序修改云课堂在线时长', res);
				if (res.code == 200) {
					uni.removeStorageSync('start_duration_id');
					uni.removeStorageSync('start_duration');
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
.info {
	padding-bottom: 200rpx;
	.list {
		border-top: 1px solid #f8f8f8;
		.item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 20rpx;
			border-bottom: 1px solid #f8f8f8;
			.left {
				flex: none;
				.text {
					font-size: 28rpx;
					font-weight: 500;
					color: #313131;
				}
			}
			.right {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				.cover {
					width: 92rpx;
					height: 92rpx;
					border-radius: 50%;
					overflow: hidden;
				}

				.iconfont {
					font-size: 24rpx;
					color: #cecece;
					padding-left: 10rpx;
				}

				.text {
					font-size: 28rpx;
					font-weight: 500;
					color: #464646;
					flex: 1;
					text-align: right;
				}

				.input {
					text-align: right;
				}

				input {
					text-align: right;
					font-size: 28rpx;
					font-weight: 500;
					color: #464646;
				}

				.fete {
					color: #888888;
				}

				.textarea {
					width: 88%;
					padding-left: 20rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #464646;
				}
			}
			.cover_box {
				background: none;
				box-shadow: none;
				padding: 0 !important;
				&::after {
					display: none;
				}
			}
		}
		.p_right {
			padding-right: 40rpx;
		}
	}

	.loading {
		margin-top: 30rpx;
	}

	.versions {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 0 20rpx 50rpx;
		background: #fff;
		.number {
			text-align: center;
			font-size: 26rpx;
			font-weight: 500;
			color: #cdcdcd;
			padding: 22rpx 0;
		}
		.btn_box {
			/deep/ button {
				height: 100rpx;
			}
		}
	}
}
</style>
