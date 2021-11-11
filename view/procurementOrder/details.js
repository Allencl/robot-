import React, { Component } from 'react';
import { DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text,Button   } from 'react-native';
import { SegmentedControl,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisFormText,WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat,WisTableCross } from '@wis_component/ul';   // ul 

import AsyncStorage from '@react-native-async-storage/async-storage';
import WISHttpUtils from '@wis_component/http'; 


// 采购订单 详情
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
        isPending:false,  // 待下发 页面

        type:"",
        time:"",
        company:"",


        textBtn:'',

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

    let that=this; 

    // 判断用户类型
    AsyncStorage.getItem("user_type").then((option)=>{
      that.setState({
        textBtn:(option=="procurement")?"下发":"确认"
      });
    });

    this.getInitFunc();  // 初始化
  }

  componentWillUnmount(){

  }


  /**
   * 初始化 
   */
  getInitFunc(){
    let that=this;


    let {isPending,details,row}=this.props.route.params.routeParams;
    // console.log(row);

    this.setState({
      isPending:isPending?true:false, 
      type:row["typeName"]||"",
      time:row["createTime"]||"",
      company:row["companyName"]||"",
      dataList:details
    });
    

  }




  /**
   * 下发
   */
  issueFunc(){
    let that=this;
    const {navigation} = that.props;
    let row=this.props.route.params.routeParams["row"];

    // 判断用户类型
    AsyncStorage.getItem("user_type").then((option)=>{
      // textBtn:(option=="procurement")?"下发":"确认"
      WISHttpUtils.post( ((option=="procurement") ?
          "api-supply/srm/order/publish"
          :
          "api-supply/srm/order/confirm"
        ),{
        params:{
          "ids":"["+row.id+"]",
        }
      },(result) => {

        navigation.navigate('procurementOrderPending');
        setTimeout(() => {
          DeviceEventEmitter.emit('globalEmitter_procurementOrder_refresh');
        },200);
        // console.log(111);
        // console.log(result);
        // // 跳转至 列表
        // if( result["success"]){
        //   navigation.navigate('procurementOrderPending');
        //   DeviceEventEmitter.emit('globalEmitter_procurementOrder_refresh');
        // }
      });


    });


  }  

  render() {
    let that=this;

    let {company,time,type,textBtn,columns,dataList,isPending} = this.state;
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
            height={300}   
            columns={columns} // columns 配置列  
            data={dataList}
          />

          { isPending ?
            <WisButtonFloat 
              children={[
                {
                  text:textBtn,
                  onPress:(option)=>{
                    that.issueFunc();
                  }
                }
              ]}
            />
            :
            <View></View>
          }


        </View>


    );
  }
}




export default PageForm;

