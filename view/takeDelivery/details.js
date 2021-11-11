import React, { Component } from 'react';
import { DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text,Button   } from 'react-native';
import { SegmentedControl,WingBlank,Card, DatePicker, List, Tag, WhiteSpace, Toast,  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisFormText,WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTableCross,WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 



// 代办单据 详情
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
        type:"",
        time:"",
        company:"",

        // list 
        columns:[          
          {
            label:"物料信息",
            render:(row)=>{
              return `${row["materialCode"]}-${row["materialName"]}`;
            }
          },
          {
            label:"需求数",
            key:"requiredQuantity",
          },
          {
            label:"收货数",
            key:"receiveQuantity",
          },          
          {
            label:"待收数",
            // key:"sendQuantity",
            render:(row)=>{
              return (row["requiredQuantity"]||0)-(row["receiveQuantity"]||0);
            }
          },
          {
            label:"要求到货日期",
            key:"requestedArrivalDate",
          }        
        ],
        dataList:[]
      }
  }
  componentDidMount(){
    this.getInitFunc();  // 初始化列表
  }


  /**
   * 页面 初始化 列表
   * @param {}  
   */
  getInitFunc(option={}){

    let that=this;
    let ID=this.props.route.params.routeParams["id"];
    let row=this.props.route.params.routeParams["row"];

    // console.log(row);
    // 
    // WISHttpUtils.post("api-supply/srm/invoiceDetail/list?queryCondition%5BinvoiceId%5D="+ID,{
    WISHttpUtils.post("api-supply/srm/orderDetail/list.do?queryCondition%5BorderId%5D="+ID,{
      params:{
        // "queryCondition[status]": "RELEASED",
        rows: 10,
        page: option["targetPage"]||1,
        offset: option["offset"]||0,
        limit: 100, 
      }
    },(result) => {

      that.setState({
        type:row["code"]||"",
        time:row["createTime"]||"",
        // company:row["supplierName"]||"",
        company:row["companyName"]||"",
        dataList:result["rows"]||[]
      });


    });




  }

 

  render() {
    let that=this;
    let {columns,dataList,type,time,company} = this.state;
    let {navigation} = this.props;


    return (
        <View style={{height:Dimensions.get('window').height-131}}>

          <View style={{paddingTop:12}}>     
            <WisFormText 
              children={[
                {
                  // label:"采购组",
                  label:"采购订单号",
                  content:type
                },                
                {
                  label:"创建时间",
                  content:time
                },                
                {
                  label:"公司",
                  content:company
                }
              ]}
            />
          </View> 

          <WisTableCross
            ref="tableRef"  
            height={330}   
            columns={columns} // columns 配置列  
            data={dataList}
          />

        </View>


    );
  }
}




export default PageForm;

