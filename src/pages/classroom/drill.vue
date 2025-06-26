<!-- 训练营 -->
<template>
	<view class="drill">
		<u-transition :show="true" mode="fade-up">
			<view class="list">
				<u-list @scrolltolower="scrolltolower">
					<view class="item box-shadow" v-for="(item, index) in list" :key="index" @click="open_video_details(item.courseId)">
						<view class="cover_box">
							<image class="cover" :src="item.courseImage" mode="widthFix"></image>
						</view>
						<view class="title">
							{{ item.courseName }}
						</view>
						<view class="time">
							<i class="iconfont icon-shijian"></i>
							<text class="text">{{ item.updateTime | secondsFormat}}</text>
						</view>
					</view>
					<u-loadmore :status="status" v-if="page < total" />
				</u-list>
			</view>
			<view class="empty" v-if="empty_show">
				<u-empty text="资源未上线" :icon="empty"></u-empty>
			</view>
		</u-transition>
	</view>
</template>

<script>
import { secondsFormat } from '@/utils/regular.js';
export default {
	data() {
		return {
			empty: '/static/img/empty/data.png',
			empty_show: false,
			page: 1, // 页数
			total: 1, // 总页数
			status: 'loadmore', // 加载前值为loadmore，加载中为loading，没有数据为nomore
			list: []
		};
	},
	filters: {
		secondsFormat
	},
	created() {
		this.get_list();
	},
	methods: {
		scrolltolower() {
			if (this.page < this.total) {
				this.page = this.page++;
				this.get_list(true);
			} else {
				this.status = 'nomore';
			}
		},
		open_video_details(id) {
			uni.navigateTo({
				url: `/pages/course/knowledge/video_details?id=${id}`
			});
		},
		async get_list(reachBottom = false) {
			if (reachBottom) {
				this.status = 'loading';
			}
			const page = this.page;
			const res = await this.$request.get2('/api/courseInfo/list', {
				courseClassify: 5,
				pageNo: page
			});
			console.log('训练营列表', res);
			if (res.code == 200) {
				const total = Math.ceil(res.data.count / res.data.pageSize);
				this.list = [...this.list, ...res.data.lists];
				this.total = total;
				if (reachBottom) {
					this.status = 'loadmore';
				}
				if (this.list.length == 0) {
					this.empty_show = true;
				}
			}
		}
	}
};
</script>

<style lang="less" scoped>
.drill {
	padding: 30rpx;
}
.list {
	.item {
		background: #fff;
		border-radius: 12rpx;
		padding: 12rpx;
		margin-bottom: 20rpx;
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
}
</style>
