import React, { Component } from 'react';
import { DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text,Button   } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


// 采购订单 待下发
class PageForm extends Component {

  constructor(props) {
    super(props);

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
          label:"创建时间",
          name:"createTime",
          render:(row)=>{
            var text="";  // 状态
                                                                                
            switch (row["status"]) {
              case "RELEASED":
                text="待确认"
                break;
              case "CONFIRMED":
                text="待发货"
                break;
              case "CANCELLED":
                text="手工关闭"
                break;
              case "CLOSED":
                text="收货完成"
                break;
              case "INVOICED":
                text="已发货"
                break;    
              case "RETURN_ORDER":
                text="退料订单"
                break;                 
              case "DRAFT":
                text="草案"
                break;                
            
              default:
                break;
            }

            return row.createTime+"   "+ text;            
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
    this.listener =DeviceEventEmitter.addListener('globalEmitter_procurementOrder_refresh',function(){
      that.getInitFunc();
    });

  }

  componentWillUnmount(){
    this.listener.remove();
  }   

  /**
   * 页面 初始化
   * @param {}  
   */
  async getInitFunc(option={}){

    let that=this;

    // 判断用户类型
    AsyncStorage.getItem("user_type").then((option)=>{
      WISHttpUtils.post("api-supply/srm/order/packageOrderData",{    
        params:{
          "queryCondition[status]": (option=="procurement")?"DRAFT":"RELEASED",
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
              navigation.navigate('procurementIssue',{
                details:row["details"],
                row:row||{},
                isPending:true  // 待下发
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

