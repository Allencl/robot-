import React, { Component } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import { Button, TextareaItem, List, Icon } from '@ant-design/react-native';


// 多行输入
class TextareaComponent extends Component{
    render() {
        const {onChangeValue,lableName,disabled,required=false}=this.props;

        return (
            <View style={styles.textarea}>
                <Text style={styles.textareaText}>{lableName}</Text>
                <View style={styles.textareaBox}>
                    <TextareaItem
                        rows={5} 
                        {...this.props}
                        style={disabled?styles.isDisabled:{}}
                        disabled={disabled}
                        placeholder={disabled?"":"请输入..."}
                        style={styles.textarea}
                        autoHeight
                        onChangeText={(val)=>{
                            if(onChangeValue) onChangeValue(val);
                        }}                          
                    />
                </View>                       
            </View>
        );
    }
    
}


const styles=StyleSheet.create({
    textareaBox:{
        borderWidth:1,
        borderColor:'#ccc',
        borderRadius:3

    },
    textarea:{
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:12
    },
    textareaText:{
        fontSize:17,
        color:"#000",
        // paddingLeft:15,
        paddingTop:11,
        paddingBottom:11
    },
    isDisabled:{
        color:"#ccc",
        backgroundColor:"white"
    },
  });


export default TextareaComponent;
  
