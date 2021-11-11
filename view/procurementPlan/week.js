import React, { Component } from 'react';
import { Dimensions,StyleSheet, ScrollView, View,Text,Button   } from 'react-native';
import { WingBlank, DatePicker, List, Tag, WhiteSpace, Toast,  } from '@ant-design/react-native';

import { createForm, formShape } from 'rc-form';
import { WisInput, WisFormHead, WisDatePicker, WisTextarea,WisCamera } from '@wis_component/form';   // form 
import { WisTable,WisButtonFloat } from '@wis_component/ul';   // ul 


import WISHttpUtils from '@wis_component/http'; 


// 采购计划 本周
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
      ],
      dataList:[]
    }
  }
  componentDidMount(){
    this.getInitFunc();
  }


  /**
   * 页面 初始化
   * @param {}  
   */
  async getInitFunc(option={}){

    let that=this;

    
    // WISHttpUtils.post("api-supply/srm/plan/list",{
    WISHttpUtils.post("api-supply/srm/plan/packagePlanData",{
      params:{
        "queryCondition[queryCurrentWeek]": "WEEK",
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
            navigation.navigate('procurementPlanDetails',{
              list:row['planDetails']||[],
              row:row||{}
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

