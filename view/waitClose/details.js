import React, { Component } from 'react';
import { DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text,Button   } from 'react-native';
import { SegmentedControl,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisFormText,WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat,WisTableCross } from '@wis_component/ul';   // ul 

import AsyncStorage from '@react-native-async-storage/async-storage';
import WISHttpUtils from '@wis_component/http'; 


// 待下发结算源 详情
class PageForm extends Component {

  constructor(props) {
    super(props);

    let that=this;

    AsyncStorage.getItem("config_supply_entrys").then((option)=>{
      try{
        that.sourceList=JSON.parse(option)["DATA_SOURCE_TYPE"];
        that.auditTypeList=JSON.parse(option)["AUDIT_TYPE"];
        that.currencyTypeList=JSON.parse(option)["CURRENCY_TYPE"];
        that.statusList=JSON.parse(option)["BILL_SOURCE_DETAIL_STATUS"];
      } catch (error) {
      } 
    }); 





    this.state={

        certificate:'',  // 结算凭证
        time:"",    // 过账日期
        company:"",  // 供应商
        type:"",     // 结算源类型
        way:"",     // 结算方式
        number:"",     // 订单编号
        material:"",     // 物料
        unit:"",     // 单位
        quantity:"",     // 数量
        price:"",     // 单价
        money:"",     // 金额
        currency:"",     // 货币
        rate:"",     // 税率
        status:"",     // 状态

      }
  }
  componentDidMount(){
    this.getInitFunc();  // 初始化
  }

  componentWillUnmount(){

  }


  /**
   * 初始化 
   */
  getInitFunc(){
    let that=this;
    let {row}=this.props.route.params.routeParams;
    let ID=this.props.route.params.routeParams["id"];

    // console.log(row);
    WISHttpUtils.post("api-supply/srm/billSource/getBillSourceDetail",{
      params:{
        id: ID,
      }
    },(result) => {

      // console.log(result);
      let row=result.data||{};
      that.setState({
   
        certificate:row["billCertificate"]||"",  // 结算凭证
        time:row["createTime"]||"",    // 过账日期
        company:(row["supplierCode"]||'')+"-"+(row["supplierName"]||''),  // 供应商
        type:(that.sourceList[row.source]||{})["zh_CN"],     // 结算源类型
        way:(that.auditTypeList[row.auditType]||{})["zh_CN"],     // 结算方式
        number:row["orderCode"]||"",     // 订单编号
        material:row["materialName"]||"",     // 物料
        unit:row["unit"]||"",     // 单位
        quantity:row["quantity"]||"",     // 数量
        price:row["unitPrice"]||"",     // 单价
        money:row["amount"]||"",     // 金额
        currency:(that.currencyTypeList[row.currencyType]||{})["zh_CN"],     // 货币
        rate:row["taxRate"]||"",     // 税率
        status:(that.statusList[row.status]||{})["zh_CN"],     // 状态
  
  
  
      });

    });





    

  }

  /**
   * 取消结算
  */
  cancelFunc(){
    let that=this;
    let ID=this.props.route.params.routeParams["id"];
    let {navigation} = this.props;


    WISHttpUtils.post("api-supply/srm/billSource/withdraw",{
      params:{
        ids: `[${ID}]`,
      }
    },(result) => {
      // console.log(result);
      Toast.success('操作成功！',1);
      navigation.navigate('waitClose');

      setTimeout(() => {
        DeviceEventEmitter.emit('globalEmitter_waitClose_refresh');
      },200);
    });
  }


  /**
   * 下发
   */
  issueFunc(){
    let that=this;
    let ID=this.props.route.params.routeParams["id"];
    let {navigation} = this.props;


    WISHttpUtils.post("api-supply/srm/billSource/publish.do",{
      params:{
        ids: `[${ID}]`,
      }
    },(result) => {
      // console.log(result);
      Toast.success('操作成功！',1);
      navigation.navigate('waitClose');

      setTimeout(() => {
        DeviceEventEmitter.emit('globalEmitter_waitClose_refresh');
      },200);
    });

  }  

  render() {
    let that=this;

    let {
      certificate,
      time,
      company,
      type,
      way,
      number,
      material,
      unit,
      quantity,
      price,
      money,
      currency,
      rate,
      status,
    }=this.state;

    let {navigation} = this.props;


    return (
        <View>
          <View>     
            <WisFormText  
              title="结算源明细"
              children={[
                {
                  label:"结算凭证",
                  content:certificate
                },                
                {
                  label:"创建日期",
                  content:time
                },                
                {
                  label:"供应商",
                  content:company
                },
                {
                  label:"结算源类型",
                  content:type
                },
                {
                  label:"结算方式",
                  content:way
                },
                {
                  label:"订单编号",
                  content:number
                },
                {
                  label:"物料",
                  content:material
                },
                {
                  label:"单位",
                  content:unit
                },
                {
                  label:"数量",
                  content:quantity
                },
                {
                  label:"单价",
                  content:price
                },
                {
                  label:"金额",
                  content:money
                },
                {
                  label:"货币",
                  content:currency
                },
                {
                  label:"税率",
                  content:rate+" %"
                },
                {
                  label:"状态",
                  content:status
                },                                                                                
              ]}
            />
          </View> 

          <WisButtonFloat 
            children={[
              {
                text:'取消结算',
                backgroundColor:'#f90',
                onPress:(option)=>{
                  that.cancelFunc();
                }
              },               
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

