<!-- 照片集 -->
<template>
	<view class="container">
		<u-transition :show="true" mode="fade-up" duration="600">
			<view class="list">
				<view class="item box-shadow" v-for="(item, index) in list" :key="index" @click="open_details(item.id)">
					<view class="cover_box">
						<image class="cover" :src="item.cover" mode="widthFix"></image>
					</view>
					<view class="content">
						<view class="title">{{ item.name }}</view>
						<!-- <view class="time">
						<i class="iconfont icon-shijian"></i>
						<text class="text">{{item.}}</text>
					</view> -->
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
			list: []
		};
	},
	onLoad() {
		this.get_data();
	},
	methods: {
		open_details(id) {
			uni.navigateTo({
				url: `/pages/course/knowledge/img_list_details?id=${id}`
			});
		},
		async get_data() {
			const res = await this.$request.get2('/api/photos/list', {
				pageSize: 60
			});
			console.log('列表', res);
			this.list = res.data.lists;
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
	padding: 30rpx;
	.item {
		background: #fff;
		padding: 20rpx;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		.content {
			padding-top: 20rpx;
			.title {
				font-size: 30rpx;
				line-height: 42rpx;
				color: #000;
				font-weight: 500;
			}
			.time {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				line-height: 36rpx;
				color: #c9c9c9;
				.iconfont {
					font-size: 24rpx;
					color: #c9c9c9;
					padding-right: 6rpx;
				}
			}
		}
	}
}
.indicator-num {
	padding: 6rpx 20rpx;
	background-color: rgba(0, 0, 0, 0.35);
	border-radius: 100px;
	display: flex;
	justify-content: center;

	&__text {
		color: #ffffff;
		font-size: 12px;
	}
}
</style>
