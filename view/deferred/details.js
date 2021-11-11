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
          // {
          //   label:"行号",
          //   key:"itemCode",
          // },          
          {
            label:"物料信息",
            render:(row)=>{
              return `${row["materialCode"]}-${row["materialName"]}`;
            }
          },
          {
            label:"需求数量",
            key:"requiredQuantity",
          },
          {
            label:"仓库",
            key:"warehouseName",
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
    let row=this.props.route.params.routeParams["row"];

    WISHttpUtils.post("api-supply/srm/orderDetail/list",{    
      params:{
        "queryCondition[orderId]": row["id"],
        rows: 10,
        page: option["targetPage"]||1,
        offset: option["offset"]||0,
        limit: 10, 
      }
    },(result) => {
        console.log(result);

        this.setState({
          type:row["typeName"]||"",
          time:row["createTime"]||"",
          company:row["companyName"]||"",
          dataList: result["rows"]||[]
        });

    });


    // this.setState({
    //   type:row["purchaseGroupName"]||"",
    //   time:row["createTime"]||"",
    //   company:row["companyName"]||"",
    //   dataList:list||[]
    // });
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
                  label:"订单类型",
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

