import React, { Component } from 'react';
import { DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text,Button   } from 'react-native';
import { SegmentedControl,WingBlank,Card, DatePicker, List, Tag, WhiteSpace, Toast,  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisFormText,WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTableCross,WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 



// 采购订单 详情
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
            label:"行号",
            key:"itemCode",
          },          
          {
            label:"物料信息",
            render:(row)=>{
              return `${row["materialCode"]}-${row["materialName"]}`;
            }

          },
          {
            label:"需求数量",
            key:"amount",
          },
          {
            label:"单位",
            key:"unit",
          },
          {
            label:"要求到货日期",
            key:"date",
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
  async getInitFunc(option={}){

    let list=this.props.route.params.routeParams["list"];
    let row=this.props.route.params.routeParams["row"];


    this.setState({
      type:row["purchaseGroupName"]||"",
      time:row["createTime"]||"",
      company:row["companyName"]||"",
      dataList:list||[]
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
                  label:"采购组",
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
            height={300}   
            columns={columns} // columns 配置列  
            data={dataList}
          />

        </View>


    );
  }
}




export default PageForm;

