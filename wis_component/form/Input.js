import React, { Component } from 'react';
import { StyleSheet} from 'react-native';
import {InputItem} from '@ant-design/react-native';


// 文本框
class InputComponent extends Component{
    render() {
        const {onChangeValue,lableName,disabled,required=false}=this.props;

        return (
            <InputItem
                labelNumber={6}
                placeholder={disabled?"":"请输入..."}
                {...this.props}
                style={disabled?styles.isDisabled:{}}
                onChangeText={(val)=>{
                    if(onChangeValue) onChangeValue(val);
                }}                
                
            >
                {lableName}
            </InputItem>
        );
    }
    
}


const styles=StyleSheet.create({
    isDisabled:{
        color:"#ccc",
        backgroundColor:"white"
    },
  });


export default InputComponent;
  
