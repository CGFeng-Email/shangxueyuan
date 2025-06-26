<!-- 照片集详情列表 -->
<template>
	<view class="container">
		<u-transition :show="true" mode="fade-up" duration="600">
			<view class="list">
				<block v-for="(item, index) in list" :key="index">
					<image class="cover" :src="item" mode="widthFix" @click="open_prev(index)"></image>
				</block>
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
	onLoad(e) {
		this.get_list(e.id);
	},
	methods: {
		async get_list(id) {
			const res = await this.$request.get2('/api/photos/detail', {
				id,
				pageSize: 60
			});
			console.log('列表', res);
			this.list = res.data.images;
		},
		open_prev(index) {
			uni.previewImage({
				current: index,
				urls: this.list,
				indicator: 'default',
				loop: true
			});
		}
	}
};
</script>

<style scoped lang="less">
.list {
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx;
	.cover {
		width: 100%;
		margin-bottom: 20rpx;
	}
}
</style>