const baseUrl = 'https://jsym.kinsyomacz.com/mini'
const courseBaseUrl = 'https://jsym.kinsyomacz.com';

const request = (options = {}) => {
	const user_id = uni.getStorageSync('user_id');
	if (user_id && options.is_userid) {
		options.data.user_id = user_id
	}
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + options.url || '',
			method: options.type || 'GET',
			data: options.data || {},
			header: options.header || {}
		}).then(data => {
			resolve(data.data);
		}).catch(error => {
			reject(error)
		})
	});
}

// 云课堂
const request2 = (options = {}) => {
    // 是否先验证是否有token
    if (options.skip == 'yes') {
        const jinsiyuma_token = uni.getStorageSync('jinsiyuma_token');
        const jinsiyuma_user_id = uni.getStorageSync('jinsiyuma_user_id');
		
        if (jinsiyuma_token || jinsiyuma_user_id) {
            options.header = {
                'token': jinsiyuma_token,
            }

            if (options.is_user_id == 'yes') {
                options.data.userId = jinsiyuma_user_id;
            }

            if (options.method == 'POST') {
                options.header['Content-Type'] = 'application/json';
            }

            return new Promise((resolve, reject) => {
                uni.request({
                    url: courseBaseUrl + options.url || '',
                    method: options.type || 'GET',
                    data: options.data || {},
                    header: options.header || {},
                    timeout: 5000,
                }).then(data => {
                    if (data.data.code == 600 || data.data.msg == '尚未登录,请先登录!') {
                        uni.removeStorageSync('jinsiyuma_token');
                        uni.removeStorageSync('jinsiyuma_user_id');
                        uni.removeStorageSync('start_duration_id');
                        uni.removeStorageSync('start_duration');
                        uni.showModal({
                            content: data.data.msg,
                            success: function (res) {
                                if (res.confirm) {
                                    console.log('用户点击确定');
                                    uni.navigateTo({
                                        url: '/pages/login/register'
                                    })
                                } else if (res.cancel) {
                                    console.log('用户点击取消');
                                    uni.switchTab({
                                        url: '/pages/index/index'
                                    })
                                }
                            }
                        });
                    } else {
                        resolve(data.data);
                    }
                }).catch(error => {
                    reject('服务器发生错误', error);
                })
            });
        } else {
            uni.showModal({
                title: '登录',
                content: '请登录员工账号',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定');
                        uni.navigateTo({
                            url: '/pages/login/register'
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消');
                        uni.switchTab({
                            url: '/pages/index/index'
                        })
                    }
                }
            });
        }
    } else {
        if (options.method == 'POST') {
            options.header['Content-Type'] = 'application/json';
        }
        return new Promise((resolve, reject) => {
            uni.request({
                url: courseBaseUrl + options.url || '',
                method: options.type || 'GET',
                data: options.data || {},
                header: options.header || {},
                timeout: 5000,
            }).then(data => {
                if (data.data.code == 600 || data.data.msg == '尚未登录,请先登录!') {
                    uni.removeStorageSync('jinsiyuma_token');
                    uni.removeStorageSync('jinsiyuma_user_id');
                    uni.removeStorageSync('start_duration_id');
                    uni.removeStorageSync('start_duration');

                    uni.showModal({
                        content: data.data.msg,
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                                uni.navigateTo({
                                    url: '/pages/login/register'
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消');
                                uni.switchTab({
                                    url: '/pages/index/index'
                                })
                            }
                        }
                    });
                } else {
                    resolve(data.data);
                }
            }).catch(error => {
                reject('服务器发生错误', error)
            })
        });
    }
}

const post = (url, data, is_userid = true, options = {}) => {
	options.type = 'POST';
	options.data = data ? data : {};
	options.url = url;
	options.is_userid = is_userid;
	return request(options)
}

// 云课堂get2
// skip: 'yes':'需要验证token', 'no':'不走验证'
// is_user_id 是否传递user_id
const get = (url, data, skip = 'yes', is_user_id = 'yes', options = {}) => {
    options.type = 'GET';
    options.data = data ? data : {};
    options.url = url;
    options.skip = skip;
    options.is_user_id = is_user_id;
    return request2(options)
}

// 云课堂post3
// skip: 'yes':'需要验证token', 'no':'不走验证'
const post2 = (url, data, skip = 'yes', is_user_id = 'yes', options = {}) => {
    options.type = 'POST';
    options.data = data ? data : {};
    options.url = url;
    options.skip = skip;
    options.is_user_id = is_user_id;
    return request2(options)
}

export default {
    get,
    post,
    post2
}