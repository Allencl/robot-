import React, { Component } from 'react';
import { DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text } from 'react-native';
import { Button,InputItem,Steps,Icon,SegmentedControl,WingBlank,Card, DatePicker, List, Tag, WhiteSpace} from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisFormText,WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTableCross,WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 
import { Toast } from '@ant-design/react-native';


import WISHttpUtils from '@wis_component/http'; 

const Step = Steps.Step;

// 代办单据 详情
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
        buffer_config:{},  // 缓存数据
        base_config:{},    // 基本数据
        dataList:[],   // 列表数据
        approverList:[],  // 审批list


        type:"",
        time:"",
        company:"",


        valueInput:"",
        // list 
        columns:[  
          {
            label:"行号",
            key:"lineCode",
          },          
          {
            label:"物料",
            render:(row)=>{
              return `${row["materialCode"]}-${row["materialName"]}`;
            }

          },
          {
            label:"需求数",
            key:"requiredQuantity",
          },
          {
            label:"发货数",
            key:"sendQuantity",
          },
          {
            label:"退货数",
            key:"returnQuantity",
          },          
          {
            label:"订单编号",
            key:"orderCode",
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
    let row=this.props.route.params.routeParams["row"];

    // 缓存数据
    WISHttpUtils.post("api-supply/application/form/updateInput",{
      params:{
        id:row["id"]
      }
    },(result) => {
      that.setState({
        buffer_config:result["data"]||{}
      });

    });


    // 基本信息
    WISHttpUtils.post("api-supply/srm/invoice/updateInputByReturnId",{
      params:{
        id:row["sourceKey"]
      }
    },(result) => {
      that.setState({
        base_config:result["data"]||{}
      });
    });


    // 列表
    WISHttpUtils.post("api-supply/srm/invoiceDetailReturn/list",{
      params:{
        "queryCondition[invoiceReturnId]": row["sourceKey"],
        rows: 10,
        page: option["targetPage"]||1,
        offset: option["offset"]||0,
        limit: 10, 
      }
    },(result) => {
      that.setState({
        dataList:result["rows"]||[]
      });

    });


    // 审批历史
    WISHttpUtils.post("api-supply/application/detail/list",{
      params:{
        "queryCondition[formId]": row["id"],
        rows: 10,
        page: option["targetPage"]||1,
        offset: option["offset"]||0,
        limit: 10, 
      }
    },(result) => {
      that.setState({
        approverList:result["rows"]||[]
      });
    });
  }

  /**
   * 详情页面
   */
  getDetail(data){
    return(
      <View>
        <View><Text>{(data["operator"]||{})["account"]}</Text></View>
        <View><Text>{data["createTime"]}</Text></View>
    </View>);
  }

  /**
   * 驳回
   */
  rejectHandle(value){
    let {valueInput}=this.state;

    if(!valueInput){
      Toast.offline('审核意见必填！',1);
      return;
    }

    this.submitAjax(value);
  }

  /**
   * 通过
   */
  passHandle(value){
    this.submitAjax(value);
  }  


  /**
   * 通过 驳回 Ajax
   */
  submitAjax(action){
    let {buffer_config,valueInput}=this.state;
    let row=this.props.route.params.routeParams["row"];
    let {navigation} = this.props;


    WISHttpUtils.post("api-supply/application/form/approve",{
      params:{
        name: buffer_config["name"],
        id: buffer_config["id"],
        approveContent: valueInput,
        param: JSON.stringify({"detailReturns":[]}),
        sourceKey: row["sourceKey"],
        approveType: action,
        type: "invoiceReturn",
      }
    },(result) => {

      // console.log(result);
      // 成功
      if(result["success"]){
        Toast.success("操作成功！",1);
        navigation.navigate('voucher');
        setTimeout(()=>{
          DeviceEventEmitter.emit('globalEmitter_update_voucherList');
        },200);
      }else{
        Toast.offline(result["message"],1);
      }
    });

  }

  render() {
    let that=this;
    let {buffer_config,approverList,base_config,columns,dataList,type,time,company,valueInput} = this.state;
    let {navigation} = this.props;


    return (
        <ScrollView>
          {/* <View style={{height:700+([approverList]["length"]*100)}}>
           */}
          <View>
            <View>
              <View style={styles.title}>
                <Text style={styles.titleText}>送货单信息</Text>
              </View>
              <View>     
              <WisFormText 
                children={[
                  {
                    label:"送货单号",
                    content:base_config["code"]
                  },                
                  {
                    label:"发货时间",
                    content:base_config["shipTime"]
                  },                
                  {
                    label:"供应商",
                    content:base_config["supplierName"]
                  },
                  {
                    label:"到货日期",
                    content:base_config["arrivalTime"]
                  },
                  {
                    label:"卸货负责人",
                    content:base_config["dischargeResponsiblePerson"]
                  },
                  {
                    label:"卸货口电话",
                    content:base_config["unloadingTelephone"]
                  },
                  {
                    label:"仓库",
                    content:base_config["warehouseName"]
                  }                                                                            
                ]}
              />
            </View> 
            </View>

            <View style={{marginTop:8}}>
              <View style={styles.title}>
                <Text style={styles.titleText}>退货明细</Text>
              </View>
              <WisTableCross
                ref="tableRef"  
                // height={200}   
                columns={columns} // columns 配置列  
                data={dataList}
              />
            </View>


            <View style={styles.title}>
              <Text style={styles.titleText}>审批历史</Text>
            </View>
            <View style={{paddingLeft:12,paddingRight:12,paddingTop:12,backgroundColor:"#fff"}}>
              <Steps current={1}>
                  { approverList.map((o,index)=>{
                    var text="";  // 状态
                    
                    switch (o["operate"]) {
                      case "SUBMIT":
                        text="提交申请"
                        break;
                      case "PASS":
                        text="审核通过"
                        break;
                      case "REFUSE":
                        text="驳回"
                        break;
                    
                      default:
                        break;
                    }

                    return(
                      <Step
                        key={Number(index)}
                        title={text}
                        description={this.getDetail(o)}
                        status="finish"
                      />
                    );
                  })
                  }                
                </Steps>
            </View>
            <View style={styles.inputBox}>
              <InputItem
                labelNumber={5}
                value={this.state.valueInput}
                onChange={valueInput => {
                  this.setState({
                    valueInput,
                  });
                }}
                placeholder="驳回时必须填写审核意见！"
              >
                审核意见:
              </InputItem>
            </View>
            <View style={styles.footer}>
              {/* historyStatus==REFUSE ? 采购商 : 供应商 */}
              { buffer_config["historyStatus"]=="REFUSE" ?
                <View>
                  <Button onPress={()=> this.rejectHandle("SUBMIT") } style={{width:120,backgroundColor:"#13c2c2"}}>
                    <Text style={{color:"#fff"}}>拒绝</Text>
                  </Button>
                </View> 
                :
                <View style={{width:120}}>
                  <Button onPress={()=> this.rejectHandle("REFUSE") } type="warning">
                    <Text style={{color:"#fff"}}>退回</Text>
                  </Button>
                </View>
              }

          
              { buffer_config["historyStatus"]=="REFUSE" ?  
                <View>
                  <Button onPress={()=> this.passHandle("CLOSE") } style={{width:120,backgroundColor:"#13c2c2"}}>
                    <Text style={{color:"#fff"}}>同意</Text>
                  </Button>
                </View> 
                :
                <View>
                  <Button onPress={()=> this.passHandle("PASS") } style={{width:120,backgroundColor:"#13c2c2"}}>
                    <Text style={{color:"#fff"}}>通过</Text>
                  </Button>
                </View>   
              }            
            </View>

          </View>
        </ScrollView>       

    );
  }
}

const styles = StyleSheet.create({
  footer:{
    paddingLeft:32,
    paddingRight:32,
    paddingTop:16,
    paddingBottom:16,
    backgroundColor:"#fff",
    flexDirection: "row",
    justifyContent:'space-between',
  },
  inputBox:{
    backgroundColor:"#fff",
    paddingTop:12,
    paddingBottom:12    
  },
  title:{
    backgroundColor:"#fff",
    paddingTop:12,
    paddingLeft:12,
    paddingBottom:12
  },
  titleText:{
    fontSize:16,
    fontWeight:"bold"
  }
});


export default PageForm;

