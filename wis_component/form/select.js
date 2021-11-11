import React, { Component } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import {List,Picker} from '@ant-design/react-native';




// 下拉框
class SelectComponent extends Component{

    constructor(props) {
        super(props);

        this.state={
            value:''
        };
    }  
    
    onChange(value){
        let{name,form,onChangeValue}=this.props;
        if(name&&form){
            this.props.form.setFieldsValue({
                [name]: value[0],
            });
        }

        this.setState({value:value});

        if(onChangeValue) onChangeValue(value[0]);
    }



    render() {
        const {value}=this.state;
        const {defaultValue,form={},name='',childrenList=[],lableName="",disabled,required=false}=this.props;
        let{getFieldError,getFieldValue}=form;


        return (
            // <View>
            <View style={{...styles.datePickerContainer,borderBottomColor:(getFieldError&&getFieldError(name))?"#ed4014":"#fff"}}>

                <List>
                    <Picker
                        {...this.props}
                        data={childrenList}
                        cols={1}
                        value={(getFieldValue?getFieldValue(name):value) || defaultValue}
                        // value={value || defaultValue}
                        onChange={(value)=> this.onChange(value)}
                        disabled={disabled}
                    >
                        <List.Item arrow="horizontal" >{lableName}</List.Item>
                    </Picker>
                </List>
            </View>
        );
    }
    
}


const styles=StyleSheet.create({
    datePickerContainer:{
        borderBottomWidth:1,
        borderBottomColor:"#fff"
    },
    isDisabled:{
        color:"#ccc",
        backgroundColor:"white"
    },
  });


export default SelectComponent;
  
