import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet, ScrollView, View,Text,   } from 'react-native';
import { Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {WisCameraComponent,WisTableCross} from '@wis_component/ul';
import {WisFormText} from '@wis_component/form';   // form 


// 生产尾箱操作 主页
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      product:"产品",   // 点位
      number:'11',  // 数量
    }
  }

  static propTypes = {
    form: formShape,
  };  

  componentDidMount(){

  }


  /**
   * 
   * @param {*} value 
   */
   printHandle=(value)=>{
    const {navigation} = this.props;


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

  /**
   * 确认
   */
  passHandle=(value)=>{
    const {navigation} = this.props;


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
    let {product,number}=this.state;
    let {navigation} = this.props;
    const {getFieldProps, getFieldError, isFieldValidating} = this.props.form;


    return (
      <ScrollView style={{padding:8,backgroundColor:"#fff"}}>
        
        <View style={{marginTop:22}}>
          <WisInput  
            {...getFieldProps('product',{
              rules:[{required:false }],
              initialValue:product
            })} 
            error={getFieldError('product')}               
            lableName="产品"
            disabled
          />

          <WisInput  
            type="number"
            {...getFieldProps('number',{
              rules:[{required:true}],
              initialValue:number
            })} 
            error={getFieldError('number')}               
            lableName="数量"
          />    


        </View>

        <View style={{marginTop:32}}>
          <Button onPress={this.printHandle}>打印条码</Button>
        </View>   
        <View style={{marginTop:12}}>
          <Button type="primary" onPress={this.passHandle}>确认</Button>
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

