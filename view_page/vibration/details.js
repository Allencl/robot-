import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet, ScrollView, View,Text,   } from 'react-native';
import { Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {WisCameraComponent,WisTableCross} from '@wis_component/ul';
import {WisFormText} from '@wis_component/form';   // form 


// 振动盘退料 退料 
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      visible: false,  // 显示扫码
      // serchValue:"IVC-2012210004", // 查询框
      serchValue:"", // 查询框


      library:"线边库",    // 线边库
      material:"物料",    // 物料
      surplus:"22",    // 剩余数量
      no:"料箱号",   //料箱号
      code:"点位",   // 点位
      number:'11',  // 数量
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
      code:"",   // 点位
      number:1,  // 数量
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

      // var data=result["data"];

      // that.setState({
      //   // code:data["id"],  // 点位 
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
   * 退料
   */
  passHandle=(value)=>{
    const {navigation} = this.props;
    let {serchValue}=this.state;

    
    if(!serchValue){
      Toast.fail('料箱号不能为空！');
      return;
    }

    this.props.form.validateFields((error, value) => {
      // 表单 不完整
      if(error){
        Toast.fail('必填字段未填！');
      } else{
        Toast.success("操作成功！");

        

        setTimeout(() => {
          navigation.navigate('Home');
        },1000);

      }
  });
  }  




  render() {
    let that=this;
    let {serchValue,visible,dataList} = this.state;
    let {code,number,library,material,surplus,no}=this.state;
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


        <View style={{marginTop:22}}>
          <WisInput  
            value={library}             
            lableName="线边库"
            disabled
            extra={<Icon name="stop" />}
          />        
          <WisInput  
            value={material}             
            lableName="物料"
            disabled
            extra={<Icon name="stop" />}
          />          
        
          <WisInput  
            value={no}             
            lableName="料箱号"
            disabled
            extra={<Icon name="stop" />}
          /> 
          <WisInput  
            value={code}             
            lableName="目标点位"
            disabled
            extra={<Icon name="stop" />}
          />  

          <WisInput  
            value={surplus}             
            lableName="剩余数量"
            disabled
            extra={<Icon name="stop" />}
          />   
          <WisInput  
            type="number"
            {...getFieldProps('number',{
              rules:[{required:true}],
              initialValue:number
            })} 
            error={getFieldError('number')}               
            lableName="实际数量"
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

