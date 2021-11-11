import React, { Component } from 'react';
import { TouchableOpacity,Dimensions,StyleSheet, ScrollView, View,Text,Button   } from 'react-native';
import { Icon,InputItem,WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 
import {WisCameraComponent,WisTableCross} from '@wis_component/ul';
import {WisFormText} from '@wis_component/form';   // form 


// 退货 管理
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      visible: false,  // 显示扫码
      // serchValue:"IVC-2012210004", // 查询框
      serchValue:"", // 查询框

      // serchValue:"", // 查询框

      invoiceId:'',  // ID 
      buffer_status:'',

      code:"",  // 送货单号
      shipTime:"",  // 发货时间
      supplierName:"",  // 供应商
      arrivalTime:"",  // 到货日期
      dischargeResponsiblePerson:"",  // 卸货负责人
      unloadingTelephone:"",  // 卸货口电话
      warehouseName:"",  // 仓库
      status:"",  // 状态



      columns:[
        {
          label:"行号",
          key:"lineCode"
        },
        {
          label:"物料",
          render:(row)=>{
            return `${row["materialCode"]}-${row["materialName"]}`;
          }
        },
        {
          label:"需求数",
          key:"requiredQuantity"
        },
        {
          label:"发货数",
          key:"sendQuantity"
        },                       
        {
          label:"收货数",
          flex:3,
          render:(row)=>{
            // 已发货可以 其它不可以
            if(row["buffer_status"]=="RELEASED"){
              return (
                <View style={{flexDirection:"row"}}>
                  <TouchableOpacity onPress={()=> this.minusHandle(row) } >
                    <View style={{paddingTop:12}}><Icon color="#13c2c2" name="minus" /></View>
                  </TouchableOpacity>

                  <InputItem
                    style={{fontSize:14,textAlign:"center",paddingLeft:12,width:70,borderRadius:6,borderWidth:0.7,borderColor:"#e9e9e9"}}
                    maxLength={8}
                    // type="number"
                    last={true}
                    value={String(row["_num"])}
                    onChange={value => {
                      this.numChange(value,row);
                    }}
                    // placeholder="无标签"
                  />
                  <TouchableOpacity onPress={()=> this.addHandle(row) }>
                    <View style={{paddingTop:12}}><Icon color="#13c2c2" name="plus" /></View>
                  </TouchableOpacity>
                </View>
              );
            }

            return (
              <View><Text>{row["_num"]}</Text></View>
            );
          },
        },        
      ],
      dataList:[]

    }
  }
  componentDidMount(){

  }

  /**
   * 清空
   */
  clearHandle(){
    // 清空
    this.setState({
      code:"",  // 送货单号
      shipTime:"",  // 发货时间
      supplierName:"",  // 供应商
      arrivalTime:"",  // 到货日期
      dischargeResponsiblePerson:"",  // 卸货负责人
      unloadingTelephone:"",  // 卸货口电话
      warehouseName:"",  // 仓库
      status:"",  // 状态
      buffer_status:"",
      dataList:[]
    });
  }

  /**
   * 页面 初始化
   * @param {}  
   */
  getInitFunc(val=''){

    let that=this;
    let {serchValue}=this.state;

    this.clearHandle();

    WISHttpUtils.post("api-supply/srm/invoice/load",{
      params:{
        code: String(val||serchValue).trim()
      }
    },(result) => {

      // console.log(result);

      //无数据
      // if( result["id"] == null ){
      //   Toast.offline('数据为空！',1);
      // }


      var data=result["data"];
      var text="";

      // data["status"]="RECEIVED_ALL";

      switch (data["status"]) {
        case "DRAFT":
          text="草稿"
          break;
        case "RELEASED":
          text="已发货"
          break;
        case "RECEIVED_ALL":
          text="收货完成"
          break;
        case "CANCELLED":
          text="已取消"
          break;
        case "RECEIVED_PORTION":
          text="部分收货"
          break;                          
        case "RETURNED":
          text="已退货"
          break;   
      
        default:
          break;
      }


      that.setState({
        invoiceId:data["id"],  // ID 
        code:data["code"],  // 送货单号
        shipTime:data["shipTime"],  // 发货时间
        supplierName:data["supplierName"],  // 供应商
        arrivalTime:data["arrivalTime"],  // 到货日期
        dischargeResponsiblePerson:data["dischargeResponsiblePerson"],  // 卸货负责人
        unloadingTelephone:data["unloadingTelephone"],  // 卸货口电话
        warehouseName:data["warehouseName"],  // 仓库
        status:text,  // 状态
        buffer_status:data["status"],

        dataList:(data["details"]).map((o,index)=>Object.assign({},o,{buffer_status:data["status"],_num:o["sendQuantity"],_index_key:index}))
      });

    });

  }

  /**
   * 
   * 改变
   */
  numChange(value,row){
    let {dataList}=this.state;
    let newNum=Number(value);

    dataList.map(o=>{
      if(o["_index_key"]==row["_index_key"]){
        if(newNum){
          o["_num"]=newNum;
        }

        if(!newNum || newNum<=0){
          o["_num"]=0;
        }

        if(newNum>=o["sendQuantity"]){
          o["_num"]=o["sendQuantity"];
        }
      }
    });

    this.refs.tableRef.updateTable();
  }

  /**
   * 增加
   */
  addHandle(row){
    let {dataList}=this.state;

    dataList.map(o=>{
      if(o["_index_key"]==row["_index_key"]){
        if( o["_num"]<o["sendQuantity"] ) o["_num"]+=1;
      }
    });

    this.refs.tableRef.updateTable();
  }

  /**
   * 减少
   */
  minusHandle(row){
    let {dataList}=this.state;

    dataList.map(o=>{
      if(o["_index_key"]==row["_index_key"]){
        if(o["_num"]) o["_num"]-=1;
      }
    });

    this.refs.tableRef.updateTable();
  }

  /**
   * 查询
   */
  serchHandle(){
    this.getInitFunc();
  }

  /**
   * 全局的 扫描
   */
  globalScan(){
    this.setState({
      visible:true
    });
  }

  // 关闭 扫码
  closeCamera(){
    this.setState({
        visible:false
    });       
  } 

  // 扫码 完成
  onRead(option){
    // "type": "EAN_13"}  条码
    // option 是拿到的 数据
    this.setState({
      serchValue:option["data"],  // 结果
      visible:false
    });   

    this.getInitFunc(option["data"]);
  }  

  /**
   * 收货
   */
  takeDeliveryHandle(){
    let that=this;
    let {invoiceId,dataList}=this.state;

    let json={};
    dataList.map(o=>json[o["id"]]=o["_num"]);

    WISHttpUtils.post("api-supply/srm/receiptDetail/delivery",{
      params:{
        invoiceId: invoiceId,
        items:JSON.stringify(json),
      }
    },(result) => {
      Toast.success(result["message"],1);

      // 清空数据
      that.setState({

        serchValue:"", // 查询框
        buffer_status:'',
        code:"",  // 送货单号
        shipTime:"",  // 发货时间
        supplierName:"",  // 供应商
        arrivalTime:"",  // 到货日期
        dischargeResponsiblePerson:"",  // 卸货负责人
        unloadingTelephone:"",  // 卸货口电话
        warehouseName:"",  // 仓库
        status:"",  // 状态

        dataList:[],
      });
    });
  }

  render() {
    let that=this;
    let {serchValue,visible,columns,dataList} = this.state;
    let {buffer_status,status,code,shipTime,supplierName,arrivalTime,dischargeResponsiblePerson,unloadingTelephone,warehouseName}=this.state;
    let {navigation} = this.props;

    return (
        <ScrollView style={{backgroundColor:"#fff"}}>
          
          { visible ?
            <WisCameraComponent 
                onClose={()=> this.closeCamera() }
                onRead={(option)=> this.onRead(option) }
            />
            :
            <View></View>
          }           
          
          <View style={styles.headContainer}>
            <View style={{flex:1}}>
              <InputItem
                last={true}
                
                // type="number"
                value={serchValue}
                onChange={value => {
                  this.setState({
                    serchValue: value,
                  });
                }}
                placeholder="请扫描..."
              />
            </View>
            <TouchableOpacity onPress={() => this.serchHandle() }>
              <View style={styles.headIcon}>
                <Icon name="search" size={30} color="#009966" />
              </View> 
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.globalScan() }>
              <View style={styles.headIcon}>
                <Icon name="scan" size={30} color="#009966" />
              </View>  
            </TouchableOpacity>
          </View>
          <View style={{marginTop:12}}>    
            <WisFormText 
              children={[
                {
                  label:"送货单号",
                  content:code
                },
                {
                  label:"发货时间",
                  content:shipTime
                },
                {
                  label:"供应商",
                  content:supplierName
                },
                {
                  label:"到货日期",
                  content:arrivalTime
                },
                {
                  label:"卸货负责人",
                  content:dischargeResponsiblePerson
                },
                {
                  label:"卸货口电话",
                  content:unloadingTelephone
                },
                {
                  label:"仓库",
                  content:warehouseName
                },
                {
                  label:"状态",
                  content: status
                }                                                                  
              ]}
            />
          </View> 


          <WisTableCross
            ref="tableRef"  
            height={210}   
            columns={columns} // columns 配置列  
            data={dataList}
          />

          {/* 已发货可以 其它不可以 */}
          { buffer_status=="RELEASED" ?
            <WisButtonFloat 
              children={[
                {
                  text:"收货",
                  onPress:(option)=>{
                    this.takeDeliveryHandle();
                  }
                }
              ]}
            /> 
            :
            <View></View>
          }

                    

        </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  headContainer:{
    flexDirection:'row',
    paddingTop:18,
    paddingBottom:2,
    backgroundColor:"white",
    borderBottomWidth:1,
    borderColor:"#e9e9e9",


    // justifyContent:'space-between',
    // paddingLeft:12,
    // paddingRight:12
    
  },
  headIcon:{
    paddingLeft:10,
    paddingRight:10
  }
});



export default PageForm;

