<!-- 云课堂个人集 -->
<template>
	<view class="me">
		<u-transition :show="true">
			<!-- swiper -->
			<u-swiper :list="banner_list" keyName="src" height="174" indicator indicatorMode="line" circular @change="(e) => (swiper_banner_inedx = e.current)"></u-swiper>
			<!-- tabs -->
			<view class="tabs box-shadow">
				<view class="head">
					<i class="iconfont icon-shuxian"></i>
					<text class="text">学习动态</text>
				</view>
				<view class="tabs_list">
					<view class="item" v-for="(item, index) in tabs_list" :key="index" @click="open_url(item)">
						<view class="cover_box">
							<image class="cover" :src="item.src" mode="widthFix"></image>
						</view>
						<view class="name">
							{{ item.name }}
						</view>
					</view>
				</view>
			</view>
			<!-- 学习排行榜 -->
			<view class="study box-shadow">
				<view class="head">
					<i class="iconfont icon-shuxian"></i>
					<text class="text">学习排行榜</text>
				</view>
				<view class="list">
					<view class="item" @click="open_days_ranking_list">
						<view class="title">登录天数</view>
						<view class="portrait">
							<u-avatar-group :urls="number_of_days" size="30" gap="0.3" :extraValue="number_of_days.length - 5" random-bg-color keyName="avatar"></u-avatar-group>
						</view>
					</view>
					<view class="item" @click="open_duration_ranking_list">
						<view class="title">在线时长</view>
						<view class="portrait">
							<u-avatar-group :urls="duration_list" size="30" gap="0.3" :extraValue="duration_list.length - 5" random-bg-color keyName="avatar"></u-avatar-group>
						</view>
					</view>
				</view>
			</view>
			<!-- 个人中心 -->
			<view class="me_btn box-shadow" @click="open_me_center">
				<view class="head">
					<i class="iconfont icon-shuxian"></i>
					<text class="text">个人中心</text>
				</view>
				<view class="list">
					<view class="item">
						<view class="left">
							<view class="cover_box">
								<image class="cover" :src="head_portrait" mode="aspectFit"></image>
							</view>
							<view class="user_data">
								<view class="name">
									{{ user_name }}
								</view>
								<view class="desc">
									{{ user_desc }}
								</view>
							</view>
						</view>
						<view class="icon">
							<i class="iconfont icon-right-1-copy"></i>
						</view>
					</view>
				</view>
			</view>
		</u-transition>
	</view>
</template>

<script>
export default {
	data() {
		return {
			swiper_banner_inedx: 0,
			banner_list: [],
			tabs_list: [
				{
					src: 'https://quanyi-1317202885.cos.ap-guangzhou.myqcloud.com/jinsiyuma/%E4%BA%91%E8%AF%BE%E5%A0%82/me/tabs1.png',
					name: '账号密码',
					link: '/pages/login/edit_password'
				},
				{
					src: 'https://quanyi-1317202885.cos.ap-guangzhou.myqcloud.com/jinsiyuma/%E4%BA%91%E8%AF%BE%E5%A0%82/me/tabs2.png',
					name: '历史记录',
					link: '/pages/course/knowledge/history_list'
				},
				{
					src: 'https://quanyi-1317202885.cos.ap-guangzhou.myqcloud.com/jinsiyuma/%E4%BA%91%E8%AF%BE%E5%A0%82/me/tabs3.png',
					name: '收藏课程',
					link: '/pages/course/knowledge/collect_list'
				},
				{
					src: 'https://quanyi-1317202885.cos.ap-guangzhou.myqcloud.com/jinsiyuma/%E4%BA%91%E8%AF%BE%E5%A0%82/me/tabs4.png',
					name: '已购课程',
					link: '/pages/course/knowledge/purchase_list'
				}
			],
			number_of_days: [], // 登录天数排行榜
			duration_list: [], // 在线时长排行榜
			head_portrait: '', // 头像
			user_name: '云课堂用户',
			user_desc: '尊敬的用户，你好！'
		};
	},
	created() {
		this.get_number_of_days();
		this.get_duration();
		this.get_me();
		this.get_swiper();
	},
	methods: {
		// 跳转天数排行榜
		open_days_ranking_list() {
			uni.navigateTo({
				url: '/pages/course/knowledge/days_ranking_list'
			});
		},
		// 跳转时长排行榜
		open_duration_ranking_list() {
			uni.navigateTo({
				url: '/pages/course/knowledge/duration_ranking_list'
			});
		},
		open_url(e) {
			uni.navigateTo({
				url: e.link
			});
		},
		open_me_center() {
			uni.navigateTo({
				url: '/pages/course/knowledge/me_center'
			});
		},
		// 获取登录天数排行榜
		async get_number_of_days() {
			const res = await this.$request.get2('/api/records/rankingList', {
				type: 'week',
				limit: 10
			});
			console.log('登录天数', res);
			if (res.code == 200) {
				this.number_of_days = res.data;
			}
		},
		// 获取在线时长排行榜
		async get_duration() {
			const res = await this.$request.get2('/api/time/rankingList', {
				type: 'week',
				limit: 10
			});
			console.log('在线时长', res);
			if (res.code == 200) {
				this.duration_list = res.data;
			}
		},
		// 获取个人中心数据
		async get_me() {
			const res = await this.$request.get2('/api/user/center');
			console.log('个人数据', res);
			if (res.code == 200) {
				this.head_portrait = res.data.avatar;
				this.user_name = res.data.nickname;
			}
		},
		// 获取swiper
		async get_swiper() {
			const res = await this.$request.get2('/api/banner/list', {
				name: '个人集'
			});
			console.log('轮播', res);
			if (res.code == 200) {
				this.banner_list = res.data.lists[0].images;
			}
		}
	}
};
</script>

<style>
page {
	background: #f8f8f8;
}
</style>
<style lang="less" scoped>
.me {
	padding: 30rpx 30rpx 80rpx;
	.head {
		display: flex;
		align-items: center;
		.iconfont {
			font-weight: 700;
			color: #002c50;
		}
		.text {
			font-size: 32rpx;
			color: #002c50;
			font-weight: 500;
		}
	}
	.tabs {
		background: #fff;
		padding: 20rpx;
		border-radius: 12rpx;
		margin: 30rpx 0;
		.tabs_list {
			display: flex;
			.item {
				width: 25%;
				.cover_box {
					padding: 20rpx 0 10rpx;
					margin: auto;
					background: #fff;
					width: 84rpx;
				}

				.name {
					text-align: center;
					font-size: 24rpx;
					color: #333;
				}
			}
		}
	}

	.study {
		background: #fff;
		padding: 20rpx 20rpx 0;
		border-radius: 12rpx;
		.list {
			padding: 30rpx 0 30rpx 10rpx;
			display: flex;
			flex-wrap: wrap;
			.item {
				width: 310rpx;
				margin-bottom: 20rpx;
				.title {
					font-size: 26rpx;
					color: #4d4d4d;
				}
				.portrait {
					padding: 20rpx 0;
				}
			}

			.item:nth-child(odd) {
				margin-right: 20rpx;
			}
		}
	}

	.me_btn {
		margin-top: 30rpx;
		background: #fff;
		padding: 20rpx 20rpx 0;
		border-radius: 12rpx;
		.list {
			.item {
				padding: 30rpx 0;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.left {
					flex: 1;
					display: flex;
					align-items: center;
					.cover_box {
						width: 120rpx;
						height: 122rpx;
						border-radius: 50%;
						.cover {
							width: 120rpx;
							height: 122rpx;
							border-radius: 50%;
						}
					}

					.user_data {
						padding-left: 20rpx;
						.name {
							font-size: 28rpx;
							line-height: 38rpx;
							font-weight: 600;
							color: #313131;
						}

						.desc {
							font-size: 22rpx;
							line-height: 24rpx;
							color: #464646;
							padding-top: 10rpx;
						}
					}
				}
				.icon {
					flex: none;
				}
			}
		}
	}
}
</style>
