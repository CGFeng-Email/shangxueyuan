<template>
	<view class="container">
		<swiper class="swiper" autoplay skip-hidden-item-layout>
			<swiper-item v-for="item in bannerList" :key="item.id">
				<view class="swiper-item item">
					<image :src="item.thumb" mode="scaleToFill"></image>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>


<script>
export default {
	data() {
		return {
			bannerList: []
		}
	},
	onLoad() {
		this.banner();
	},
	methods: {
		async banner() {
			const res = await this.$request.post('/ad/getList');
			console.log('res', res);
			this.bannerList = res.data.lists;
		}
	}
}
</script>

<style lang="less" scoped>
.swiper {
	width: 100%;
	height: 100vh;
	.item {
		image {
			width: 100%;
			height: 100vh;
		}
	}
}
</style>
