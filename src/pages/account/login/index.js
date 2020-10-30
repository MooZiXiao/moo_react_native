import React, { Component } from 'react';
import { View, Text, Image, StatusBar, StyleSheet } from 'react-native';
import { pxToDp } from '../../../utils/stylesKits';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import validate from '../../../utils/validate';
import request from '../../../utils/request';
import Toast from '../../../utils/toast';
import THButton from '../../../../components/THButton';

import {
    CodeField,
    Cursor,
  } from 'react-native-confirmation-code-field';

export default class Index extends Component {
    state = {
        phoneNumber: '15915912345',
        phoneValid: true, // 是否显示错误提示
        showLoginWrap: false, // 是否显示登录
        vcodeText: '', // 验证码输入框值
        btnText: '重新获取', // 倒计时按钮文本
        isCountDowning: false, // 是否在倒计时中
    }
    constructor() {
        super();
    }
    // 渲染登录布局
    renderLogin = () => {
        const { phoneNumber, phoneValid } = this.state;
        return (
            <View>
                {/* 标题 */}
                <View><Text style={{ color: '#888', fontSize: pxToDp(25), fontWeight: 'bold' }}>手机号登录注册</Text></View>
                {/* 输入框 */}
                <View style={{ marginTop: pxToDp(30) }}>
                    <Input maxLength={11} keyboardType="phone-pad" value={phoneNumber} placeholder="请输入手机号码" inputStyle={{ color: '#333' }} onChangeText={this.phoneNumberOnChangeText} onSubmitEditing={this.phoneNumberSubmitEditing} errorMessage={!phoneValid ? "手机号码格式不正确" : ""} leftIcon={{ type: 'font-awesome', name: 'phone', color: "#ccc", size: pxToDp(20) }} />
                </View>
                {/* 渐变按钮 */}
                <View>
                    <View><THButton onPress={this.phoneNumberSubmitEditing} style={{ width: '85%', height: pxToDp(40), alignSelf: 'center', borderRadius: pxToDp(20) }}>获取验证码</THButton></View>
                </View>
            </View>
        )
    }

    // 渲染验证码布局
    renderVerifyCode = () => {
        const { phoneNumber, vcodeText, btnText, isCountDowning } = this.state;
        return (
            <View>
                <View><Text style={{fontSize: pxToDp(22), fontWeight: 'bold', color: '#888'}}>输入6位验证码</Text></View>
                <View><Text style={{fontSize: pxToDp(18), color: '#666', paddingTop: pxToDp(10)}}>已发送 +86 {phoneNumber}</Text></View>
                <View>
                <CodeField
                    value={vcodeText}
                    onChangeText={this.onVerifyCodeChange}
                    onSubmitEditing={this.verifyCodeSubmitEditing}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    renderCell={({index, symbol, isFocused}) => (
                    <Text
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                    )}
                />
                </View>
                <View style={{ paddingTop: pxToDp(30) }}><THButton disabled={isCountDowning} onPress={this.reGetVerifyCode} style={{ width: '85%', height: pxToDp(40), alignSelf: 'center', borderRadius: pxToDp(20) }}>{btnText}</THButton></View>
            </View>
        )
    }

    // 获取输入框数据
    phoneNumberOnChangeText = (phoneNumber) => {
        this.setState({ phoneNumber })
    }
    // 提交
    phoneNumberSubmitEditing = async () => {
        /**
         * 校验
         * 获取验证码 axios
         *  发送异步请求时 自动显示等待框
         *  请求回来 等待框 自动隐藏
         *   等待框 
         *   自动 -> axios 拦截器
         * 将登录页切换成填写验证码页
         */
        const { phoneNumber } = this.state;
        const phoneValid = validate.validatePhone(phoneNumber)
        if (!phoneValid) {
            // 不通过
            this.setState({ phoneValid });
            return;
        }
        setTimeout(() => {
            Toast.showLoading('加载中');
            this.setState({ showLoginWrap: false });
            // 开启定时器
            this.countDown();
            setTimeout(() => {
                Toast.hideLoading();
            }, 500);
        }, 500);
        let res = await request.post('/user/login', { phone: phoneNumber });
        console.log(res)
    }
    // 验证码输入框值改变事件
    onVerifyCodeChange = (vcodeText) => {
        this.setState({vcodeText})
    }
    // 获取验证码定时器
    countDown = () => {
        if(this.state.isCountDowning) return;

        this.setState({isCountDowning: true})
        let seconds = 5;
        this.setState({
            btnText: `重新获取(${seconds}s)`
        })
        let timerId = setInterval(() => {
            seconds --;
            this.setState({
                btnText: `重新获取(${seconds}s)`
            })
            if(seconds <= 0) {
                clearInterval(timerId);
                this.setState({
                    btnText: `重新获取`,
                    isCountDowning: false
                })
            }
        }, 1000);
    }
    // 重新获取验证码
    reGetVerifyCode = () => {
        this.countDown()
    }
    // 验证码输入提交
    verifyCodeSubmitEditing = async () => {
        /**
         * 对验证码校验
         * 将手机号码和验证码 一起发送到后台
         * 返回值 有 isNew
         * 新用户 -> 完善个人信息页面
         * 老用户 -> 交友 - 首页
         */
        const {vcodeText, phoneNumber} = this.state;
        if(vcodeText.length < 6) {
            Toast.message("验证码不正确", 2000, 'center')
            return;
        }

        // 调用后台接口
        let res = await request.post()
    }
    render() {
        const { showLoginWrap } = this.state;
        return (
            <View>
                {/* 状态栏 */}
                <StatusBar backgroundColor="transparent" translucent={true} />
                {/* 图片 */}
                {/* 200 单位 dp 单位px -> dp单位 */}
                <Image style={{ width: "100%", height: pxToDp(200) }} source={require('../../../res/profileBackground.png')}></Image>
                <View style={{ padding: pxToDp(20) }}>
                    {/* 登录内容 */}
                    {
                        showLoginWrap ?
                            this.renderLogin()
                            :
                            this.renderVerifyCode()
                    }
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    root: {flex: 1, padding: 20},
    title: {textAlign: 'center', fontSize: 30},
    codeFieldRoot: {marginTop: 20},
    cell: {
      width: 40,
      height: 40,
      lineHeight: 38,
      fontSize: 24,
      borderBottomWidth: 2,
      borderColor: '#00000030',
      textAlign: 'center',
      color: '#7d60f2',
    },
    focusCell: {
      borderColor: '#7d60f2',
    },
  });
  
  const CELL_COUNT = 6;