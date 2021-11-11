import React, { Component } from 'react';
import { DeviceEventEmitter,Dimensions,StyleSheet, ScrollView, View,Text,Button   } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 

import AsyncStorage from '@react-native-async-storage/async-storage';
import WISHttpUtils from '@wis_component/http'; 


// 采购计划  待下发
class PageForm extends Component {

  constructor(props) {
    super(props);

    this.state={
      textBtn:"",  // 按钮文字
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
              case "DRAFT":
                text="未下发"
                break;
              case "PUBLISHED":
                text="待确认"
                break;
              case "CONFIRMED":
                text="已确认"
                break;
            
              default:
                break;
            }

            return row.createTime+"   "+ text;            
          }
        },
        // {
        //   label:"状态",
        //   render:(row)=>{

        //     var text="";  // 状态
            
        //     switch (row["status"]) {
        //       case "DRAFT":
        //         text="未下发"
        //         break;
        //       case "PUBLISHED":
        //         text="待确认"
        //         break;
        //       case "CONFIRMED":
        //         text="已确认"
        //         break;
            
        //       default:
        //         break;
        //     }

        //     return text;
        //   },
        // }                  
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


  /**
   * 页面 初始化
   * @param {}  
   */
  getInitFunc(option={}){

    let that=this;

    // 判断用户类型
    AsyncStorage.getItem("user_type").then((option)=>{
      // 采购商 供应商   
      WISHttpUtils.post("api-supply/srm/plan/packagePlanData",{
        params:{
          "queryCondition[queryStatus]": (option=="procurement")?"DRAFT":"PUBLISHED",
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

  /**
   * 下发
   */
  issueFunc(){
    let that=this;
    let {dataList}=this.state;

    // 判断用户类型
    AsyncStorage.getItem("user_type").then((option)=>{
      WISHttpUtils.post("api-supply/srm/orderPlan/updateStatus",{
        params:{
          "status":(option=="procurement")?"PUBLISHED":"CONFIRMED",
          "id": JSON.stringify(dataList.map(o=>o["id"])),
        }
      },(result) => {
        that.getInitFunc();
      });
    });
  }


  render() {
    let that=this;
    let {currentPage,totalPage,textBtn} = this.state;
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
            //   return option["code"];
            // }}
            onChangePage={(option)=>{
              that.getInitFunc({
                offset:(option.targetPage-1)*10,
                currentPage:option["targetPage"]
              });
            }}
            onClickRow={(row)=>{
              navigation.navigate('procurementPlanDetails',{
                list:row['planDetails']||[],
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
                text: textBtn,
                onPress:(option)=>{
                  that.issueFunc();
                }
              }
            ]}
          />                

        </View>
    );
  }
}



export default PageForm;

