<!-- 加油站 -->
<template>
	<view class="cheer">
		<!-- swiper -->
		<div class="swiper">
			<u-swiper :list="banner_list" keyName="src" height="174" indicator indicatorMode="line" circular @change="(e) => (swiper_banner_inedx = e.current)"></u-swiper>
		</div>
		<u-sticky offset-top="-4" customNavHeight="88" bgColor="#fff">
			<view class="tabs_content">
				<u-tabs
					class="tabs"
					:current="tabs_index"
					:list="tabs"
					lineWidth="30"
					lineColor="#0A2B4E"
					@click="click_tabs"
					:activeStyle="{
						color: '#0A2B4E',
						fontSize: '26rpx',
						fontWeight: 'bold',
						transform: 'scale(1.05)',
						padding: '0 10rpx'
					}"
					:inactiveStyle="{
						fontSize: '24rpx',
						color: '#000',
						transform: 'scale(1)',
						padding: '0 10rpx'
					}"
					itemStyle="height: 44px;"
				></u-tabs>
			</view>
		</u-sticky>
		<!-- 内容类 -->
		<view class="content">
			<!-- 视频类 -->
			<u-transition :show="tabs_index == 0 || tabs_index == 1" mode="fade-up">
				<view class="video">
					<view class="head">
						<u-tabs
							duration="600"
							:list="video_tabs"
							:current="video_tabs_index"
							lineWidth="0"
							lineHeight="0"
							lineColor="#fff"
							@click="click_video_tabs"
							:activeStyle="{
								color: '#0A2B4E',
								fontSize: '26rpx',
								fontWeight: '500'
							}"
							:inactiveStyle="{
								fontSize: '24rpx',
								color: '#9B9B9B'
							}"
							itemStyle="height: 38px;"
						>
							<template v-for="(item, index) in video_tabs" slot="lable{{index}}">
								<view class="item">
									<i class="iconfont icon-yizan" :class="video_tabs_index == 0 ? 'active' : ''" v-if="index == 0"></i>
									{{ item.name }}
								</view>
							</template>
						</u-tabs>
					</view>
					<!-- 列表 -->
					<view class="list">
						<view class="item box-shadow" v-for="(item, index) in list" :key="index" @click="open_video_details(item.courseId)">
							<view class="cover_box">
								<image class="cover" :src="item.courseImage" mode="widthFix"></image>
								<view class="shadow_box">{{ item.courseWatch }}人学习</view>
							</view>
							<view class="name over2">
								{{ item.courseName }}
							</view>
						</view>
					</view>
				</view>
			</u-transition>
			<!-- 图文类 -->
			<u-transition :show="tabs_index == 2" mode="fade-up" duration="600">
				<view class="img_content">
					<view class="img_item box-shadow" v-for="(item, index) in img_list" :key="index" @click="open_activity_details(item.id)">
						<view class="cover_box">
							<image class="cover" :src="item.cover" mode="widthFix" marginTop="30"></image>
						</view>
						<view class="title">
							{{ item.name }}
						</view>
						<view class="time">
							<i class="iconfont icon-shijian"></i>
							<text class="text">{{ item.createTime | dateFormat }}</text>
						</view>
					</view>
				</view>
			</u-transition>
			<!-- 加载提示 -->
			<view class="loadmore_box">
				<u-loadmore :status="loading" :loading-text="loadingText" :loadmore-text="loadmoreText" :nomore-text="nomoreText" color="#b7b7b7" fontSize="12" iconSize="16" />
			</view>
		</view>
	</view>
</template>

<script>
import { dateFormat } from '@/utils/regular.js';
export default {
	data() {
		return {
			banner_list: [],
			swiper_banner_inedx: 0,
			page: 1, // 分页
			size: 10, // 每页条数
			count: '', // 总条数
			tabs: [], // 一级分类
			tabs_index: 0,
			video_tabs: [], // 二级视频分类
			video_tabs_index: 0,
			list: [], // 视频列表
			img_list: [], // 图文列表
			loadingText: '正在加载...',
			loadmoreText: '上拉加载',
			nomoreText: '没有更多了',
			loading: 'loadmore' // 加载前值为loadmore，加载中为loading，没有数据为nomore
		};
	},
	filters: { dateFormat },
	async created() {
		await this.get_swiper(); // 轮播图
		await this.get_menu(); // 一级分类
		await this.secoen_level(); // 二级分类
		await this.get_list(); // 视频列表
	},
	methods: {
		// 一级分类
		async click_tabs(item) {
			if (this.tabs_index == item.index) return;
			this.tabs_index = item.index; // 一级分类
			this.video_tabs_index = 0; // 二级分类初始化
			this.page = 1;
			if (item.index == 0 || item.index == 1) {
				await this.secoen_level(); // 二级分类
				await this.get_list(); // 视频列表
			} else {
				this.get_img_list();
			}
		},
		// 视频二级分类菜单切换
		click_video_tabs(item) {
			this.video_tabs_index = item.index;
			this.get_list();
		},
		// 跳转课程详情
		open_video_details(id) {
			uni.navigateTo({
				url: `/pages/course/knowledge/video_details?id=${id}`
			});
		},
		// 跳转图文详情
		open_activity_details(id) {
			uni.navigateTo({
				url: `/pages/course/activity/details?id=${id}&type=2`
			});
		},
		// 获取一级分类
		async get_menu() {
			const res = await this.$request.get2('/api/classify/list', {
				parentId: 4
			});
			console.log('一级分类列表', res);
			if (res.code == 200) {
				this.tabs = res.data;
			}
		},
		// 获取二级分类
		async secoen_level() {
			const list = await this.$request.get2('/api/classify/list', {
				parentId: this.tabs[this.tabs_index].id,
				pageSize: 30
			});
			console.log('二级分类列表', list);
			if (list.code == 200) {
				this.video_tabs = list.data;
			}
		},
		// 获取视频列表
		async get_list(toBottom = false) {
			this.loading = 'loading';
			if (toBottom) {
				this.page++;
			}
			const video_tabs = this.video_tabs; // 视频类菜单列表
			const video_tabs_index = this.video_tabs_index; // 视频类菜单下标
			const res = await this.$request.get2('/api/courseInfo/list', {
				pageSize: this.size,
				pageNo: this.page,
				courseClassify: video_tabs[video_tabs_index].id
			});
			console.log('视频列表', res);
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
		// 获取图文列表
		async get_img_list(toBottom = false) {
			this.loading = 'loading';
			if (toBottom) {
				this.page++;
			}
			const res = await this.$request.get2('/api/graphic/list', {
				pageSize: this.size,
				pageNo: this.page,
				classify: 13 // 加油站图文类:13, 活动馆活动:17
			});

			console.log('图文列表', res);
			if (res.code == 200) {
				this.count = res.data.count;
				if (toBottom) {
					this.img_list = [...this.list, ...res.data.lists];
				} else {
					this.img_list = res.data.lists;
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
				name: '加油站'
			});
			console.log('轮播', res);
			if (res.code == 200) {
				this.banner_list = res.data.lists[0].images;
			}
		},
		// 触底
		tolower() {
			const tabs_index = this.tabs_index;
			if (tabs_index == 0 || tabs_index == 1) {
				if (this.count >= this.list.length) return;
				this.get_list(true);
			} else {
				if (this.count >= this.img_list.length) return;
				this.get_img_list(true);
			}
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
.cheer {
	.swiper {
		padding: 30rpx;
	}
	.content {
		padding-bottom: 40rpx;
		.video {
			.head {
				.item {
					display: flex;
					align-items: center;
					.iconfont {
						padding-right: 10rpx;
					}
				}
				.active {
					color: #0a2b4e;
				}
			}

			.list {
				padding: 20rpx 30rpx 0;
				display: flex;
				flex-wrap: wrap;
				.item {
					width: 330rpx;
					padding: 20rpx;
					background: #fff;
					border-radius: 12rpx;
					margin-top: 30rpx;
					.cover_box {
						position: relative;
						border-radius: 12rpx;
						overflow: hidden;
						.cover {
							max-height: 220rpx;
						}
						.shadow_box {
							position: absolute;
							bottom: 8rpx;
							right: 4rpx;
							padding: 6rpx 20rpx;
							color: #fff;
							font-size: 12px;
							border-radius: 50rpx;
							background: rgba(0, 0, 0, 0.8);
							transform: rotate(180deg) scale(-0.8);
						}
					}
					.name {
						margin-top: 20rpx;
						font-size: 24rpx;
						color: #000;
						line-height: 36rpx;
						.iconfont {
							color: #c9c9c9;
							padding-right: 10rpx;
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
				.empty {
					width: 100%;
					display: flex;
					justify-content: center;
				}
			}
		}

		.img_content {
			padding: 20rpx 30rpx 0;
			.img_item {
				background: #fff;
				border-radius: 12rpx;
				padding: 12rpx;
				margin-top: 20rpx;
				.cover_box {
					overflow: hidden;
					border-radius: 12rpx;
					.cover {
						max-height: 275rpx;
					}
				}

				.title {
					margin: 20rpx 0 10rpx;
					font-size: 24rpx;
					color: #000;
					line-height: 36rpx;
				}

				.time {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					color: #c9c9c9;
					margin-bottom: 10rpx;
					.text {
						padding-left: 10rpx;
					}
				}
			}

			.empty {
				width: 100%;
				display: flex;
				justify-content: center;
			}

			.img_item:nth-child(1) {
				margin-top: 20rpx;
			}
			.img_item:nth-child(2) {
				margin-top: 20rpx;
			}
		}
	}
}
</style>
