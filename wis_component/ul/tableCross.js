import React, { Component,useState } from 'react';
import { ScrollView,Dimensions,FlatList, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon, Button, Toast, Modal } from '@ant-design/react-native';
import CheckBox from '@react-native-community/checkbox';


// table 横向
class TableComponent extends Component {

  constructor(props) {
    super(props);

    this.state={
      data:[],  // 列表 数据
    };
  }


  /**
   * 更新 table
   */
  updateTable(){
    const {data=[]}=this.props;
    this.setState({
      data:data 
    });    
  }


  /**
   * 
   * @param {*} item row
   */
  renderItemHandle(item,index){
    const {columns=[]}=this.props;

    return (
      <View style={styles.tableBodyContent} key={String(index)}>
          { columns.map((o,i)=>{
            return (
              <View style={{flex:o["flex"]||1}} key={i}>
                  <Text style={{textAlign:"center"}}>
                    {
                       o["render"] ? o["render"](item,index) : (item[o["key"]])
                    }
                  </Text>
              </View>
            )
            })  
          }
          
      </View>
    );
  }

  render() {
    const {}=this.state;
    const {data,columns,height}=this.props;

    return (
      <View style={{backgroundColor:"#fff",marginBottom:8,paddingBottom:8}}>
        <View style={styles.tableHeadContent}>
        {
            columns.map((item,index)=>{
              return (
                <View style={{flex:item["flex"]||1}} key={index}>
                  <View>
                    <Text style={{fontWeight:"bold",textAlign:"center"}}>{item["label"]}</Text>
                  </View>
                </View>
              );
            })
          }
        </View>
        <ScrollView style={{height:height||100}}>
          {
            data.map((item,index)=>{
              return this.renderItemHandle(item,index);
            })
          }
        </ScrollView>
    </View>
    );
  }
}

const styles = StyleSheet.create({
  tableHeadContent:{
    flexDirection:"row",
    paddingTop:12,
    paddingBottom:8,
    borderBottomWidth:1,
    borderColor:"#e9e9e9",
    // backgroundColor:"red"
  },
  tableBodyContent:{
    flexDirection:"row",
    paddingTop:8,
    paddingBottom:8,
    borderBottomWidth:0.8,
    borderColor:"#e9e9e9",
  },
});

export default TableComponent;