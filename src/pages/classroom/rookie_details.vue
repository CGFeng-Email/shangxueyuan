<!-- 新秀班详情 -->
<template>
	<view class="rookie_details">
		<FIXEDNAVBAR :placeholder="false" :navbar_title="navbar_title" :transparent="true"></FIXEDNAVBAR>
		<u-transition :show="true" mode="fade">
			<view class="bg">
				<image class="cover" :src="bg" mode="scaleToFill"></image>
			</view>
			<view class="list">
				<view :class="['li', os == 'h5' ? 'li' + (index + 1) : 'pc_li' + (index + 1)]" v-for="(item, index) in list" :key="index" @click="open_video_details(item, index)">
					<image class="cover" :src="item.completed == 0 ? btn_status : btn_status_active" mode="widthFix"></image>
					<view class="serial_number" v-if="index == 0">第一关</view>
					<view class="serial_number" v-else-if="index == 1">第二关</view>
					<view class="serial_number" v-else-if="index == 2">第三关</view>
					<view class="serial_number" v-else-if="index == 3">第四关</view>
					<view class="serial_number" v-else>第五关</view>
					<view class="name">
						{{ item.name }}
					</view>
				</view>
			</view>
		</u-transition>
	</view>
</template>

<script>
import FIXEDNAVBAR from '../../../components/fixed_navbar.vue';
export default {
	components: { FIXEDNAVBAR },
	data() {
		return {
			os: 'h5', // h5:手机, pc:电脑
			navbar_title: '新秀班',
			bg: 'https://jsym.kinsyomacz.com/resource/img/course/knowledge/rookie/details.jpg',
			btn_status: 'https://jsym.kinsyomacz.com/resource/img/status1.png',
			btn_status_active: 'https://jsym.kinsyomacz.com/resource/img/status2.png',
			list: []
		};
	},
	async onShow() {
		await this.get_system();
		await this.get_list();
	},
	methods: {
		// 获取系统信息
		get_system() {
			uni.getSystemInfo({
				success: (res) => {
					console.log('系统信息', res);
					if (res.osName == 'ios' || res.osName == 'android') {
						this.os = 'h5';
					} else if (res.osName == 'windows' || res.osName == 'macos') {
						this.os = 'pc';
					}
				}
			});
		},
		// 获取知识闯关列表
		async get_list() {
			const res = await this.$request.get2('/api/progress/challenge');
			this.list = res.data;
			// completed: 0, 未完成, 1:已完成
			// isLock: 进度 0:可以点, 1:不可以点
			console.log('获取知识闯关列表', res);
		},
		// 打开视频详情
		open_video_details(item, index) {
			if (item.isLock == 0) {
				uni.navigateTo({
					url: `/pages/course/knowledge/video_details?id=${item.courseInfoId}&type=1`
				});
			} else {
				uni.showToast({
					title: `请先完成前面关卡的任务`,
					icon: 'none',
					mask: true,
					duration: 2000
				});
			}
		}
	}
};
</script>

<style lang="less" scoped>
.cover {
	height: auto;
}
.rookie_details {
	width: 100%;
	height: 100vh;
	.bg {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
		.cover {
			width: 100%;
			height: 100%;
		}
	}

	.list {
		width: 100%;
		height: 100vh;
		position: relative;
		.li {
			position: absolute;
			.cover {
				width: 220rpx;
			}

			.serial_number {
				color: #fff;
				font-size: 12px;
				position: absolute;
				top: 0;
				left: 50%;
				transform: translateX(-50%) rotate(180deg) scale(-0.7);
			}

			.name {
				font-size: 12px;
				color: #fff;
				font-weight: 500;
				position: absolute;
				top: 26rpx;
				left: 50%;
				transform: translateX(-50%) rotate(180deg) scale(-0.8);
				white-space: nowrap;
				letter-spacing: 1px;
			}
		}

		.li1 {
			top: 682rpx;
			left: 40rpx;
		}
		.li2 {
			top: 747rpx;
			left: 290rpx;
		}
		.li3 {
			top: 1020rpx;
			left: 342rpx;
		}
		.li4 {
			top: 1332rpx;
			left: 40rpx;
		}
		.li5 {
			top: 1444rpx;
			left: 330rpx;
		}
		
		.pc_li1 {
			top: 545rpx;
			left: 40rpx;
		}
		.pc_li2 {
			top: 600rpx;
			left: 290rpx;
		}
		.pc_li3 {
			top: 800rpx;
			left: 342rpx;
		}
		.pc_li4 {
			top: 1058rpx;
			left: 40rpx;
		}
		.pc_li5 {
			top: 1130rpx;
			left: 330rpx;
		}
	}
}
</style>
