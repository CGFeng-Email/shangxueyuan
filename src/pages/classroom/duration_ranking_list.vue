<!-- 在线时长排行榜 -->
<template>
	<view class="ranking_list">
		<u-sticky bgColor="#fff">
			<u-tabs
				:list="tabs"
				@click="click_tans"
				:current="index"
				lineWidth="26"
				lineColor="#0a2b4e"
				:activeStyle="{
					color: '#0A2B4E',
					fontSize: '28rpx',
					fontWeight: 'bold',
					transform: 'scale(1.03)',
					padding: '0 10rpx'
				}"
				:inactiveStyle="{
					fontSize: '26rpx',
					color: '#9B9B9B',
					transform: 'scale(1)',
					padding: '0 10rpx'
				}"
				itemStyle="height: 44px;"
			></u-tabs>
		</u-sticky>
		<view class="banner">
			<image class="cover" :src="banner" mode="widthFix"></image>
		</view>
		<view class="list">
			<view class="head">
				<view class="title">排行</view>
				<view class="title">用户ID</view>
				<view class="title">时长</view>
			</view>
			<view class="content">
				<u-transition :show="true" mode="fade-up">
					<view class="item" v-for="(item, index) in list" :key="index">
						<view class="serial box">
							<i class="iconfont icon-rexiao-huangguan" v-show="index <= 2"></i>
							<text class="text">{{ (index + 1) | padStartfn }}</text>
						</view>
						<view class="portrait box">
							<image class="cover" :src="item.avatar" mode="widthFix"></image>
							<text class="text">{{ item.nickname }}</text>
						</view>
						<view class="num box">{{ item.online_time | minutesFormat }}</view>
					</view>
					<view class="loading">
						<u-loading-icon text="加载中..." size="12" textSize="12" :show="loading"></u-loading-icon>
					</view>
				</u-transition>
			</view>
		</view>
	</view>
</template>

<script>
import { padStartfn, minutesFormat } from '@/utils/regular.js';
export default {
	data() {
		return {
			loading: true,
			banner: 'https://jsym.kinsyomacz.com/resource/img/course/knowledge/ranking_list/banner.png',
			tabs: [
				{
					name: '周榜',
					type: 'week'
				},
				{
					name: '月榜',
					type: 'month'
				},
				{
					name: '年榜',
					type: 'year'
				}
			],
			index: 0,
			list: []
		};
	},
	filters: {
		padStartfn,
		minutesFormat
	},
	onLoad() {
		this.get_list();
	},
	methods: {
		// tabs切换
		click_tans(e) {
			this.index = e.index;
			this.get_list();
		},
		// 获取登录天数排行榜
		async get_list() {
			this.list = [];
			this.loading = true;
			const res = await this.$request.get2('/api/time/rankingList', {
				type: this.tabs[this.index].type,
				limit: 10
			});
			console.log('在线时长', res);
			if (res.code == 200) {
				this.list = res.data;
				this.loading = false;
			}
		}
	}
};
</script>

<style lang="less" scoped>
.ranking_list {
	.banner {
		.cover {
			width: 100%;
			height: auto;
		}
	}

	.list {
		background: #fff;
		border-radius: 24rpx 24rpx 0 0;
		transform: translateY(-26rpx);
		padding: 30rpx 20rpx;
		.head {
			display: flex;
			.title {
				flex: 1;
				text-align: center;
				font-size: 28rpx;
				color: #000;
				font-weight: 600;
			}
		}

		.content {
			.loading {
				margin-top: 30rpx;
			}
			.item {
				padding: 24rpx 0;
				border-bottom: 1px solid #f8f8f8;
				display: flex;
				.box {
					flex: 1;
					font-size: 26rpx;
					color: #333;
					text-align: center;
				}

				.serial {
					display: flex;
					align-items: center;
					justify-content: center;
					position: relative;
					.iconfont {
						font-size: 36rpx;
						position: absolute;
						left: 40rpx;
						top: 50%;
						transform: translateY(-50%);
					}
				}

				.portrait {
					display: flex;
					align-items: center;
					justify-content: center;
					.cover {
						width: 40rpx;
						height: auto;
						border-radius: 50%;
					}
					.text {
						padding-left: 10rpx;
						white-space: nowrap;
					}
				}
			}

			.item:nth-child(1) {
				.serial {
					.iconfont {
						color: #ffc621;
					}
				}
			}
			.item:nth-child(2) {
				.serial {
					.iconfont {
						color: #bdbdbd;
					}
				}
			}
			.item:nth-child(3) {
				.serial {
					.iconfont {
						color: #ceb391;
					}
				}
			}
		}
	}
}
</style>
