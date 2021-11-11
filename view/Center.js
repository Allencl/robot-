import React from 'react';
import { DeviceEventEmitter,TouchableOpacity, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Provider, InputItem, List, Toast,Icon } from '@ant-design/react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

class CenterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name:"",
      position:"",
      email:'',
    };
  }

  componentDidMount() {
    let that=this;

    // 获取登录信息
    this.listener =DeviceEventEmitter.addListener('globalEmitter_get_login_config',function(){
      // 缓存的 登录数据
      AsyncStorage.getItem("login_config").then((option)=>{
        if(option){
          try{
            let loginConfig=JSON.parse(option);

            that.setState({
              name:loginConfig["userName"],
              position:loginConfig["phone"],
              // email:loginConfig["phone"],
            });

          } catch (error) {
          }          
        }
      });
    });
  }

  componentWillUnmount(){
    this.listener.remove();
  }

  render() {
    const {onClose} = this.props;
    let {name,position,email}=this.state;

    return (
      <View style={styles.container}>
          <View style={styles.headContainer}>
            <View style={styles.imgBox}>
              <Image
                style={styles.img}
                source={require('./img/head.jpg')}
              />   
            </View>
            <View style={styles.textBox}>
              <View style={{...styles.textDIV,paddingTop:26}}>
                <Text style={{fontSize:20,color:"#fff"}}>{name}</Text> 
              </View>   
              <View style={styles.textDIV}>
                <Text style={{fontSize:18,color:"#fff"}}>{position}</Text> 
              </View>   
              <View style={styles.textDIV}>
                <Text style={{fontSize:18,color:"#fff"}}>{email}</Text> 
              </View>   
            </View>
          </View>

          <View style={{paddingTop:12}}>
            <TouchableOpacity onPress={()=>{
              // 退出登录
              DeviceEventEmitter.emit('globalEmitter_logOut');
              // DeviceEventEmitter.emit('globalEmitter_logOut',()=> onClose());
            }}>
              <View style={styles.footerBtn}>
                <Text style={styles.btnFont}>退出登录</Text>
                <Icon style={styles.btnIcon} name="right" size="sm" />
              </View>
            </TouchableOpacity>        
          </View>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#fff"
  },
  headContainer:{
    flexDirection:'column',
    // justifyContent:'center',
    backgroundColor:"#1890ff",    
    height:350,
    paddingTop:39  
  },
  imgBox:{
    flexDirection:'row',
    justifyContent:'center',
    paddingTop:50,
  },
  textBox:{
    flexDirection:'column',
    // paddingBottom:150
    // justifyContent:'center',    
  },
  textDIV:{
    flexDirection:'row',
    justifyContent:'center',
    paddingTop:8,
    paddingBottom:8
  },
  img:{
    width:120,
    height:120,
    borderRadius:60
  },
  footerBtn:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:12,
    borderBottomWidth:1,
    borderBottomColor:"#e9e9e9"
    // backgroundColor:"red"
  },
  btnFont:{
    fontSize:18
  },
  btnIcon:{
    paddingRight:12,
    color:"#404040"
  }
});


export default CenterPage;