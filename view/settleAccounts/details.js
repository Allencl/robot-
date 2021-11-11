import React, { Component } from 'react';
import { DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text, Appearance   } from 'react-native';
import { Icon,Steps,TextareaItem,Button,SegmentedControl,WingBlank,Card, DatePicker, List, Tag, WhiteSpace, Toast,  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisFormText,WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTableCross,WisCard,WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import AsyncStorage from '@react-native-async-storage/async-storage';


import WISHttpUtils from '@wis_component/http'; 

const Step = Steps.Step;


// 结算单 详情
class PageForm extends Component {

  constructor(props) {
    super(props);

    let that=this;

    AsyncStorage.getItem("config_supply_entrys").then((option)=>{
      try{
        that.statusList=JSON.parse(option)["BILL_AUDIT_STATUS"];
        that.invoiceStatusList=JSON.parse(option)["BILL_INVOICE_TYPE"];
        that.rebateStatusList=JSON.parse(option)["REBATE_TYPE"];
      } catch (error) {
      } 
    }); 

    

    this.state={
        odd:"",   // 单号
        address:"",   // 公司
        company:"",   // 地址
        phone:'',   // 电话
        bankName:'',  // 银行名称
        bankNameAccount:'',  // 银行账号
        time:'',   //发起时间
        status:'',   // 状态
        currency:'',   // 币种
        money:'',  // 金额
        moneyA:'',  // 金额 大写


        materialList:[],  // 物料
        claimList:[],   // 索赔
        fineList:[],  // 罚款
        rebateList:[],  // 返利
        invoiceList:[],  // 发票
        approveList:[],   // 审核

        inputValue:'',   // 提交 
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

    // console.log(ID);

    WISHttpUtils.post("api-supply/srm/billAudit/getBillAuditDetail",{

      params:{
        "biilAuditId": ID,
      }
    },(result) => {

      let data=result["data"]

      // console.log(data);
      that.setState({
        odd:data.baseInfo["code"]||"",
        address:data.baseInfo["address"]||"",
        company:data.baseInfo["companyName"]||"",
        phone:data.baseInfo["phone"]||"",   // 电话
        bankName:data.baseInfo["depositBank"]||"",  // 银行名称
        bankNameAccount:data.baseInfo["account"]||"",  // 银行账号
        time:data.baseInfo["createTime"]||"",   //发起时间
        status: ( (that.statusList[data.baseInfo.status]||{})["zh_CN"]) ||"",   // 状态
        currency:data.baseInfo["currency"]||"",   // 币种
        money:data.baseInfo["billAmount"]||"",  // 金额
        moneyA:data.baseInfo["billAmountBig"]||"",  // 金额 大写


        materialList:data.materialInfoList,
        claimList:data.claimInfoList,
        fineList:data.fineInfoList,
        rebateList:data.rebateInfoList,
        invoiceList:data.invoiceInfoList,
        approveList:data.approveInfoList
      });


    });




  }

  /**
   * 审核
   */
   auditHandle(active){
    let that=this;
    let {inputValue}=this.state;
    let ID=this.props.route.params.routeParams["id"];
    let {navigation} = this.props;


    WISHttpUtils.post("api-supply/application/form/billAuditApprove.do",{
      params:{
        billAuditId: ID,
        approveStatus:active,
        approveMemo:inputValue
      }
    },(result) => {
      // Toast.success(result["message"],1);
      Toast.success('操作成功！',1);
      navigation.navigate('settleAccounts');

      setTimeout(() => {
        DeviceEventEmitter.emit('globalEmitter_settleAccounts_refresh');
      },200);

    });
    
  }

  render() {
    let that=this;
    let {odd,address,company,phone,bankName,bankNameAccount,time,status,currency,money,moneyA} = this.state;
    
    let {materialList,claimList,fineList,rebateList,invoiceList,approveList}=this.state;
    let {navigation} = this.props;


    return (
        <ScrollView>

          <View style={{paddingTop:12}}>     
            <WisFormText 
              title="基本信息"
              children={[
                {
                  label:"结算单号",
                  content:odd
                },   
                {
                  label:"公司名称",
                  content:company
                },             
                {
                  label:"公司地址",
                  content:address
                },                
                {
                  label:"公司电话",
                  content:phone
                }, 
                {
                  label:"开户行名称",
                  content:bankName
                }, 
                {
                  label:"开户行账号",
                  content:bankNameAccount
                }, 
                {
                  label:"发起时间",
                  content:time
                }, 
                {
                  label:"审核状态",
                  content:status
                }, 
                {
                  label:"币种",
                  content:currency
                }, 
                {
                  label:"金额（含税）",
                  content:money
                },   
                {
                  label:"金额大写",
                  content:moneyA
                },                                                                                                               
              ]}
            />
          </View> 

          <WisCard 
            title="物料明细"
            body={
              <View>
                { materialList.map((o,index)=>
                  <View key={index}>
                    <WisFormText 
                      title={o["materialCode"]+"-"+o["materialName"]}
                      titleStyle={{color:'#003399'}}
                      extra={<View style={{flexDirection:"row"}}>
                        <Icon name="pay-circle" color="#003399" />
                        <Text style={{fontWeight:'bold',color:'#003399',paddingLeft:10,fontSize:16}}>{o["amount"]}</Text>
                      </View>}
                      children={[
                        {
                          label:"订单号",
                          content:o["orderCode"]
                        },   
                        {
                          label:"单价",
                          content:o["unitPrice"]
                        },             
                        {
                          label:"数量",
                          content:o["quantity"]
                        },                
                        {
                          label:"税率",
                          content:o["taxRate"]+" %"
                        }                                                                                                              
                      ]}
                    /> 
                  </View>               
                  )
                }
              </View>             
            }
          />


          <WisCard 
            title="抵扣信息"
            body={
              <View>
                { claimList.map((o,index)=>
                  <View key={index}>
                    <WisFormText 
                      title="索赔信息"
                      extra={<View style={{flexDirection:"row"}}>
                        <Icon name="pay-circle" color="#003399" />
                        <Text style={{fontWeight:'bold',color:'#003399',paddingLeft:10,fontSize:16}}>{o["untaxTotalAmount"]}</Text>
                      </View>}
                      children={[
                        {
                          type:"textarea",
                          style:{color:'#003399'},
                          content:o["claimNo"]
                        },  
                        {
                          type:"textarea",
                          style:{color:'#003399'},
                          content:o["reason"]
                        },                     
                        {
                          label:"索赔时间",
                          content:o["claimDate"]
                        },                   
                        {
                          label:"税率",
                          content:o["taxRate"]+" %"
                        }                                                                                                              
                      ]}
                    />
                  </View>
                )}
                { fineList.map((o,index)=>
                  <View key={index}>
                    <WisFormText 
                      title="罚款信息"
                      extra={<View style={{flexDirection:"row"}}>
                        <Icon name="pay-circle" color="#003399" />
                        <Text style={{fontWeight:'bold',color:'#003399',paddingLeft:10,fontSize:16}}>{o["untaxTotalAmount"]}</Text>
                      </View>}
                      children={[
                        {
                          type:"textarea",
                          style:{color:'#003399'},
                          content:o["fineNo"]
                        },  
                        {
                          type:"textarea",
                          style:{color:'#003399'},
                          content:o["reason"]
                        },                     
                        {
                          label:"罚款时间",
                          content:o["fineDate"]
                        },                   
                        {
                          label:"税率",
                          content:o["taxRate"]+" %"
                        }                                                                                                              
                      ]}
                    />
                  </View>
                )}
                { rebateList.map((o,index)=>
                  <View key={index}>
                    <WisFormText 
                      title="返利信息"
                      extra={<View style={{flexDirection:"row"}}>
                        <Icon name="pay-circle" color="#003399" />
                        <Text style={{fontWeight:'bold',color:'#003399',paddingLeft:10,fontSize:16}}>{o["rebateAmount"]}</Text>
                      </View>}
                      children={[
                        {
                          type:"textarea",
                          style:{color:'#003399'},
                          content: (that.rebateStatusList[o["rebateType"]]||{})["zh_CN"] 
                        },  
                        {
                          type:"textarea",
                          style:{color:'#003399'},
                          content:o["remark"]
                        },                     
                        {
                          label:"生效时间",
                          content:o["takeEffectDate"]
                        },                   
                      //  {
                      //     label:"税率",
                      //     content:o["taxRate"]
                      //   }                                                                                                               
                      ]}
                    />
                  </View>
                )}                
              </View>             
            }
          />      

          <WisCard 
            title="发票信息"
            body={
              <View>
                { invoiceList.map((o,index)=>
                  <View key={index}>
                    <WisFormText 
                      title={ (that.invoiceStatusList[o["type"]]||{})["zh_CN"]}
                      titleStyle={{color:'#990000'}}
                      extra={<View style={{flexDirection:"row"}}>
                        <Icon name="pay-circle" color="#990000" />
                        <Text style={{fontWeight:'bold',color:'#990000',paddingLeft:10,fontSize:16}}>{o["totalAmount"]}</Text>
                      </View>}
                      children={[
                        {
                          label:"发票代码",
                          content:o["code"]
                        },   
                        {
                          label:"开票日期",
                          content:o["billingDate"]
                        },             
                        {
                          label:"快递单号",
                          content:o["expressNumber"]
                        },   
                        {
                          label:"未税金额",
                          content:o["invoiceAmount"]
                        },
                        {
                          label:"税额",
                          content:o["taxAmount"]
                        },             
                        {
                          label:"税率",
                          content:o["taxRate"]+" %"
                        }                                                                                                              
                      ]}
                    />
                  </View>
                )}
              </View>             
            }
          />

          <WisCard 
            title="审核记录"
            body={
              <View style={{paddingTop:18}}>
                <WingBlank size="lg">
                  <Steps current={1}>
                    { approveList.map((o,index)=>
                      <Step
                        key={index}
                        status="finish"
                        title={
                          <View style={styles.headTitle}>
                            <Text style={{...styles.headTitleText,paddingRight:30}}>{o["approveTpye"]}</Text>
                            <Text style={styles.headTitleText}>{o["approveDate"]}</Text>
                          </View>
                        }
                        description={
                          <View style={styles.headTitleContent}>
                            <Text>{o["userName"]+": "+o["approveStatus"]}</Text>
                            <Text>{o["approveMemo"]}</Text>
                          </View>
                        }
                      />
                    )}
                  </Steps>
                </WingBlank>
              </View>         
            }
          />

          {/* <View>
            <TextareaItem 
              autoHeight
              placeholder="审核意见..." 
              onChangeText={(val)=>{
                that.setState({
                  inputValue:val
                });
              }}
            />
          </View>


          <View style={styles.btnbox}>  
            <Button type="warning" onPress={()=>this.auditHandle("REFUSE")}><Text>驳回</Text></Button>
            <Button type="primary" onPress={()=>this.auditHandle("PASS")}><Text>通过</Text></Button>
          </View> */}


        </ScrollView>


    );
  }
}

const styles=StyleSheet.create({
  headTitle:{
    flexDirection: "row",
    justifyContent:'space-between',    
  },
  headTitleText:{
    fontWeight:'bold',
    fontSize:16
  },  
  headTitleContent:{
    paddingTop:2
  },
  btnbox:{
    flexDirection: "row",
    justifyContent:'space-between',
    paddingLeft:22,
    paddingRight:22,
    paddingTop:30,
    paddingBottom:90,
    backgroundColor:'#fff'
  },
});


export default PageForm;

