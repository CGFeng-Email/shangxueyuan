<!-- 活动馆详情 -->
<template>
	<view class="details">
		<u-transition :show="true" mode="fade">
			<view class="title">2023国庆厂购节</view>
			<view class="function">
				<view class="see box">
					<i class="iconfont icon-kanguos"></i>
					<text class="text">42</text>
				</view>
				<view class="support box">
					<i class="iconfont icon-dianzan6"></i>
					<text class="text">36</text>
				</view>
				<view class="time box">
					<i class="iconfont icon-shijian"></i>
					<text class="text">2023-08-24 16:00</text>
				</view>
			</view>
			<view class="cover_box">
				<image
					class="cover"
					src="https://quanyi-1317202885.cos.ap-guangzhou.myqcloud.com/jinsiyuma/%E4%BA%91%E8%AF%BE%E5%A0%82/cheer/img_list1.png"
					mode="widthFix"
				></image>
			</view>
			<view class="content">
				<view class="lead">温馨提示：由于文件过大，请登录微信电脑版后，打开小程序，点击链接下载内容！</view>
				<view class="lead">温馨提示：由于文件过大，请登录微信电脑版后，打开小程序，点击链接下载内容！</view>
				<view class="link_box">
					<view class="title">服务器后台下载链接：</view>
					<view class="link">
						<i class="iconfont icon-lianjie"></i>
						<text class="text">https://quanyi-1317202885.cos.ap-guangzhou.myqcloud.com/jinsiyuma/%E4%BA%91%E8%AF%BE%E5%A0%82/cheer/img_list1.png</text>
					</view>
				</view>
				<view class="link_box">
					<view class="title">服务器后台下载链接：</view>
					<view class="link">
						<i class="iconfont icon-lianjie"></i>
						<text class="text">https://quanyi-1317202885.cos.ap-guangzhou.myqcloud.com/jinsiyuma/%E4%BA%91%E8%AF%BE%E5%A0%82/cheer/img_list1.png</text>
					</view>
				</view>
				<view class="lead">温馨提示：由于文件过大，请登录微信电脑版后，打开小程序，点击链接下载内容！</view>
			</view>
			<view class="support_content">
				<view class="box">
					<i class="iconfont icon-dianzan6"></i>
				</view>
				<view class="name">点个赞吧~</view>
			</view>
		</u-transition>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	}
};
</script>

<style lang="less" scoped>
.details {
	padding: 30rpx;
	.title {
		font-size: 36rpx;
		line-height: 46rpx;
		color: #000;
		font-weight: 600;
	}

	.function {
		display: flex;
		align-items: center;
		.box {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #828282;
			padding: 20rpx 20rpx 20rpx 0;
			.iconfont {
				font-size: 28rpx;
				color: #828282;
			}
			.text {
				padding-left: 6rpx;
			}
		}
	}

	.cover_box {
		margin-bottom: 20rpx;
		.cover {
			border-radius: 12rpx;
			overflow: hidden;
		}
	}

	.content {
		.lead {
			font-size: 24rpx;
			line-height: 36rpx;
			color: #000;
			margin-bottom: 20rpx;
		}
		.link_box {
			margin-bottom: 20rpx;
			.title {
				font-size: 24rpx;
				line-height: 36rpx;
				color: #000;
			}
			.link {
				font-size: 24rpx;
				line-height: 36rpx;
				color: #608dbf;
				.iconfont {
					display: inline-block;
				}
				.text {
					padding-left: 6rpx;
					white-space: break-spaces;
					word-wrap: break-word;
					word-break: break-all;
				}
			}
		}
	}

	.support_content {
		padding: 30rpx 0;
		text-align: center;
		.box {
			display: inline-block;
			width: 70rpx;
			height: 70rpx;
			border: 1px solid #e3e3e3;
			text-align: center;
			line-height: 70rpx;
			border-radius: 50%;
		}
		.name {
			padding: 14rpx 0;
			font-size: 24rpx;
			color: #000;
		}
	}
}
</style>
