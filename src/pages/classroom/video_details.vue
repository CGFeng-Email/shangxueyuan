<template>
	<view class="container">
		<view class="main" v-if="list.length > 0">
			<u-sticky>
				<view class="video_box">
					<video
						id="myVideo"
						:src="video_src"
						:title="video_title"
						:controls="video_controls"
						:enable-progress-gesture="video_controls"
						object-fit="cover"
						show-mute-btn
						play-btn-position="center"
						enable-play-gesture
						:picture-in-picture-show-progress="true"
						:enable-auto-rotation="true"
						:show-screen-lock-button="true"
						:show-snapshot-button="true"
						:show-background-playback-button="true"
						:custom-cache="false"
						@play="play"
						@pause="pause"
						@error="error"
						@ended="ended"
						@loadedmetadata="loadedmetadata"
						@timeupdate="video_timeupdate"
					></video>
					<!-- 正在加载 -->
					<view class="loading" v-if="loading">
						<!-- 收费支付按钮 -->
						<view class="content" v-if="payment_loading">
							<view class="title">请先购买课程，再继续观看</view>
							<!-- 购买课程 -->
							<view class="buy_content" v-if="isPay == 1 && isPayStatus == 0">
								<u-button
									icon="rmb-circle-fill"
									shape="circle"
									:text="price | PriceZero"
									throttleTime="1000"
									color="#0A2B4E"
									iconColor="#fff"
									@click="buy"
								></u-button>
							</view>
						</view>
						<!-- 倒计时提示加载页面 -->
						<view class="times_content" v-else>
							<template v-if="times_loading">
								<u-loadmore :status="status" />
								<view class="count_down">
									<text class="text">即将播放：{{ count_down }}</text>
									<i class="iconfont icon-right-1-copy"></i>
								</view>
							</template>
							<view class="hint" v-else>
								<view class="title">播放已结束</view>
								<u-button text="重新播放" shape="circle" throttleTime="1000" color="#333" iconColor="#fff" @click="anew_play"></u-button>
							</view>
						</view>
					</view>
					<!-- 知识闯关不可以拖动进度 -->
					<cover-view scroll-top="0" class="video_shadow" v-if="!video_controls" @click="is_play">
						<cover-image class="play_icon" scroll-top="0" src="../../../static/img/play.png" v-if="video_play"></cover-image>
					</cover-view>
				</view>
				<view class="tabs border-radius">
					<u-tabs
						:list="tabs"
						@click="click_tabs"
						:current="tabs_index"
						lineColor="#0a2b4e"
						:activeStyle="activeStyle"
						:inactiveStyle="inactiveStyle"
						itemStyle="padding: 0 15px; height: 40px;background: #fff;"
					></u-tabs>
				</view>
			</u-sticky>
			<view class="content">
				<!-- 课程详情 -->
				<view class="tabs1" v-if="tabs_index == 0">
					<view class="title">{{ title }}</view>
					<view class="statuc">
						<view class="time">
							<i class="iconfont icon-kanguos"></i>
							<text class="text">{{ see }}人观看</text>
							<i class="iconfont icon-dian"></i>
							<text class="text">共{{ total_num }}门课程</text>
						</view>
						<!-- 收藏 -->
						<view class="collect_content">
							<u-button
								icon="heart-fill"
								text="收藏"
								throttleTime="700"
								:color="is_collect ? '#0A2B4E' : '#B9B9B9'"
								:iconColor="is_collect == 1 ? '#ff0000' : '#fff'"
								@click="click_collect"
							></u-button>
						</view>
					</view>
					<!-- 简介，描述 -->
					<view class="desc" v-if="desc">
						{{ desc }}
					</view>
					<!-- 购买课程 -->
					<view class="buy_content" v-if="isPay == 1 && isPayStatus == 0">
						<u-button icon="rmb-circle-fill" :text="price | PriceZero" throttleTime="1000" color="#0A2B4E" iconColor="#fff" @click="buy"></u-button>
					</view>
					<!-- 选集 -->
					<view class="select_content" v-if="catalogue">
						<view class="head">
							<i class="iconfont icon-shuxian1"></i>
							<view class="text">
								选集
								<text v-if="total_num > 0">（01/{{ total_num | padStartfn }}）</text>
							</view>
						</view>
						<!-- 选集列表 -->
						<view class="select_tabs">
							<u-tabs
								:list="list"
								:current="select_list_index"
								@click="list_tabs_click"
								lineWidth="30"
								lineColor="#0A2B4E"
								:activeStyle="{
									color: '#fff',
									fontWeight: 'bold',
									background: '#0A2B4E',
									height: '88rpx',
									lineHeight: '88rpx',
									textAlign: 'center',
									borderRadius: '12rpx',
									overflow: 'hidden',
									padding: '0 20rpx'
								}"
								:inactiveStyle="{
									color: '#676767',
									background: '#E8E8E8',
									height: '88rpx',
									lineHeight: '88rpx',
									textAlign: 'center',
									borderRadius: '12rpx',
									overflow: 'hidden',
									padding: '0 20rpx'
								}"
								:itemStyle="{
									padding: '0 20rpx',
									height: '88rpx'
								}"
							></u-tabs>
						</view>
					</view>
					<!-- 集数列表 -->
					<view class="video_list">
						<view class="head">
							<i class="iconfont icon-shuxian1"></i>
							<text class="text">课程章节</text>
						</view>
						<view class="list" v-if="catalogue">
							<block v-for="(item, index) in list[select_list_index].children" :key="index">
								<u-transition :show="true" mode="fade-up" duration="800">
									<view
										:class="['item_li', item.islock == 1 ? 'disabled' : '', item.serial_number == play_index ? 'active' : '']"
										@click="item_video_play(item, index, select_list_index)"
									>
										<view class="serial">{{ item.serial_number }}</view>
										<view class="item_center">
											<view class="item_title over2">{{ item.name }}</view>
											<view class="item_btn" v-if="item.courseWare" @click.stop="open_download(item.courseWare)">下载课件</view>
										</view>
										<!-- 上锁 -->
										<view class="lock" v-if="item.islock == 1">
											<i class="iconfont icon-24gf-lock"></i>
										</view>
									</view>
								</u-transition>
							</block>
						</view>
						<view class="list" v-else>
							<block v-for="(item, index) in list" :key="index">
								<u-transition :show="true" mode="fade-up" duration="800">
									<view
										:class="['item_li', item.islock == 1 ? 'disabled' : '', item.serial_number == play_index ? 'active' : '']"
										@click="item_video_play(item, index, select_list_index)"
									>
										<view class="serial">{{ item.serial_number }}</view>
										<view class="item_center">
											<view class="item_title over2">{{ item.name }}</view>
											<view class="item_btn" v-if="item.courseWare" @click.stop="open_download(item.id)">下载课件</view>
										</view>
										<!-- 上锁 -->
										<view class="lock" v-if="item.islock == 1">
											<i class="iconfont icon-24gf-lock"></i>
										</view>
									</view>
								</u-transition>
							</block>
						</view>
					</view>
				</view>
				<!-- 评论 -->
				<view class="comment animate_fade" v-else-if="tabs_index == 1">
					<view class="head">
						<i class="iconfont icon-shuxian1"></i>
						<text class="text">课程评论</text>
					</view>
					<view class="comment_list" v-if="comment_list.length > 0">
						<view class="comment_item" v-for="(item, index) in comment_list" :key="index">
							<view class="head">
								<view class="left">
									<image class="head_portrait" :src="item.userNameAvatar" mode="widthFix"></image>
									<view class="name">{{ item.userName }}</view>
									<!-- <u-rate :count="star_count" v-model="star" :readonly="true" size="14" gutter="2" active-color="#feaa02" inactive-color="#b2b2b2"></u-rate> -->
								</view>
								<view class="time">{{ item.createdTime | dateFormat }}</view>
							</view>
							<view class="desc">
								{{ item.text }}
							</view>
							<view class="function">
								<view class="top_status">
									<view class="box" @click="down_collect(item, index)">
										<i class="iconfont icon-daipingjia"></i>
										<text class="text">{{ item.childrenNum }}</text>
									</view>
									<view class="box" @click="is_like(item)">
										<i class="iconfont icon-dianzan6" v-if="item.isComment == 0"></i>
										<i class="iconfont icon-yizan" v-else></i>
										<text class="text">{{ item.likeCount }}</text>
									</view>
								</view>
								<!-- 评论展开 -->
								<u-transition :show="he_comment_index == index" mode="fade">
									<!-- 展开的评论列表 -->
									<view class="down_comment_list">
										<view class="down_comment_list_item" v-for="(item2, index2) in down_comment_list_item" :key="index2">
											<view class="head">
												<view class="left">
													<image class="head_portrait" :src="item2.userNameAvatar" mode="widthFix"></image>
													<view class="name">{{ item2.userName }}</view>
													<!-- <u-rate :count="star_count" v-model="star" :readonly="true" size="14" gutter="2" active-color="#feaa02" inactive-color="#b2b2b2"></u-rate> -->
												</view>
												<view class="time">{{ item2.createdTime | dateFormat }}</view>
											</view>
											<view class="desc">
												回复
												<text class="text">{{ item2.replyUserName }}</text>
												: {{ item2.text }}
											</view>
										</view>
									</view>
									<!-- 评论输入 -->
									<view class="down_collect">
										<u--input
											class="input"
											v-model="he_comment_value"
											placeholderStyle="{fontSize: 12px;}"
											fontSize="12"
											placeholder="说点儿什么吧~"
											@change="he_comment_input_change"
										></u--input>
										<u-button class="btn" text="发送" throttleTime="1000" color="#0a2b4e" @click="he_comment_submit(item)"></u-button>
									</view>
								</u-transition>
							</view>
						</view>
					</view>

					<view class="comment_empty" v-else>
						<image class="cover" :src="comment_empty" mode="widthFix"></image>
						<view class="text">暂无评论，快来成为第一个评论的人吧！</view>
					</view>

					<view class="comment_bottom" v-if="he_comment_index == -1">
						<!-- <view class="star">
							<view class="text">好评推荐：</view>
							<u-rate gutter="2" v-model="comment_star" :minCount="1" @change="comment_star_change"></u-rate>
						</view> -->
						<view class="btn_box">
							<u--input
								class="input"
								v-model="comment_value"
								placeholderStyle="{fontSize: 12px;}"
								fontSize="12"
								placeholder="说点儿什么吧~"
								@change="comment_input_change"
							></u--input>
							<u-button class="btn" text="发送" throttleTime="1000" color="#0a2b4e" @click="comment_submit"></u-button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 没有查询到 -->
		<view class="not_find" v-if="empty">
			<view class="name">未找到课程资源</view>
			<view class="desc">请尝试观看其他课程</view>
			<view class="bottom">
				<button class="btn" open-type="contact" send-message-title="金丝玉玛" show-message-card>
					<i class="iconfont icon-zaixiankefucustomerservice"></i>
					<text class="text">在线客服</text>
				</button>
				<view class="btn" @click="click_dial">
					<i class="iconfont icon-24gl-phoneLoudspeaker"></i>
					<text class="text">电话客服</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
let videoContext;
import EMPTY from '@/components/empty.vue';
import { padStartfn, PriceZero, dateFormat } from '../../../utils/regular.js';
export default {
	components: {
		EMPTY
	},
	data() {
		return {
			loading: false, // 加载中
			payment_loading: false, // 收费支付加载页
			payment_params: {}, // 播放完成后监听到下一集需要收费，记录下一集的参数
			empty: false, // 内容为空
			type: -1, // 1:知识闯关
			status: 'loading', // 视频加载
			title: '', // 标题
			desc: '', // 简介描述
			see: 0, // 观看次数
			total_num: 0, // 总集数
			video_controls: true, // 视频播放控件
			video_play: false, // 视频播放按钮
			video_src: '', // 播放链接
			video_title: '', // 视频标题
			tabs: [
				{
					name: '课程'
				},
				{
					name: '评论'
				}
				// {
				// 	name: '笔记'
				// }
			],
			// 选中的样式
			activeStyle: {
				color: '#0a2b4e',
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
			tabs_index: 0, // tabs栏下标
			list: [], // 选集集数列表
			select_list_index: 0, // 选集tabs下标
			play_index: -1, // 播放集数下标
			star: 0, // 评价
			star_count: 5, // 5颗星星
			price: 0, // 价格
			courseId: null, // 课程id
			isPay: 0, // 是否收费 0:免费， 1:收费
			isLock: 0, // 显示购买按钮 0:显示， 1:去掉
			comment_empty: '/static/img/empty/collent.png', // 暂无评论
			comment_star: 1, // 自己评论，星星等级
			comment_value: '', // 评论的内容
			comment_list: [], // 评论列表
			is_collect: 0, // 是否收藏课程
			he_comment_value: '', // 评论别人内容
			he_comment_index: -1, // 评论别人的下标
			down_comment_list_item: [], // 展开的评论列表
			play_video_id: '', // 当前播放的视频id
			play_current_time: 0, // 当前播放的秒数
			play_record_time: 0, // 当前播放时的回调秒数
			video_total_duration: 0, // 播放总时长
			catalogue: true, // 课程是否有目录
			isPayStatus: 0, // 需要收费但是已经购买 0:未购买, 1:已购买
			phone_list: [], // 客服电话
			count_down: 3, // 倒计时
			times_loading: true, // 倒计时加载
			loadedmetadataConfirm: true
		};
	},
	filters: {
		PriceZero, // 价格补0
		dateFormat, // 时间戳
		padStartfn
	},
	// 监听页面初次渲染完成，此时组件已挂载完成, DOM 树($el)已可用
	onReady(res) {
		// 创建视频上下文
		videoContext = wx.createVideoContext('myVideo');
	},
	// 页面卸载
	onUnload() {
		this.edit_play_schedule();
	},
	async onLoad(e) {
		// type: 1:知识闯关,
		console.log('课程详情参数', e);
		this.courseId = e.id;
		if (e.type == 1) {
			this.video_controls = false; // 播放视频控件隐藏
			this.type = 1;
		}
		await this.get_service_mobile(); // 获取客服手机号
		const res = await this.get_data(); // 获取课程数据
		if (res) {
			await this.inquire_play_record(); // 查询播放记录
			await this.get_comment_list(); // 获取评论列表
			await this.get_collect(); // 获取收藏记录
		}
	},
	methods: {
		// 获取客服手机号
		get_service_mobile() {
			const { service_mobile } = getApp().globalData;
			this.phone_list[0] = `${JSON.stringify(service_mobile)}`;
		},
		// tabs切换
		click_tabs(item) {
			this.tabs_index = item.index;
		},
		// 列表集数tabs
		list_tabs_click(item) {
			this.select_list_index = item.index;
		},
		// 切换播放，暂停
		is_play() {
			const video_play = this.video_play;
			if (video_play) {
				this.video_play = false;
				videoContext.play();
			} else {
				this.video_play = true;
				videoContext.pause();
			}
		},
		// 播放进度
		video_timeupdate(e) {
			this.play_record_time = Math.floor(e.detail.currentTime);
		},
		// 视频播放
		async play() {
			this.loading = false;
			this.play_end = false;
			this.payment_loading = false;
			this.count_down = 3;
			console.log('开始播放');
		},
		// 暂停播放
		pause() {
			console.log('暂停播放');
		},
		// 播放出错
		error() {
			// uni.showToast({
			// 	title: '服务器发生错误，视频播放失败！',
			// 	icon: 'none',
			// 	duration: 2000
			// });
		},
		// 视频元数据加载完成时触发
		async loadedmetadata(e) {
			console.log('视频元数据加载完成时触发');
			setTimeout(() => {
				// 查询是否有播放记录
				if (this.loadedmetadataConfirm) {
					this.loadedmetadataConfirm = false;
					const video_total_duration = Math.floor(e.detail.duration);
					this.video_total_duration = video_total_duration;
					this.inquire_play_record();
					if (video_total_duration) {
						const play_current_time = this.play_current_time;
						this.$nextTick(() => {
							videoContext.seek(play_current_time);
							videoContext.play();
							this.loadedmetadataConfirm = true;
						});
					}
				}
			}, 1000);
		},
		// 播放到末尾
		async ended() {
			this.loading = true;

			// 知识闯关播放完成
			if (this.type == 1) {
				this.play_complete();
			}
			// 初始化播放进度0
			this.play_current_time = 0;
			// 看完了，初始播放记录。
			await this.edit_play_schedule();

			// 有下一集自动播放下一集， 当前集数播放完，查询是否还有下一集
			// 1.获取总播放集数长度
			// 2.获取当前播放下标
			// 3.拿到tabs选集下标
			// 4.拿到视频列表
			const play_index = this.play_index; // 当前播放下标
			const total_num = this.total_num; // 总集数
			const select_list_index = this.select_list_index; // 有目录，播放的tabs下标
			const list = this.list; // 获取视频列表

			// 当前播放集数下标小于总集数
			if (play_index < total_num) {
				this.times_loading = true;
				// 开启倒计时
				const times_id = setInterval(() => {
					if (this.count_down <= 1) {
						console.log('<1');
						clearInterval(times_id);
						list.forEach((item, index) => {
							// 有目录
							if (item.children && item.children.length > 0) {
								item.children.forEach((item2, index2) => {
									if (play_index + 1 == item2.serial_number) {
										// 播放下一集之前判断下一集是否收费
										if (item2.islock == 0) {
											// 不用收费
											this.play_index = play_index + 1;
											this.select_list_index = index;
											// 播放下一集
											this.item_video_play(item2, this.play_index, index);
											this.payment_loading = false;
										} else if (item2.islock == 1) {
											// 开启收费提示界面
											this.loading = true;
											this.payment_loading = true;
											// 记录当前播放的集数，下标。等待支付完成后继续播放下一集
											this.payment_params = item2;
										}
									}
								});
							} else {
								if (item.islock == 0) {
									// 没有目录
									this.play_index = play_index + 1;
									// 播放下一集
									this.item_video_play(item, this.play_index);
									this.payment_loading = false;
								} else if (item.islock == 1) {
									// 开启收费提示界面
									this.loading = true;
									this.payment_loading = true;
									// 记录当前播放的集数，下标。等待支付完成后继续播放下一集
									this.payment_params = item;
								}
							}
						});
					} else {
						console.log('-1');
						this.count_down = this.count_down - 1;
					}
				}, 1000);
			} else {
				this.times_loading = false;
				console.log('最后一集');
			}
		},
		// 重新播放
		anew_play() {
			let params = {
				id: '',
				serial_number: '',
				name: '',
				courseVideo: '',
				anew: true
			};
			const list = this.list; // 获取视频列表
			if (list.length == 1) {
				videoContext.seek(0);
				videoContext.play();
				return;
			}
			list.forEach((item, index) => {
				if (item.children && item.children.length > 0) {
					// 有目录
					console.log('有目录');
					this.select_list_index = 0; // 选中的目录
					params.id = list[0].children[0].id; // 第一集视频id
					params.serial_number = list[0].children[0].serial_number; // 第一集视频下标
					params.name = list[0].children[0].name; // 第一集视频标题
					params.courseVideo = list[0].children[0].courseVideo; // 第一集视频播放链接
				} else {
					// 没有目录
					console.log('没有目录');
					params.id = list[0].id;
					params.serial_number = list[0].serial_number;
					params.name = list[0].name;
					params.courseVideo = list[0].courseVideo;
				}
			});
			this.item_video_play(params);
		},
		// 知识闯关，播放完成
		async play_complete() {
			const res = await this.$request.post3('/api/progress/edit', {
				courseId: this.play_video_id,
				courseInfoId: this.courseId,
				firstTimeWatching: 2, // 修改第一次播放
				progress: 0, // 播放进度
				completed: 1 // 已完成
			});
			console.log('知识闯关，播放完成', res);
		},
		// 购买课程
		async buy() {
			uni.showLoading({
				title: '正在下单中...',
				mask: true
			});
			// 生成订单
			const new_order = await this.$request.get2('/api/pay/insert', {
				courseId: this.courseId
			});
			console.log('生成订单', new_order);
			if (new_order.code == 200) {
				const res = await this.$request.post3('/api/pay/prepay', {
					scene: 'recharge',
					payWay: 2,
					orderId: new_order.data
				});
				console.log('支付', res);

				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: res.data.timeStamp,
					nonceStr: res.data.nonceStr,
					package: res.data.packageValue,
					signType: res.data.signType,
					paySign: res.data.paySign,
					success: (successRes) => {
						uni.showToast({
							title: '支付成功',
							icon: 'none',
							duration: 1200,
							success: async (make) => {
								await this.get_data();
							}
						});
					},
					fail: (err) => {
						console.log('支付err:', err);
						if (err.errMsg != 'requestPayment:fail cancel') {
							uni.showToast({
								title: '服务器发生错误，支付错误!',
								icon: 'none',
								duration: 2000
							});
						}
					}
				});
			}
			uni.hideLoading();
		},
		// 获取详情数据
		async get_data(courseId) {
			// 获取是否播放途中弹出支付加载状态
			const payment_loading = this.payment_loading;
			const res = await this.$request.post3('/api/courseInfo/getCourseById', {
				courseId: this.courseId
			});
			console.log('课程详情', res);
			if (res.code == 200) {
				this.price = res.data.payAmount;
				this.isPay = res.data.isPay;
				this.isPayStatus = res.data.isPayStatus;
				this.isLock = res.data.isLock;
				this.title = res.data.courseName;
				this.desc = res.data.remark;
				this.see = res.data.courseWatch;
				// 生成对应的序号
				let serial_number = 0;
				if (res.data.videos.length > 0) {
					res.data.videos.forEach((item, index) => {
						// 有目录
						if (item.children) {
							this.total_num += item.children.length;
							if (res.data.videos[0].children.length > 0) {
								item.children.forEach((item2, index2) => {
									serial_number++;
									item2.serial_number = serial_number;
									// 监听播放的集数 lastId:0 没有记录
									if (res.data.lastId != 0) {
										// 有播放记录，找到有播放记录的哪一集
										if (item2.id == res.data.lastId) {
											this.play_index = serial_number;
											this.play_video_id = item2.id;
											this.video_src = item2.courseVideo;
											// 选集tabs栏下标
											this.select_list_index = index;
											return;
										}
									} else if (res.data.lastId == 0 && index2 == 0 && index == 0) {
										// 没有播放记录，默认拿第一集数据
										console.log('我进来了几次', index2);
										this.play_index = 1;
										this.play_video_id = item2.id;
										this.video_src = item2.courseVideo;
										return;
									}
								});
							}
						} else {
							// 没有目录的
							this.catalogue = false;
							// 总集数长度
							this.total_num = res.data.videos.length;
							// 生成序号
							serial_number++;
							item.serial_number = serial_number;
							// 监听播放的集数 lastId:0 没有记录
							if (res.data.lastId != 0) {
								if (item.id == res.data.lastId) {
									this.play_index = serial_number;
									this.play_video_id = item.id;
									this.video_src = item.courseVideo;
									// 选集tabs栏下标
									this.select_list_index = index;
									return;
								}
							} else {
								if (index == 0) {
									this.play_index = 1;
									this.play_video_id = item.id;
									this.video_src = item.courseVideo;
									return;
								}
							}
						}
					});
					this.list = res.data.videos;
					if (payment_loading) {
						console.log('购买成功', this.payment_params);
						const isPayStatus = this.isPayStatus;
						// 已购买
						if (isPayStatus == 1) {
							const item = this.payment_params;
							item.islock = 0;
							this.loading = false;
							this.payment_loading = false;
							console.log('购买成功', item);
							// 购买成功，观看下一集
							await this.item_video_play(item);
						}
					}
					return true;
				} else if (res.data.videos.length == 0) {
					this.empty = true;
					return false;
				}
			} else {
				return (this.empty = true);
			}
		},
		// 点击播放列表,切换播放
		async item_video_play(e) {
			console.log('查看参数', e);
			if (this.play_video_id == e.id) return;
			wx.showLoading({
				title: '加载中',
				mask: true,
				success: () => {
					setTimeout(async () =>{
						if (e.islock == 1) {
							uni.showToast({
								title: '请先购买课程',
								icon: 'none',
								duration: 2000
							});
							return wx.hideLoading();
						} else {
							// 手动切换集数时，修改离开时播放进度
							const result = await this.edit_play_schedule();
							if (result) {
								// 手动切换时初始化指定播放时长
								this.video_total_duration = 0;
								// 暂停当前播放视频
								videoContext.pause();
								// 停止当前播放视频
								videoContext.stop();
								// 初始化播放链接
								this.video_src = '';
								// 清除视频标题
								this.video_title = '';
								// 当前播放视频的id
								this.play_video_id = e.id;
								// 选中当前播放集数下标
								this.play_index = e.serial_number;
								// 当前播放标题
								this.video_title = e.name;
								// 播放链接
								this.video_src = e.courseVideo;
							}
							wx.hideLoading();
						}
					}, 2000)
				}
			});
		},
		// 自己评论,输入回调
		comment_input_change(e) {
			this.comment_value = e;
		},
		// 自己评论，发送
		async comment_submit() {
			console.log('评论的内容', this.comment_value);
			if (this.comment_value) {
				const res = await this.$request.post3('/api/comment/add', {
					parentId: 0, // 自己评论就是0，评论别人就是对应的id
					type: 1, // 类型： 1：视频课程, 2:图文, 3:活动详情
					typeId: this.courseId, // 课程id
					text: this.comment_value,
					replyUserId: 0
				});
				console.log('评论', res);
				if (res.code == 200) {
					this.comment_value = '';
					await this.get_comment_list();
					uni.showToast({
						title: '评论成功',
						duration: 2000
					});
				} else {
					uni.showToast({
						title: '服务器发生错误，请稍后再试！',
						duration: 2000
					});
				}
			} else {
				uni.showToast({
					title: '评论内容不能为空！',
					duration: 2000
				});
			}
		},
		// 获取评论列表
		async get_comment_list() {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			const res = await this.$request.get2(
				'/api/comment/list',
				{
					parentId: 0,
					type: 1,
					typeId: this.courseId
				},
				'yes',
				'no'
			);

			console.log('评论列表', res);
			this.comment_list = res.data;
			uni.hideLoading();
		},
		// 获取收藏
		async get_collect() {
			const res = await this.$request.get2('/api/collect/check', {
				type: 1,
				typeId: this.courseId
			});
			console.log('收藏', res);
			if (res.code == 200) {
				if (!res.data) {
					this.is_collect = 0;
				} else {
					this.is_collect = res.data.type;
				}
			}
		},
		// 切换收藏
		async click_collect() {
			uni.showLoading({
				title: '加载中',
				mask: true
			});
			const is_collect = this.is_collect;
			if (is_collect) {
				const cancel = await this.$request.post3('/api/collect/del', {
					type: 1,
					typeId: this.courseId
				});
				console.log('取消收藏', cancel);
				await this.get_collect();
			} else {
				const confirm = await this.$request.post3('/api/collect/add', {
					type: 1,
					typeId: this.courseId
				});
				console.log('新增收藏', confirm);
				await this.get_collect();
			}
			uni.hideLoading();
		},
		// 评论点赞
		async is_like(item) {
			const res = await this.$request.post3('/api/comment/edit', {
				id: item.id,
				likeCount: item.likeCount,
				isComment: item.isComment
			});
			console.log('点赞', res);
			await this.get_comment_list();
		},
		// 展开评论
		async down_collect(item, index) {
			const he_comment_index = this.he_comment_index;
			if (he_comment_index == index) {
				this.he_comment_index = -1;
				return;
			}
			this.he_comment_index = -1;
			this.he_comment_index = index;
			await this.get_reply_list(item);
		},
		// 评论别人输入框回调
		he_comment_input_change(e) {
			this.he_comment_value = e;
		},
		// 评论别人 提交
		async he_comment_submit(item) {
			if (this.he_comment_value) {
				const res = await this.$request.post3('/api/comment/add', {
					parentId: item.id,
					type: 1,
					typeId: item.typeId,
					userId: uni.getStorageSync('jinsiyuma_user_id') || '',
					replyUserId: item.userId,
					text: this.he_comment_value
				});
				console.log('评论别人', res);
				if (res.code == 200) {
					this.he_comment_value = '';
					await this.get_comment_list();
					await this.get_reply_list(item);
				}
			} else {
				uni.showToast({
					title: '评论内容不能为空！',
					duration: 2000
				});
			}
		},
		// 获取展开别人的评论
		async get_reply_list(item) {
			const skip = 'yes';
			const is_user_id = 'no';
			const res = await this.$request.get2(
				'/api/comment/list',
				{
					parentId: item.id
				},
				skip,
				is_user_id
			);
			console.log('获取展开别人的评论', res);
			this.down_comment_list_item = res.data;
		},
		// 查询播放记录，知识闯关不调用
		async inquire_play_record() {
			// courseInfoId:当前播放集数的id, courseId:课程id
			const res = await this.$request.get2('/api/progress/list', {
				courseId: this.play_video_id,
				courseInfoId: this.courseId
			});
			if (res.code == 200) {
				console.log('有记录，指定秒数继续播放', res.data.progress);
				if (res.data.id != null) {
					this.play_current_time = res.data.progress;
				} else {
					console.log('没有播放记录，重头开始播放');
					this.play_current_time = 0;
					this.none_play_record();
				}
			}
		},
		// 没有播放记录，重头开始播放
		async none_play_record() {
			const res = await this.$request.post3('/api/progress/add', {
				courseId: this.play_video_id,
				courseInfoId: this.courseId
			});
			console.log('没有播放记录，重头开始播放', res);
		},
		// 中途播放中，退出页面，修改视频播放进度
		async edit_play_schedule() {
			const play_record_time = this.play_record_time;
			const res = await this.$request.post3('/api/progress/edit', {
				courseId: this.play_video_id,
				courseInfoId: this.courseId,
				progress: play_record_time
			});
			console.log('修改进度状态', res.code, '修改播放进度时当时播放的秒数', play_record_time);
			if (res.code == 200) {
				this.play_record_time = 0;
				return true;
			} else {
				return false;
			}
		},
		// 跳转下载课件
		open_download(link) {
			if (link) {
				uni.navigateToMiniProgram({
					shortLink: link,
					success: (res) => {
						console.log('res', res);
					}
				});
			} else {
				uni.showToast({
					title: '跳转失败，网盘链接出错！',
					icon: 'none',
					duration: 2000
				});
			}
		},
		// 拨打电话
		click_dial() {
			uni.showActionSheet({
				itemList: this.phone_list,
				success: (res) => {
					console.log('success', res);
					if (!res.cancel && res.tapIndex !== undefined) {
						uni.makePhoneCall({
							phoneNumber: this.phone_list[res.tapIndex],
							success: function () {
								console.log('拨打电话成功');
							},
							fail: function () {
								uni.showToast({
									title: '拨打电话失败',
									icon: 'none',
									duration: 2000
								});
							}
						});
					}
				},
				fail: (err) => {
					console.log('err', err);
				}
			});
		}
	}
};
</script>

<style>
page {
	background: #f8f8f8;
}
</style>
<style lang="less" scoped>
.video_box {
	position: relative;
	video {
		width: 100%;
		display: block;
		vertical-align: top;
	}

	.loading {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #000;
		display: flex;
		justify-content: center;
		align-items: center;
		.content {
			.title {
				font-size: 24rpx;
				color: #fff;
			}

			.buy_content {
				margin-top: 20rpx;
			}
		}

		.times_content {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			.count_down {
				position: absolute;
				bottom: 30rpx;
				right: 0;
				padding: 20rpx;
				color: #fff;
				font-size: 24rpx;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				.iconfont {
					color: #fff;
					font-size: 24rpx;
					padding-left: 10rpx;
				}
			}

			.hint {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				.title {
					font-size: 24rpx;
					color: #fff;
					text-align: center;
					margin-bottom: 20rpx;
				}

				/deep/ button {
					width: 200rpx !important;
					height: 68rpx !important;
					padding: 0 !important;
					.u-button__text {
						font-size: 12px !important;
					}
				}
			}
		}
	}

	.video_shadow {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.iconfont {
			font-size: 72rpx;
			color: #fff;
		}

		.play_icon {
			width: 32px;
			height: 32px;
		}
	}
}

.tabs {
	background: #fff;
	border-bottom: 1px solid #eaeaea;
}

.content {
	padding: 30rpx 20rpx 20rpx;
	.tabs1 {
		.title {
			font-size: 32rpx;
			font-weight: 500;
			color: #000;
		}
		.statuc {
			padding: 20rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.time {
				display: flex;
				font-size: 24rpx;
				line-height: 36rpx;
				color: #c9c9c9;
				padding: 20rpx 0;
				.iconfont {
					padding: 0 4rpx;
				}
			}
			.collect_content {
				/deep/ .u-button {
					width: 140rpx !important;
					height: 64rpx !important;
					margin: 0 !important;
					padding: 0 !important;
					.u-icon__icon {
						font-size: 16px !important;
					}
					.u-button__text {
						font-size: 12px !important;
					}
				}
			}
		}
		.desc {
			font-size: 24rpx;
			line-height: 40rpx;
			color: #000;
			background: #fff;
			border-radius: 12rpx;
			padding: 20rpx 20rpx 10rpx;
		}
		.buy_content {
			margin-top: 30rpx;
			/deep/ .u-button__text {
				padding-top: 2px;
				padding-left: 3px;
			}
		}
		.video_list {
			padding-top: 30rpx;
			.head {
				display: flex;
				align-items: center;
				font-size: 32rpx;
				color: #0a2b4e;
				font-weight: 500;
				.iconfont {
					font-weight: 700;
					color: #ff0000;
				}
			}
			.list {
				padding-top: 30rpx;
				.item_li {
					display: flex;
					justify-content: space-between;
					align-items: center;
					border-radius: 12rpx;
					background: #fff;
					margin-bottom: 20rpx;
					padding: 20rpx;
					position: relative;
					.serial {
						width: 58rpx;
						height: 58rpx;
						line-height: 58rpx;
						text-align: center;
						border-radius: 50%;
						overflow: hidden;
						background: #0a2b4e;
						font-size: 28rpx;
						color: #fff;
						font-weight: 600;
						flex: none;
					}
					.item_center {
						padding-left: 20rpx;
						flex: 1;
						display: flex;
						justify-content: space-between;
						.item_title {
							font-size: 28rpx;
							color: #000;
							line-height: 38rpx;
							flex: 1;
							flex-wrap: wrap;
						}
						.item_btn {
							height: 48rpx;
							line-height: 48rpx;
							margin-left: 20rpx;
							padding: 0 30rpx;
							border-radius: 12rpx;
							background: #ffaa00;
							font-size: 28rpx;
							color: #fff;
							flex: none;
						}
					}

					.lock {
						position: absolute;
						right: 0;
						top: 0;
						width: 60rpx;
						height: 58rpx;
						overflow: hidden;
						.iconfont {
							color: #0a2b4e;
							font-size: 12px;
							transform: translate(24rpx, 10rpx);
						}
					}
				}

				.disabled {
					background: #e8e8e8;
				}

				.active {
					background: #0a2b4e;
					.serial {
						background: #fff;
						color: #0a2b4e;
					}
					.item_center {
						.item_title {
							color: #fff;
						}
					}
					.lock {
						.iconfont {
							color: #fff;
						}
					}
				}
			}
		}
		.select_content {
			padding-top: 30rpx;
			.head {
				display: flex;
				align-items: center;
				font-size: 32rpx;
				color: #0a2b4e;
				font-weight: 500;
				.iconfont {
					font-weight: 700;
					color: #ff0000;
				}
			}

			.select_tabs {
				margin: 30rpx 0;
				border-radius: 12rpx;
				overflow: hidden;
				/deep/ .u-tabs__wrapper__nav__line {
					display: none;
				}
			}
		}
	}

	.comment {
		padding-bottom: 50rpx;
		height: 100%;
		.head {
			display: flex;
			align-items: center;
			font-size: 32rpx;
			color: #0a2b4e;
			font-weight: 500;
			.iconfont {
				font-weight: 700;
				color: #ff0000;
			}
		}

		.comment_list {
			padding: 30rpx 0 0 0;
			.comment_item {
				padding: 20rpx;
				background: #fff;
				margin-bottom: 40rpx;
				.head {
					display: flex;
					justify-content: space-between;
					.left {
						display: flex;
						align-items: center;
						.head_portrait {
							width: 50rpx;
							border-radius: 50%;
							height: auto;
						}
						.name {
							font-size: 26rpx;
							font-weight: 600;
							color: #000;
							padding: 0 12rpx;
						}
					}

					.time {
						font-size: 24rpx;
						color: #717171;
					}
				}

				.desc {
					font-size: 24rpx;
					line-height: 38rpx;
					color: #000;
					padding: 20rpx 0;
					.text {
						color: #3c9cff;
						padding: 0 5rpx;
						font-weight: 500;
					}
				}

				.function {
					.top_status {
						display: flex;
						align-items: center;
					}
					.box {
						padding: 10rpx 26rpx 10rpx 0;
						font-size: 24rpx;
						color: #000;
						display: flex;
						align-items: center;
						.text {
							padding-left: 4rpx;
						}

						.icon-yizan {
							color: #ff0000;
						}
					}
					.down_comment_list {
						.down_comment_list_item {
							padding-top: 20rpx;
						}

						.desc {
							.text {
								color: #3c9cff;
							}
						}
					}
					.down_collect {
						padding-top: 20rpx;
						display: flex;
						align-items: center;
						.input {
							flex: 1;
						}
						/deep/ .u-input {
							background: #fff;
						}
						.btn {
							flex: none;
							width: 120rpx;
						}
						/deep/ .u-button {
							flex: none;
							width: 120rpx;
							margin-left: 20rpx;
							height: 38px;
						}
					}
				}
			}
		}

		.comment_empty {
			padding: 30rpx 0;
			text-align: center;
			.cover {
				width: 440rpx;
			}
			.text {
				font-size: 24rpx;
				color: #000;
			}
		}

		.comment_bottom {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			z-index: 3;
			padding: 20rpx 30rpx 40rpx;
			background: #f8f8f8;
			border-top: 1px solid #e8e8e8;

			.star {
				padding: 20rpx 0;
				display: flex;
				align-items: center;
				.text {
					font-size: 24rpx;
					color: #000;
				}
			}
			.btn_box {
				display: flex;
				align-items: center;
				.input {
					flex: 1;
				}
				/deep/ .u-input {
					background: #fff;
				}
				.btn {
					flex: none;
					width: 120rpx;
				}
				/deep/ .u-button {
					flex: none;
					width: 120rpx;
					margin-left: 20rpx;
					height: 38px;
				}
			}
		}
	}
}

.not_find {
	padding: 100rpx 30rpx 0;
	text-align: center;
	.name {
		font-size: 26rpx;
		line-height: 36rpx;
		color: #333;
	}

	.desc {
		padding: 10rpx 0;
		font-size: 24rpx;
		line-height: 34rpx;
		color: #9f9f9f;
	}

	.bottom {
		padding: 50rpx 0;
		display: flex;
		justify-content: space-between;
		.btn {
			width: 48%;
			height: 88rpx;
			text-align: center;
			line-height: 88rpx;
			border: 1px solid #ddd;
			color: #333;
			font-size: 24rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: none;
			border-radius: 0;
			outline: none;
			&:after {
				display: none;
			}
			.iconfont {
				color: #333;
				margin-right: 10rpx;
			}
		}
	}
}
</style>
