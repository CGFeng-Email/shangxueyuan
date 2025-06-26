<!-- 知识馆 -->
<template>
	<view class="container">
		<!-- 吸顶 -->
		<u-sticky class="sticky" bgColor="#fff" offsetTop="0">
			<!-- 搜索 -->
			<view class="search_box" @click="open_search">
				<u-search
					placeholder="请输入您需要的课程，如：品牌介绍"
					:disabled="true"
					clearabled
					height="32"
					bgColor="#F5F5F5"
					placeholderColor="#AFAFAF"
					shape="square"
					:actionStyle="actionStyle"
					actionText="找课"
					@custom="search_btn"
				></u-search>
			</view>
			<!-- 导航栏 -->
			<view class="tabs_head">
				<u-tabs
					class="tabs"
					:list="list"
					@click="click_tans"
					:current="tabs_index"
					lineColor="#0A2B4E"
					:activeStyle="activeStyle"
					:inactiveStyle="inactiveStyle"
					itemStyle="padding: 0 15px; height: 40px;background: #fff;"
				>
					<template v-for="(item, index) in list" slot="lable{{index}}">
						<view class="item">
							<i class="iconfont icon-yizan" :class="tabs_index == 0 ? 'active' : ''" v-if="index == 0"></i>
							{{ item.name }}
						</view>
					</template>
				</u-tabs>
			</view>
		</u-sticky>
		<!-- tabs栏切换 -->
		<view class="tabs_content">
			<!-- 学院集 -->
			<COLLEGE v-if="tabs_index == 0"></COLLEGE>
			<ROOKIE v-else-if="tabs_index == 1"></ROOKIE>
			<PUBLIC ref="public" v-else-if="tabs_index == 2"></PUBLIC>
			<CHEER ref="cheer" v-else-if="tabs_index == 3"></CHEER>
			<DRILL ref="drill" v-else-if="tabs_index == 4"></DRILL>
			<ME v-else-if="tabs_index == 5" ref="me_ref"></ME>
		</view>
	</view>
</template>

<script>
import COLLEGE from './college.vue'; // 学院集
import ROOKIE from './rookie.vue'; // 新秀班
import PUBLIC from './public.vue'; // 公开课
import CHEER from './cheer.vue'; // 加油站
import DRILL from './drill.vue'; // 训练营
import ME from './me.vue'; // 个人中心
export default {
	components: {
		COLLEGE,
		ROOKIE,
		PUBLIC,
		CHEER,
		DRILL,
		ME
	},
	data() {
		return {
			list: [
				{
					name: '学院集'
				},
				{
					name: '新秀班'
				},
				{
					name: '公开课'
				},
				{
					name: '加油站'
				},
				{
					name: '训练营'
				},
				{
					name: '个人集'
				}
			],
			tabs_index: 0,
			// 选中的样式
			activeStyle: {
				color: '#0A2B4E',
				fontSize: '24rpx',
				fontWeight: 600,
				transform: 'scale(1.05)'
			},
			// 未选中的样式
			inactiveStyle: {
				color: '#000',
				fontSize: '24rpx',
				transform: 'scale(1)'
			},
			// 搜索右侧样式
			actionStyle: {
				background: '#0a2b4e',
				color: '#fff',
				fontSize: '14px',
				height: '32px',
				paddingLeft: '26rpx',
				paddingRight: '26rpx',
				borderRadius: '4px',
				lineHeight: '32px'
			}
		};
	},
	onLoad() {
		this.record_number_days();
		this.record_duration();
	},
	onShow() {
		if (this.tabs_index == 5) {
			this.$refs.me_ref.get_me();
		}
	},
	methods: {
		// 导航栏切换
		click_tans(item) {
			this.tabs_index = item.index;
		},
		// 跳转搜索页
		open_search() {
			uni.navigateTo({
				url: '/pages/course/search'
			});
		},
		// 搜索右侧控件
		search_btn() {
			uni.navigateTo({
				url: '/pages/course/search'
			});
		},
		// 跳转照片集
		open_img_list() {
			uni.navigateTo({
				url: '/pages/course/knowledge/img_list'
			});
		},
		// 记录登录天数
		async record_number_days() {
			const res = await this.$request.post2('/api/records/add');
			console.log('记录登录天数', res);
		},
		// 记录登录时长
		async record_duration() {
			// 只记录一次，有记录时，不可以覆盖初始时长
			const start_duration = uni.getStorageSync('start_duration');
			const start_duration_id = uni.getStorageSync('start_duration_id');
			// 没有记录
			if (!start_duration_id && !start_duration) {
				const res = await this.$request.post2('/api/time/add', {
					duration: 0
				});
				if (res.code == 200) {
					console.log('记录登录时长', res);
					// 记录开始时间戳
					const date = new Date().getTime();
					uni.setStorageSync('start_duration', date);
					uni.setStorageSync('start_duration_id', res.data);
				}
			}
		},
		// 滚动到底部
		onReachBottom() {
			if (this.tabs_index == 2) {
				this.$refs.public.tolower();
			} else if (this.tabs_index == 3) {
				this.$refs.cheer.tolower();
			}
		}
	}
};
</script>

<style>
page {
	background: #f8f8f8;
}

.u-sticky {
	box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
}
</style>

<style lang="less" scoped>
.sticky {
	box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);
}

.search_box {
	padding: 20rpx 15px 0;
	background: #fff;
}

.tabs_head {
	.item {
		display: flex;
		align-items: center;
		.iconfont {
			padding-right: 6rpx;
			color: #000;
		}
		.active {
			color: #0a2b4e;
		}
	}
}

.video_box {
	padding: 20rpx 30rpx;
	background: #fff;
	#myVideo {
		width: 100%;
		border-radius: 12rpx;
	}
}

.picture {
	background: #fff;
	padding: 0 30rpx;
	.img {
		width: 100%;
	}
}

.list_box {
	padding: 70rpx 30rpx 30rpx;

	.head {
		font-size: 36rpx;
		font-weight: 600;
		color: #000000;
		position: relative;
		text-align: center;
		overflow: hidden;
	}

	.swiper_video {
		padding-top: 40rpx;
		padding-bottom: 50rpx;
		.swiper-item {
			background: #fff;
			padding: 10rpx;
			margin-right: 20rpx;
			border-radius: 12rpx;
			overflow: hidden;
			.cover {
				width: 100%;
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
