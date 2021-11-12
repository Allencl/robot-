import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet, ScrollView, View,Text,   } from 'react-native';
import { Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {WisCameraComponent,WisTableCross} from '@wis_component/ul';
import {WisFormText} from '@wis_component/form';   // form 


// 退料 主页
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      visible: false,  // 显示扫码
      // serchValue:"IVC-2012210004", // 查询框
      serchValue:"", // 查询框

      material:'物料',
      code:'物料条码',
      location:'线边库/点位',
      number:'数量',
      no:'计划单号',
      order:'工单号',
      time:'新增时间'
    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentDidMount(){

  }

  /**
   * 清空
   */
  clearHandle(){

    // 清空
    this.setState({

    });
  }

  /**
   * 页面 初始化
   * @param {}  
   */
  getInitFunc(val=''){

    let that=this;
    let {serchValue}=this.state;

    this.clearHandle();

    WISHttpUtils.post("api-supply/srm/invoice/load",{
      params:{
        code: String(val||serchValue).trim()
      }
    },(result) => {

      var data=result["data"];

      // that.setState({

      // });

    });

  }


  /**
   * 查询
   */
  serchHandle(){
    this.getInitFunc();
  }

  /**
   * 全局的 扫描
   */
  globalScan(){
    this.setState({
      visible:true
    });
  }

  // 关闭 扫码
  closeCamera(){
    this.setState({
        visible:false
    });       
  } 

  // 扫码 完成
  onRead(option){
    // "type": "EAN_13"}  条码
    // option 是拿到的 数据
    this.setState({
      serchValue:option["data"],  // 结果
      visible:false
    });   

    this.getInitFunc(option["data"]);
  }  

  /**
   * 上料
   */
  passHandle=(value)=>{
    const {navigation} = this.props;
    let {serchValue}=this.state;

    
    if(!serchValue){
      Toast.fail('料箱号不能为空！');
      return;
    }


    Toast.success("操作成功！");
    setTimeout(() => {
      navigation.navigate('Home');
    },1000);

  }  




  render() {
    let that=this;
    let {serchValue,visible,dataList} = this.state;
    let {material,code,location,number,no,order,time}=this.state;
    let {navigation} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;


    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>
        
        { visible ?
          <WisCameraComponent 
            onClose={()=> this.closeCamera() }
            onRead={(option)=> this.onRead(option) }
          />
          :
          <View></View>
        }           
        
        <View style={styles.headContainer}>
          <View style={{flex:1}}>
            <InputItem
              last={true}
              
              // type="number"
              value={serchValue}
              onChange={value => {
                this.setState({
                  serchValue: value,
                });
              }}
              placeholder="扫描料箱..."
            />
          </View>
          <TouchableOpacity onPress={() => this.serchHandle() }>
            <View style={styles.headIcon}>
              <Icon name="search" size={30} color="#1890ff" />
            </View> 
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.globalScan() }>
            <View style={styles.headIcon}>
              <Icon name="scan" size={30} color="#1890ff" />
            </View>  
          </TouchableOpacity>
        </View>

        <View style={{marginTop:12}}>    
            <WisFormText 
              title="退料详情"
              children={[
                {
                  label:"物料",
                  content:material
                },
                {
                  label:"物料条码",
                  content:code
                },
                {
                  label:"线边库/点位",
                  content:location
                },
                {
                  label:"数量",
                  content:number
                },
                {
                  label:"计划单号",
                  content:no
                },
                {
                  label:"工单号",
                  content:order
                },
                {
                  label:"新增时间",
                  content:time
                }                                                                
              ]}
            />
          </View> 


        <View style={{marginTop:32}}>
          <Button type="primary" onPress={this.passHandle}>退料</Button>
        </View>      
                
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  headContainer:{
    flexDirection:'row',
    paddingTop:18,
    paddingBottom:2,
    backgroundColor:"white",
    borderBottomWidth:1,
    borderColor:"#e9e9e9", 
  },
  headIcon:{
    paddingLeft:10,
    paddingRight:10
  }
});



export default createForm()(PageForm);

