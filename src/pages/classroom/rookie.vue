<!-- 新秀班 -->
<template>
	<view class="rookie">
		<view class="banner">
			<image class="cover" :src="banner" mode="widthFix"></image>
			<view class="btn_box">
				<u-button class="btn" throttleTime="300">
					<image class="cover" :src="btn" mode="widthFix" @click="open_details"></image>
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			banner: 'https://jsym.kinsyomacz.com/resource/img/course/knowledge/rookie/banner.png',
			btn: 'https://jsym.kinsyomacz.com/resource/img/course/knowledge/rookie/btn.png'
		};
	},
	methods: {
		open_details() {
			uni.navigateTo({
				url: '/pages/course/knowledge/rookie_details'
			});
		}
	}
};
</script>

<style lang="less" scoped>
.rookie {
	.banner {
		padding: 30rpx;
		position: relative;
		.cover {
			width: 100%;
		}
		.btn_box {
			position: absolute;
			bottom: 100rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 270rpx;
			height: 100rpx;
			/deep/ button {
				background: none !important;
				border: 0 !important;
				box-shadow: none !important;
				&::after {
					display: none;
					background: none;
				}
				&::before {
					display: none;
					background: none;
				}
			}
			.cover {
				width: 100%;
				height: auto;
			}
		}
	}
}
</style>
