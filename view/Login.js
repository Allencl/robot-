import React from 'react';
import { BackHandler,DeviceEventEmitter,window,TouchableOpacity,Text, View, StyleSheet } from 'react-native';
import { Icon,Button, Provider, InputItem, List, Toast } from '@ant-design/react-native';
import { createForm, formShape } from 'rc-form';

import WISHttpUtils from '@wis_component/http';   // http 

import AsyncStorage from '@react-native-async-storage/async-storage';


class LoginScreenForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      toggleEye:true,  // 显示密码

      userName:"",
      password:"",
    };
  }

  componentDidMount() {
    let that=this;

    // 缓存的 登录信息
    AsyncStorage.getItem("login_message").then((option)=>{
      if(option){
        try{
          let loginMessage=JSON.parse(option);
          that.setState({
            userName:loginMessage["userName"],
            password:loginMessage["password"],
          });
        } catch (error) {

        }          
      }
    });

    BackHandler.addEventListener('hardwareBackPress',this.onBackButtonPressAndroid);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress',this.onBackButtonPressAndroid);
  }  

  /**
   * 
   * @returns 禁用返回键
   */
  onBackButtonPressAndroid = () => {
    if (this.props.navigation.isFocused()) {
        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
          // //最近2秒内按过back键，可以退出应用。
          // return false;
          BackHandler.exitApp();//直接退出APP
        }
        this.lastBackPressed = Date.now();
        Toast.info('再按一次退出应用',1);
        return true;
    }
  }  


  /**
   * 登录
   * @param
   */
   submit = () => {
    let that=this;
     
    that.props.form.validateFields((error, value) => {
        // 表单 不完整
        if(error){
          Toast.fail('用户名或密码未填！');
        } else{
          const {navigation} = that.props;
          let newUserName=value["userName"].trim();
          let newPassword=value["password"].trim();

          WISHttpUtils.loginFunc({
            userName:newUserName,
            password:newPassword,
          },()=>{
            
            // 判断用户类型
            WISHttpUtils.post("api-supply/srm/order/getUserType",{
              params:{},
              hideLoading:true
            },(result) => {
              
              // 登录状态
              AsyncStorage.removeItem("login_type").then(()=>{
                AsyncStorage.setItem("login_type","in");
              });



              var active=result["data"]["userType"];
              var userType="";

              // 采购商 供应商 财务
              // if( active=="ADMIN" || active=="INNER"){
              //   userType="procurement";  //采购商
              // }else{
              //   userType="provider";   // 供应商
              // }

              // console.log(active);
              switch (active) {
                case "FINANCE":
                    userType="financing";  // 财务
                  break;
                case "SUPPLIER":
                    userType="provider";  // 供应商
                  break;     
                case "PURCHASE":
                    userType="procurement";  // 采购
                  break;                            
                default:
                  break;
              }

              AsyncStorage.removeItem("user_type").then(()=>{
                AsyncStorage.setItem("user_type",userType).then(()=>{
                  navigation.navigate('Home');

                  setTimeout(() => {
                    DeviceEventEmitter.emit('globalEmitter_set_userType');
                    DeviceEventEmitter.emit('globalEmitter_updata_home');
                  },100);
                });
              });

            });            
                   
            
          })
       
        }
    });
  }


  render() {

    const {navigation} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;
    const {userName,password,toggleEye}=this.state;
  
    return (
      <Provider>
        <View
          style={styles.container}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <List>

            <View style={styles.headTitle}>
              <Text style={styles.headTitleText}>Supply Link</Text>
            </View>

            <View style={{height:50}}></View>

              <View style={{paddingRight:18}}>
                <InputItem
                  {...getFieldProps('userName',{
                    rules:[{required:true}],
                    initialValue:userName
                  })}
                  error={getFieldError('userName')}
                  placeholder=""
                >
                  用户名
                </InputItem>

                <InputItem
                  {...getFieldProps('password',{
                    rules:[{required:true}],
                    initialValue:password
                  })}
                  error={getFieldError('password')}
                  type={toggleEye?"password":"text"}
                  extra={
                    <TouchableOpacity onPress={()=>{
                        this.setState({
                          toggleEye:!toggleEye
                        });
                    }}>
                      <Icon name={toggleEye?"eye-invisible":"eye"} />
                    </TouchableOpacity>
                  
                  }
                  placeholder=""
                >
                  密码
                </InputItem>
              </View>
              <List.Item style={styles.footerBox}>
                <Button
                  style={styles.footerBtn}
                  onPress={this.submit}
                  // type="primary"
                >
                  <Text style={{fontSize:22,color:"#fff"}}>登 录</Text>
                </Button>
              </List.Item>
          </List>
        </View>
      </Provider>
    );
  }
}



const styles = StyleSheet.create({
  container:{
    flex: 1,    
    flexDirection: 'column',
    backgroundColor:"#fff"
  },
  headTitle:{
    paddingTop:60,
    paddingLeft:32,
    paddingBottom:50
  },
  headTitleText:{
    color:"#13c2c2",
    fontSize:46,
    fontWeight:"bold",
    fontStyle:'italic',
    textAlign:"center"
  },
  footerBox:{
    paddingTop:100
  },
  footerBtn:{
    backgroundColor:"#13c2c2",
    borderWidth:0,
    borderRadius:0,
    fontSize:32
  }

});


export default createForm()(LoginScreenForm);