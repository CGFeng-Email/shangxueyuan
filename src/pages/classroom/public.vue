<!-- 公开课 -->
<template>
	<view class="public">
		<u-transition :show="true" mode="fade">
			<!-- swiper -->
			<u-swiper :list="banner_list" keyName="src" height="174" indicator indicatorMode="line" circular @change="(e) => (swiper_banner_inedx = e.current)"></u-swiper>
			<!-- tabs -->
			<view class="tabs">
				<view class="item" :class="tabs_list_index == index ? 'active' : ''" v-for="(item, index) in tabs_list" :key="index" @click="click_tabs(index)">
					<view class="circle">
						<image class="cover" :src="item.image" mode="widthFix"></image>
					</view>
					<view class="name">
						{{ item.name }}
					</view>
				</view>
			</view>
			<!-- 列表 -->
			<scroll-view class="list" :list_class="true">
				<view class="item box-shadow" v-for="(item, index) in list" :key="index" @click="open_video_details(item.courseId)">
					<view class="cover_box">
						<image class="cover" :src="item.courseImage" mode="widthFix"></image>
					</view>
					<view class="title over1">
						{{ item.courseName }}
					</view>
					<view class="bottom">
						<view class="name">
							<i class="iconfont icon-shipin"></i>
							<text class="text">课程视频</text>
						</view>
						<view class="name">
							<i class="iconfont icon-kanguos"></i>
							<text class="text">{{ item.courseWatch }}次学习</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 加载提示 -->
			<view class="loadmore_box">
				<u-loadmore :status="loading" :loading-text="loadingText" :loadmore-text="loadmoreText" :nomore-text="nomoreText" color="#b7b7b7" fontSize="12" iconSize="16" />
			</view>
		</u-transition>
	</view>
</template>

<script>
export default {
	data() {
		return {
			page: 1, // 分页
			size: 10, // 每页条数
			count: '', // 总条数
			banner_list: [],
			swiper_banner_inedx: 0,
			tabs_list: [], // 菜单栏
			tabs_list_index: 0, // 菜单栏下标
			list: [], // 列表数据
			loadingText: '正在加载...',
			loadmoreText: '上拉加载',
			nomoreText: '没有更多了',
			loading: 'loadmore' // 加载前值为loadmore，加载中为loading，没有数据为nomore
		};
	},
	async created() {
		await this.get_tabs_list();
		await this.get_list();
		await this.get_swiper();
	},
	methods: {
		// 获取分类菜单
		async get_tabs_list() {
			const res = await this.$request.get2('/api/classify/list', {
				parentId: 3
			});
			console.log('分类菜单', res);
			if (res.code == 200) {
				this.tabs_list = res.data;
			}
		},
		// tabs栏切换
		click_tabs(index) {
			if (this.tabs_list_index == index) return;
			this.page = 1;
			this.tabs_list_index = index;
			this.get_list();
		},
		// 对应分类的列表数据
		async get_list(toBottom = false) {
			this.loading = 'loading';
			if (toBottom) {
				this.page++;
			}
			const res = await this.$request.get2('/api/courseInfo/list', {
				pageSize: this.size,
				pageNo: this.page,
				courseClassify: this.tabs_list[this.tabs_list_index].id
			});
			console.log('对应分类的列表数据', res);
			if (res.code == 200) {
				this.count = res.data.count;
				if (toBottom) {
					this.list = [...this.list, ...res.data.lists];
				} else {
					this.list = res.data.lists; // 列表
				}

				if (res.data.count >= this.list.length) {
					this.loading = 'nomore';
				} else {
					this.loading = 'loadmore';
				}
			} else {
				this.loading = 'nomore';
			}
		},
		// 获取swiper
		async get_swiper() {
			const res = await this.$request.get2('/api/banner/list', {
				name: '公开课'
			});
			console.log('轮播', res);
			if (res.code == 200) {
				this.banner_list = res.data.lists[0].images;
			}
		},
		// 跳转详情
		open_video_details(id) {
			uni.navigateTo({
				url: `/pages/course/knowledge/video_details?id=${id}`
			});
		},
		// 触底
		tolower() {
			if (this.count >= this.list.length) return;
			this.get_list(true);
		}
	}
};
</script>

<style>
page {
	padding-bottom: 20px;
}
</style>

<style lang="less" scoped>
.public {
	padding: 30rpx;
	.tabs {
		padding: 50rpx 0;
		display: flex;
		.item {
			flex: 1;
			text-align: center;
			.circle {
				width: 100rpx;
				height: 100rpx;
				padding: 10rpx;
				border-radius: 50%;
				overflow: hidden;
				background: #fff;
				margin: auto;
				.cover {
					width: 100%;
					height: auto;
				}
			}
			.name {
				margin-top: 10rpx;
				font-size: 26rpx;
				color: #323232;
			}
		}

		.active {
			.name {
				color: #0a2b4e;
				font-weight: 600;
				transform: scale(1.1);
			}
		}
	}
}

.list {
	.item {
		width: 330rpx;
		padding: 20rpx 20rpx 10rpx;
		background: #fff;
		margin-top: 30rpx;
		border-radius: 12rpx;
		display: inline-block;
		.cover_box {
			border-radius: 12rpx;
			overflow: hidden;
			.cover {
				max-height: 220rpx;
			}
		}
		.title {
			padding-top: 16rpx;
			font-size: 24rpx;
			line-height: 36rpx;
			color: #000;
		}
		.bottom {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.name {
				margin-top: 10rpx;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				font-size: 24rpx;
				color: #000;
				line-height: 36rpx;
				.iconfont {
					color: #c9c9c9;
					padding-right: 10rpx;
				}
			}
		}
	}
	.item:nth-child(odd) {
		margin-right: 30rpx;
	}
	.item:nth-child(1) {
		margin-top: 0;
	}
	.item:nth-child(2) {
		margin-top: 0;
	}
}
</style>
