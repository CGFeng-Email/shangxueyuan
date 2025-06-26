<!-- 历史记录 -->
<template>
	<view class="history_list">
		<view class="list">
			<u-transition :show="true" mode="slide-up" duration="600">
				<view class="item" v-for="(item, index) in list" :key="index" @click="open_video_details(item.courseId)">
					<view class="cover_box">
						<image class="cover" :src="item.courseImage" mode="scaleToFill"></image>
					</view>
					<view class="content">
						<view class="title over1">{{ item.courseName }}</view>
						<view class="lead over1">{{ item.remark }}</view>
						<view class="time">
							<i class="iconfont icon-shijian"></i>
							<text class="text">{{ item.updateTime | secondsFormat }}</text>
						</view>
						<view class="statuc">
							<view class="box">
								<i class="iconfont icon-kanguos"></i>
								<text class="text">{{ item.courseWatch }}</text>
							</view>
							<view class="box">
								<i class="iconfont icon-shoucang1"></i>
								<text class="text">{{ item.coursehistory }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="empty" v-if="empty_show">
					<u-empty text="内容为空" mode="car" :icon="empty"></u-empty>
				</view>
			</u-transition>
		</view>
	</view>
</template>

<script>
import { dateFormat, secondsFormat } from '@/utils/regular.js';
export default {
	data() {
		return {
			empty_show: false,
			empty: '/static/img/empty/data.png',
			list: []
		};
	},
	filters: {
		dateFormat,
		secondsFormat
	},
	created() {
		this.get_list();
	},
	methods: {
		// 跳转视频课程详情
		open_video_details(id) {
			uni.navigateTo({
				url: `/pages/course/knowledge/video_details?id=${id}`
			});
		},
		// 获取列表 只有课程有历史记录
		async get_list() {
			const res = await this.$request.get2('/api/progress/history');
			console.log('历史记录', res);
			if (res.code == 200) {
				this.list = res.data;
			}
			if (this.list.length == 0) {
				this.empty_show = true;
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
.list {
	padding: 20rpx;
	.item {
		margin-bottom: 20rpx;
		background: #fff;
		border-radius: 12rpx;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		.cover_box {
			width: 230rpx;
			border-radius: 12rpx;
			overflow: hidden;
			flex: none;
			.cover {
				height: 180rpx;
			}
		}

		.content {
			flex: 1;
			padding-left: 20rpx;
			.title {
				font-size: 28rpx;
				line-height: 38rpx;
				color: #000;
				font-weight: 600;
			}

			.lead {
				font-size: 24rpx;
				line-height: 34rpx;
				color: #4d4d4d;
				margin: 12rpx 0;
			}

			.time {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: #9f9f9f;
				.iconfont {
					font-size: 24rpx;
					color: #9f9f9f;
					padding-right: 6rpx;
				}
			}

			.statuc {
				display: flex;
				align-items: center;
				.box {
					padding-top: 12rpx;
					display: flex;
					align-items: center;
					padding-right: 20rpx;
					.iconfont {
						font-size: 24rpx;
						color: #9f9f9f;
					}
					.text {
						font-size: 24rpx;
						color: #9f9f9f;
						padding-left: 6rpx;
					}
				}
			}
		}
	}
}
</style>
