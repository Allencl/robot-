import React, { Component } from 'react';
import { DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text, Button} from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import AsyncStorage from '@react-native-async-storage/async-storage';


import WISHttpUtils from '@wis_component/http'; 


// 待下发结算源 all
class PageForm extends Component {

  constructor(props) {
    super(props);

    let that=this;

    AsyncStorage.getItem("config_supply_entrys").then((option)=>{
      try{
        that.statusList=JSON.parse(option)["BILL_SOURCE_DETAIL_STATUS"];
        that.currencyList=JSON.parse(option)["CURRENCY_TYPE"];
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
            return row["supplierCode"]+"-"+row["supplierName"];
          },
        },
        {
          label:"金额",
          render:(row)=>{
            return row["amount"];
          },
        },  
        {
          label:"货币",
          render:(row)=>{  
            return (that.currencyList[row.currencyType]||{})["zh_CN"];
          },
        },  
        {
          label:"税率",
          render:(row)=>{
            return row["taxRate"]+" %";
          },
        },                      
        {
          label:"创建日期",
          name:"createTime",
          render:(row)=>{
            return row.createTime+" "+(that.statusList[row.status]||{})["zh_CN"];            
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
    this.listener =DeviceEventEmitter.addListener('globalEmitter_waitClose_refresh',function(){
      that.getInitFunc();
    });


  }


  /**
   * 页面 初始化
   * @param {}  
   */
  async getInitFunc(option={}){

    let that=this;

    // WISHttpUtils.post("api-supply/srm/order/list.do",{
    WISHttpUtils.post("api-supply/srm/billSource/listTobeDown",{    
      params:{
        // "queryCondition[code]":option["value"]||'',  // 
        // "queryCondition[queryAll]":"ALL",
        rows: 10,
        page: option["targetPage"]||1,
        offset: option["offset"]||0,
        limit: 10, 
      }
    },(result) => {

      // console.log(result);
      that.setState({
        currentPage:result.currentPage,
        totalPage:result.totalPage,
        dataList: result.rows||[]
      });

      // 刷新table 
      that.refs.tableRef.updateTable();
    });
  }


  /**
   * 下发
   */
   issueFunc(){
    let that=this;
    let {dataList} = this.state;

    WISHttpUtils.post("api-supply/srm/billSource/publish.do",{
      params:{
        ids: `[${ dataList.map(o=>o["id"]).toString() }]`,
      }
    },(result) => {
      // console.log(result);
      Toast.success('操作成功！',1);

      setTimeout(() => {
        that.getInitFunc();
      },200);
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
            placeholder="请输入订单号..."
            headLeftText={(option)=>{
              return option["billCertificate"];
            }}                
            // headRightText={(option)=>{
            //   return "2012年11月11";
            // }}
            // onSerchHandle={(value)=>{
            //   that.getInitFunc({
            //     value:value,
            //     offset:0,
            //     currentPage:1
            //   });
            // }}            
            onChangePage={(option)=>{
              that.getInitFunc({
                offset:(option.targetPage-1)*10,
                currentPage:option["targetPage"]
              });
            }}
            onClickRow={(row)=>{
              // console.log(row);
              navigation.navigate('waitCloseDetail',{
                id:row["id"],
                row:row||{}
              }); 
            }}
            onRefresh={()=>{
              that.getInitFunc();
            }}
          />


          <WisButtonFloat 
            children={[              
              {
                text:'下发',
                onPress:(option)=>{
                  that.issueFunc();
                }
              },
             
            ]}
          />



        </View>
    );
  }
}



export default PageForm;

