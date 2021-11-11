import React, { Component } from 'react';
import { Dimensions,StyleSheet, ScrollView, View,Text,Button,DeviceEventEmitter   } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 


// 代办单据
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      currentPage:1,
      totalPage:1,   
      columns:[
        {
          label:"单据编号",
          name:"code",
        },
        // {
        //   label:"送货单号",
        //   name:"supplierCode",
        // },   
        {
          label:"单据类型",
          name:"typeDesc",
        },            
        {
          label:"创建时间",
          name:"createTime",
        },
      ],
      dataList:[]
    }
  }
  componentDidMount(){
    let that=this;
    this.getInitFunc();

    // 刷新
    this.updataPage=DeviceEventEmitter.addListener('globalEmitter_update_voucherList',function(){
      that.getInitFunc();  // 刷新
    });

  }

  componentWillUnmount(){
    this.updataPage.remove();
  }


  /**
   * 页面 初始化
   * @param {}  
   */
  async getInitFunc(option={}){
    let that=this;


    // WISHttpUtils.post("api-supply/srm/plan/list",{
    WISHttpUtils.post("api-supply/application/form/list",{
      params:{
        "queryCondition[type]": "invoiceReturn",
        "queryCondition[status]": "NORMAL",
        "queryCondition[ApproveForMe]":" Y",
        rows: 10,
        page: option["targetPage"]||1,
        offset: option["offset"]||0,
        limit: 10, 
      }
    },(result) => {
      that.setState({
        currentPage:result.currentPage,
        totalPage:result.totalPage,
        dataList: result.rows||[]
      });

      // 刷新table 
      that.refs.tableRef.updateTable();
    });
  }


  render() {
    let that=this;
    let {currentPage,totalPage} = this.state;
    let {navigation} = this.props;



    return (
        <View>
          <WisTable 
            ref="tableRef"     
            checkBox={false}          
            currentPage={currentPage}   // 当前页
            totalPage={totalPage}       // 总页数
            columns={this.state.columns} // columns 配置列
            data={this.state.dataList}  // table 数据
            headLeftText={(option)=>{
              return option["code"];
            }}                
            // headRightText={(option)=>{
            //   return "2012年11月11";
            // }}
            onChangePage={(option)=>{
              that.getInitFunc({
                offset:(option.targetPage-1)*10,
                currentPage:option["targetPage"]
              });
            }}
            onClickRow={(row)=>{
              navigation.navigate('vouchereDetail',{
                row:row||{}
              }); 
            }}
            onRefresh={()=>{
              that.getInitFunc();
            }}
          />
        </View>
    );
  }
}



export default PageForm;

