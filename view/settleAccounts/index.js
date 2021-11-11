import React, { Component } from 'react';
import { DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text,Button   } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import AsyncStorage from '@react-native-async-storage/async-storage';


import WISHttpUtils from '@wis_component/http'; 


// 结算单
class PageForm extends Component {

  constructor(props) {
    super(props);


    let that=this;
    let statusList={};  //  结算单状态

    AsyncStorage.getItem("config_supply_entrys").then((option)=>{
      try{
        statusList=JSON.parse(option)["BILL_AUDIT_STATUS"]
      } catch (error) {
      } 
    }); 





    this.state={
      currentPage:1,
      totalPage:1,  
      columns:[
        {
          label:"供应商",
          render:(row)=>{
            return (row["supplierCode"]||"")+" - "+(row["supplierName"]||"");
          },
        },
        {
          label:"金额",
          render:(row)=>{
            return (row["billAmount"]);
          },
        },        
        {
          label:"发起时间",
          name:"createTime",
          render:(row)=>{
            return row.createTime+"   "+" "+ (statusList[row.status]||{})["zh_CN"];            
          }
        },
      ],
      dataList:[]
    }
  }
  componentDidMount(){
    let that=this;
    this.getInitFunc();

    // 刷新页面
    this.listener =DeviceEventEmitter.addListener('globalEmitter_settleAccounts_refresh',function(){
      that.getInitFunc();
    });


  }


  /**
   * 页面 初始化
   * @param {}  
   */
  getInitFunc(option={}){
    let that=this;

    // WISHttpUtils.post("api-supply/srm/order/waitReceived",{
    WISHttpUtils.post("api-supply/srm/billAudit/list",{
      params:{
        "queryCondition[code]":option["value"]||'',  // 
        // "queryCondition[queryAll]":"ALL",
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
            onSerchHandle={(value)=>{
              that.getInitFunc({
                value:value,
                offset:0,
                currentPage:1
              });
            }}             
            onChangePage={(option)=>{
              that.getInitFunc({
                offset:(option.targetPage-1)*10,
                currentPage:option["targetPage"]
              });
            }}
            onClickRow={(row)=>{
              navigation.navigate('settleAccountsDetails',{
                id:row["id"],
                row:row||{}
                // list:row['planDetails']||[],
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

