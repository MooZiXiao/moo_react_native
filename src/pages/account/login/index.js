import React, {Component} from 'react';
import {View, Text, Image, StatusBar} from 'react-native';
import {pxToDp} from '../../../utils/stylesKits';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import validate from '../../../utils/validate';
import request from '../../../utils/request';
 
export default class Index extends Component {
    state = {
        phoneNumber: '15915912345',
        phoneValid: true
    }
    phoneNumberOnChangeText = (phoneNumber) => {
        this.setState({phoneNumber})
    }
    phoneNumberSubmitEditing = async () => {
        /**
         * 校验
         * 获取验证码 axios
         * 将登录页切换成填写验证码页
         */
        const {phoneNumber} = this.state;
        const phoneValid = validate.validatePhone(phoneNumber)
        if(!phoneValid) {
            // 不通过
            this.setState({phoneValid});
            return;
        }
        let res = await request.post('/user/login', {phone: phoneNumber});
        console.log(res)
    }
    render () {
        const {phoneNumber, phoneValid} = this.state;
        return (
            <View>
                {/* 状态栏 */}
                <StatusBar backgroundColor="transparent" translucent={true} />
                {/* 图片 */}
                {/* 200 单位 dp 单位px -> dp单位 */}
                <Image style={{width: "100%", height: pxToDp(200)}} source={require('../../../res/profileBackground.png')}></Image>
                {/* 内容 */}
                <View style={{padding: pxToDp(20)}}>
                    {/* 标题 */}
                    <View><Text style={{color: '#888', fontSize: pxToDp(25), fontWeight: 'bold'}}>手机号登录注册</Text></View>
                    {/* 输入框 */}
                    <View style={{marginTop: pxToDp(30)}}>
                        <Input maxLength={11} keyboardType="phone-pad" value={phoneNumber} placeholder="请输入手机号码" inputStyle={{color: '#333'}} onChangeText={this.phoneNumberOnChangeText} onSubmitEditing={this.phoneNumberSubmitEditing} errorMessage={!phoneValid ? "手机号码格式不正确" : ""} leftIcon={{type: 'font-awesome', name: 'phone', color: "#ccc", size: pxToDp(20)}} />
                    </View>
                </View>
            </View>
        )
    }
}