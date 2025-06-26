<!-- 学院集 -->
<template>
	<view class="college">
		<!-- 视频 -->
		<view class="video_box">
			<video :src="video_src" autoplay loop controls object-fit="cover" show-mute-btn play-btn-position="center" enable-play-gesture :custom-cache="false"></video>
			<cover-view class="icon_box" @click="open_videoMark">
				<cover-image class="icon" :src="video_icon_share" mode="widthFix"></cover-image>
			</cover-view>
		</view>
		<!-- 照片集 -->
		<view class="picture" @click="open_img_list">
			<image class="img" :src="photo" mode="widthFix"></image>
		</view>
		<!-- 线下培训 -->
		<view class="list_box">
			<view class="head">
				<u-divider text="线下培训" textSize="18" textColor="#000" lineColor="#BBBBBB"></u-divider>
			</view>
			<swiper class="swiper_video" autoplay display-multiple-items="2" next-margin="15px" snap-to-edge v-if="video_list.length > 0">
				<block v-for="(item, index) in video_list" :key="index">
					<swiper-item>
						<view class="swiper-item box-shadow" @click="open_details(item.courseId)">
							<image class="cover" :src="item.courseImage" mode="widthFix"></image>
							<view class="video_bottom">
								<view class="box">
									<i class="iconfont icon-shipin"></i>
									<text class="text">课程视频</text>
								</view>
								<i class="iconfont icon-vertical_line"></i>
								<view class="box">
									<i class="iconfont icon-kejian-tianchong"></i>
									<text class="text">培训课件</text>
								</view>
							</view>
						</view>
					</swiper-item>
				</block>
			</swiper>
			<view class="empty" v-if="empty_show">
				<u-empty text="资源未上线" :icon="empty"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			empty: '/static/img/empty/data.png',
			empty_show: false,
			video_src: '', // 视频号
			knowledge_video_id: '', // 视频号id
			// 视频号按钮
			video_icon_share: 'https://jsym.kinsyomacz.com/resource/img/course/knowledge/index/video_btn.png',
			// 照片集图片
			photo: 'https://jsym.kinsyomacz.com/resource/img/course/knowledge/index/picture.png',
			// 视频列表
			video_list: []
		};
	},
	created() {
		this.get_video();
		this.get_data();
	},
	methods: {
		// 获取视频
		get_video() {
			const { knowledge_vieo, knowledge_video_id } = getApp().globalData;
			this.video_src = knowledge_vieo;
			this.knowledge_video_id = knowledge_video_id;
		},
		// 跳转照片集
		open_img_list() {
			uni.navigateTo({
				url: '/pages/course/knowledge/img_list'
			});
		},
		// 打开视频号主页
		open_videoMark() {
			wx.openChannelsUserProfile({
				finderUserName: this.knowledge_video_id
			});
		},
		// 获取数据
		async get_data() {
			const res = await this.$request.get2('/api/courseInfo/list', {
				courseClassify: 6,
				pageSize: 50
			});
			console.log('学院集', res);
			this.video_list = res.data.lists;
			if (res.code == 200 && this.video_list == 0) {
				this.empty_show = true;
			}
		},
		// 跳转课程详情
		open_details(courseId) {
			uni.navigateTo({
				url: `/pages/course/knowledge/video_details?id=${courseId}`
			});
		}
	}
};
</script>

<style lang="less" scoped>
.video_box {
	padding: 20rpx 30rpx;
	background: #fff;
	position: relative;
	video {
		width: 100%;
		border-radius: 12rpx;
	}
	.icon_box {
		position: absolute;
		top: 50rpx;
		right: 50rpx;
		z-index: 1;
		.icon {
			width: 80px;
			height: auto;
		}
	}
}
.picture {
	background: #fff;
	padding: 0 30rpx;
	.img {
		width: 100%;
		height: auto;
	}
}

.list_box {
	padding: 30rpx 30rpx;
	.head {
		font-size: 36rpx;
		font-weight: 600;
		color: #000000;
		text-align: center;
		overflow: hidden;
	}
	.swiper_video {
		height: 320rpx;
		padding-top: 20rpx;
		padding-bottom: 50rpx;
		.swiper-item {
			background: #fff;
			padding: 10rpx;
			margin-right: 20rpx;
			border-radius: 12rpx;
			.cover {
				width: 100%;
				height: 220rpx !important;
				background: #f5f5f5;
			}
			.video_bottom {
				padding-top: 14rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.box {
					display: flex;
					align-items: center;
					.iconfont {
						font-size: 28rpx;
						color: #0a2b4e;
					}
					.text {
						font-size: 24rpx;
						color: #000;
						padding-left: 6rpx;
					}
				}

				.icon-vertical_line {
					font-size: 24rpx;
					color: #b5b5b5;
				}
			}
		}
	}
}
</style>
