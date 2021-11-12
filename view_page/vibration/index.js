import React, { Component } from 'react';
import { DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text, ImageBackground   } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,Button  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import AsyncStorage from '@react-native-async-storage/async-storage';


import WISHttpUtils from '@wis_component/http'; 


// 振动盘 退料 主页
class PageForm extends Component {

  constructor(props) {
    super(props);


    this.state={
      columns:[
        {
          label:"线边库",
          render:(row)=>{
            return (row["supplierCode"]||"");
          },
        },
        {
          label:"剩余数量",
          render:(row)=>{
            return (row["billAmount"]);
          },
        },        
        {
          label:"物料",
          name:"createTime",
          render:(row)=>{
            return row.createTime;            
          }
        },
      ],
      dataList:[]
    }
  }
  componentDidMount(){
    let that=this;
    
    setTimeout(()=>{
      this.getInitFunc();
    },300);
  }


  /**
   * 页面 初始化
   * @param {}  
   */
  getInitFunc(option={}){
    let that=this;

    WISHttpUtils.post("api-supply/srm/billAudit/list",{
      params:{
        "queryCondition[status]":that.isFinancing?"FINANCIALAPPROVAL":"RELEASED",
        rows: 10,
        page: option["targetPage"]||1,
        offset: option["offset"]||0,
        limit: 10, 
      }
    },(result) => {

      that.setState({
        dataList: result.rows||[]
      });

      // 刷新table 
      that.refs.tableRef.updateTable();
    });
  }

  /**
   * 
   * @param {*} value 
   */
   AGVHandle=(value)=>{

    Toast.success("操作成功！");
  }

  /**
   * 退料
   */
   returnHandle=(value)=>{
    const {navigation} = this.props;

    navigation.navigate('vibrationDetails',{

    });     

  }  


  render() {
    let that=this;
    let {navigation} = this.props;

    return (
      <ScrollView style={styles.container}>
        <WisTable 
          ref="tableRef"     
          checkBox={true}         
          currentPage={1}   // 当前页
          totalPage={1}       // 总页数
          pageBox={false}
          height={400}
          columns={this.state.columns} // columns 配置列
          data={this.state.dataList}  // table 数据     
          onCheckChange={(list)=>{   // 选中的数据
            // console.log(list)
          }}        
          // onClickRow={(row)=>{
          //   navigation.navigate('vibrationDetails',{
          //     id:row["id"],
          //     row:row||{}
          //   }); 
          // }}
        />

        <View style={{marginTop:12}}>
          <Button onPress={this.AGVHandle}>呼叫AGV</Button>
        </View> 

        <View style={{marginTop:12}}>
          <Button type="primary" onPress={this.returnHandle}>退料</Button>
        </View>  

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#fff',
    padding:8
  }
});

export default PageForm;

