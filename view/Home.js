import React, { Component } from 'react';

import { Linking,DeviceEventEmitter,StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Toast,Modal,Card, WhiteSpace, WingBlank, Button, Icon } from '@ant-design/react-native';

import WISHttpUtils from '@wis_component/http';   // http 
import AsyncStorage from '@react-native-async-storage/async-storage';


class HomeScreen extends Component{
    constructor(props) {
        super(props);
    
        this.state={
            isProcurement: false,  // 采购商
            isFinancing:false,   // 财务

            visible: !true,    // 版本更新
            version:'1.0.1',  // 当前版本号

            numberConfig:{},  // 数字


        }
      }

    componentDidMount(){

        var that=this;
        var {navigation} = this.props;


        // 未登录
        AsyncStorage.getItem("login_type").then((option)=>{
            // Toast.offline(option,1);
            if( option !="in" ){
                navigation.navigate('Login');
            }else{
                that.getNumber();
                that.setUserType();  // 设置用户类型
            }
        });  
        // },5000);

        // 设置用户类型
        this.setType =DeviceEventEmitter.addListener('globalEmitter_set_userType',function(){
            that.setUserType();  // 设置用户类型
        });

        // 刷新home
        this.updataHomePage =DeviceEventEmitter.addListener('globalEmitter_updata_home',function(){
            that.getNumber();  // 刷新数字
        });

        // 到个人中心
        this.toCenter =DeviceEventEmitter.addListener('globalEmitter_to_center',function(){
            navigation.navigate('centerPage'); 
            setTimeout(()=>{
                DeviceEventEmitter.emit('globalEmitter_get_login_config');
            },100);
        });

        // 退出登录
        this.listener =DeviceEventEmitter.addListener('globalEmitter_logOut',function(){
            AsyncStorage.setItem("login_type","out").then(()=>{
                navigation.navigate('Login'); 
            });
        });
    }

    componentWillUnmount(){
        this.listener.remove();
        this.toCenter.remove();
        this.updataHomePage.remove();
        this.setType.remove();
    }

    /**
     * 设置用户类型
     */
    setUserType(){
        let that=this;

        // console.log("设置用户");
        // 判断用户类型
        AsyncStorage.getItem("user_type").then((option)=>{
            // console.log(option);
            that.setState({
                isProcurement: (option=="procurement")?true:false,   // 采购
                isFinancing: (option=="financing")?true:false,   // 财务
            });
        });
    }

    /**
     * 获取数字
     */
    getNumber(){
        let that=this;
    
        WISHttpUtils.post("api-supply/srm/order/findAllNum",{
            params:{
            },
            hideLoading:true,
            hideToast:true
        },(result) => {
            // console.log(result["data"])
            that.setState({
                numberConfig:result["data"]||{}
            });
            // console.log(result);
        });
    }
    


    /**
     * 
     * @param {*} code 
     */
    onClose =()=> {
        this.setState({
            visible: false,
        });
    }

    /**
     * 下载 最新版
     * @param {*} code 
     */
    onDownload=()=>{
        var downloadURL = 'http://www.baidu.com/';  // 下载页面         
  
        Linking.canOpenURL(downloadURL).then(supported => {         
            if (!supported) {            
                console.warn('Can\'t handle url: ' + downloadURL);            
            } else {            
                return Linking.openURL(downloadURL);            
            }            
        }).catch(err => console.error('An error occurred',downloadURL));           
    }


    /**
     * 页面跳转
     * @param {路由名称} code 
    */
    authority=(code)=>{
        const {navigation} = this.props;
        navigation.navigate(code);
    }

    render() {
        const {navigation} = this.props;
        const {isProcurement,isFinancing,version,numberConfig}=this.state;

        return (
        <ScrollView style={styles.page}>

            <Modal
            title="版本更新"
            transparent
            onClose={this.onClose}
            maskClosable
            visible={this.state.visible}
            closable
            //   footer={footerButtons}
            >
            <View style={{ paddingVertical: 20 }}>
                <View style={styles.versionContent}>
                    <Text style={{ fontSize:16 }}>当前版本：</Text>
                    <Text style={{ fontSize:16 }}>1.0.1</Text>
                </View>
                <View style={styles.versionContent}>
                    <Text style={{ fontSize:16 }}>更新版本：</Text>
                    <Text style={{ fontSize:16 }}>1.0.3</Text>
                </View>

                <View style={{paddingTop:8}}>
                    <Button type="primary" onPress={this.onDownload}>点击下载安装版</Button>
                </View>
            </View>
            <Button type="ghost" onPress={this.onClose}>取消</Button>
            </Modal>



            <WingBlank size="md" style={styles.wingBlank}>
            <Card style={styles.card}>
                <Card.Header
                    title="待办"
                    thumb={<Icon name="bell" size="md" color="#ff9933" style={{marginRight:6}} />}
                />
                <Card.Body>
                    { isFinancing ?
                        <View style={styles.cardContent}>
                            <View style={styles.flexBox}>
                                <View style={styles.flexBoxCol}>
                                    <View style={styles.flexBoxColChild}>
                                        <TouchableOpacity onPress={() => this.authority('waitCloseCheck') }>
                                            <View style={styles.menu_child}>
                                                <Text style={{...styles.menu_child_icon,color:"#00FFFF"}}>{numberConfig["financialAudit"]}</Text>
                                                <Text style={styles.menu_child_icon_text}>待审核结算单</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View> 
                                <View style={styles.flexBoxCol}></View>
                                <View style={styles.flexBoxCol}></View>
                            </View> 
                        </View>
                        : 
                        <View style={styles.cardContent}>
                            <View style={styles.flexBox}>
                                <View style={styles.flexBoxCol}>
                                    <View style={styles.flexBoxColChild}>
                                        <TouchableOpacity onPress={() => this.authority('procurementPlanPending') }>
                                            <View style={styles.menu_child}>
                                                <Text style={{...styles.menu_child_icon,color:"#00FFFF"}}>{numberConfig["planStatusCount"]}</Text>
                                                <Text style={styles.menu_child_icon_text}>{`${isProcurement?"待下发":"待确认"}计划`}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.flexBoxCol}>
                                    <View style={styles.flexBoxColChild}>
                                        <TouchableOpacity onPress={() => this.authority('procurementOrderPending') }>
                                            <View style={styles.menu_child}>
                                                <Text style={{...styles.menu_child_icon,color:"#339999"}}>{numberConfig["orderStatusCount"]}</Text>
                                                <Text style={styles.menu_child_icon_text}>{`${isProcurement?"待下发":"待确认"}订单`}</Text>
                                            </View>
                                        </TouchableOpacity>  
                                    </View>
                                </View>
                                <View style={styles.flexBoxCol}>
                                    <View style={styles.flexBoxColChild}>
                                        <TouchableOpacity onPress={() => this.authority('voucher') }>
                                            <View style={styles.menu_child}>
                                                <Text style={{...styles.menu_child_icon,color:"#FFCC00"}}>{numberConfig["agentCount"]}</Text>
                                                <Text style={styles.menu_child_icon_text}>待办单据</Text>
                                            </View>
                                        </TouchableOpacity>   
                                    </View>
                                </View>
                            </View>
                            <View style={styles.flexBox}>
                                <View style={styles.flexBoxCol}>
                                    <View style={styles.flexBoxColChild}>
                                        <TouchableOpacity onPress={() => this.authority('procurementPlanWeek') }>
                                            <View style={styles.menu_child}>
                                                <Text style={{...styles.menu_child_icon,color:"#006699"}}>{numberConfig["planWeekCount"]}</Text>
                                                <Text style={styles.menu_child_icon_text}>本周计划</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.flexBoxCol}>
                                    <View style={styles.flexBoxColChild}>
                                        <TouchableOpacity onPress={() => this.authority('procurementOrderWeek') }>
                                            <View style={styles.menu_child}>
                                                <Text style={styles.menu_child_icon}>{numberConfig["orderWeekCount"]}</Text>
                                                <Text style={styles.menu_child_icon_text}>本周订单</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.flexBoxCol}>
                                    <View style={styles.flexBoxColChild}>
                                        <TouchableOpacity onPress={() => this.authority('deferred') }>
                                            <View style={styles.menu_child}>
                                                <Text style={{...styles.menu_child_icon,color:"#330066"}}>{numberConfig["extensionAllCount"]}</Text>
                                                <Text style={styles.menu_child_icon_text}>交货延期订单</Text>
                                            </View>
                                        </TouchableOpacity> 
                                    </View>
                                </View>
                            </View>
                            <View style={styles.flexBox}>
                                <View style={styles.flexBoxCol}>
                                    <View style={styles.flexBoxColChild}>
                                        <TouchableOpacity onPress={() => this.authority('procurementPlanMonth') }>
                                            <View style={styles.menu_child}>
                                                <Text style={{...styles.menu_child_icon,color:"#006600"}}>{numberConfig["planMonthCount"]}</Text>
                                                <Text style={styles.menu_child_icon_text}>本月计划</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.flexBoxCol}>
                                    <View style={styles.flexBoxColChild}>
                                        <TouchableOpacity onPress={() => this.authority('procurementOrderMonth') }>
                                            <View style={styles.menu_child}>
                                                <Text style={{...styles.menu_child_icon,color:"#00CCFF"}}>{numberConfig["orderMonthCount"]}</Text>
                                                <Text style={styles.menu_child_icon_text}>本月订单</Text>
                                            </View>
                                        </TouchableOpacity> 
                                    </View>
                                </View>

                                { isProcurement ?
                                    <View style={styles.flexBoxCol}>
                                        <View style={styles.flexBoxColChild}>
                                            <TouchableOpacity onPress={() => this.authority('takeDelivery') }>
                                                <View style={styles.menu_child}>
                                                    <Text style={{...styles.menu_child_icon,color:"#660000"}}>{numberConfig["receivedCount"]||0}</Text>
                                                    <Text style={styles.menu_child_icon_text}>待收货订单</Text>
                                                </View>
                                            </TouchableOpacity> 
                                        </View>
                                    </View>       
                                    :
                                    <View style={styles.flexBoxCol}></View>
                                }

                            </View>                        
                            <View style={styles.flexBox}>
                                { isProcurement ?
                                    <View style={styles.flexBoxCol}>
                                        <View style={styles.flexBoxColChild}>
                                            <TouchableOpacity onPress={() => this.authority('waitClose') }>
                                                <View style={styles.menu_child}>
                                                    <Text style={{...styles.menu_child_icon,color:"#006699"}}>{numberConfig["billSourceDraft"]}</Text>
                                                    <Text style={styles.menu_child_icon_text}>待下发结算源</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>                            
                                    :
                                    <View style={styles.flexBoxCol}></View>
                                }
                                { isProcurement ?
                                    <View style={styles.flexBoxCol}>
                                        <View style={styles.flexBoxColChild}>
                                            <TouchableOpacity onPress={() => this.authority('waitCloseCheck') }>
                                                <View style={styles.menu_child}>
                                                    <Text style={styles.menu_child_icon}>{numberConfig["billAuditDraft"]}</Text>
                                                    <Text style={styles.menu_child_icon_text}>待审核结算单</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>                            
                                    :
                                    <View style={styles.flexBoxCol}></View>
                                }                            
                                <View style={styles.flexBoxCol}></View>
                            </View>                    
                        </View>   
                    }
                </Card.Body>
            </Card>

            <Card style={styles.card}>
                <Card.Header
                title="常用"
                thumb={<Icon name="audit" size="md" color="#009966" style={{marginRight:6}} />}
                />
                <Card.Body>
                    <View style={styles.cardContent}>
                        { isFinancing ?
                            <View style={styles.flexBox}>
                                <View style={styles.flexBoxCol}>
                                    <View style={styles.flexBoxColChild}>
                                        <TouchableOpacity onPress={() => this.authority('settleAccounts') }>
                                            <View style={styles.menu_child}>
                                                <Icon style={styles.menu_child_icon} name="calculator" size="lg" color="#660000" />
                                                <Text style={styles.menu_child_text}>结算单</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>  

                                <View style={styles.flexBoxCol}></View> 
                                <View style={styles.flexBoxCol}></View>                          
                            </View>
                            :
                            <View style={styles.flexBox}>
                                <View style={styles.flexBoxCol}>
                                    <View style={styles.flexBoxColChild}>
                                        <TouchableOpacity onPress={() => this.authority('procurementPlan') }>
                                            <View style={styles.menu_child}>
                                                <Icon style={styles.menu_child_icon} name="flag" size="lg" color="#ff9933" />
                                                <Text style={styles.menu_child_text}>采购计划</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.flexBoxCol}>
                                    <View style={styles.flexBoxColChild}>
                                        <TouchableOpacity onPress={() => this.authority('procurementOrder') }>
                                            <View style={styles.menu_child}>
                                                <Icon style={styles.menu_child_icon} name="file-done" size="lg" color="#009966" />
                                                <Text style={styles.menu_child_text}>采购订单</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                { isProcurement ?
                                    <View style={styles.flexBoxCol}>
                                        <View style={styles.flexBoxColChild}>
                                            <TouchableOpacity onPress={() => this.authority('salesReturn') }>
                                                <View style={styles.menu_child}>
                                                    <Icon style={styles.menu_child_icon} name="export" size="lg" color="#00CCFF" />
                                                    <Text style={styles.menu_child_text}>收货</Text>
                                                </View>
                                            </TouchableOpacity>  
                                        </View>
                                    </View>
                                    :
                                    <View style={styles.flexBoxCol}>
                                        <View style={styles.flexBoxColChild}>
                                            <TouchableOpacity onPress={() => this.authority('settleAccounts') }>
                                                <View style={styles.menu_child}>
                                                    <Icon style={styles.menu_child_icon} name="calculator" size="lg" color="#660000" />
                                                    <Text style={styles.menu_child_text}>结算单</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>                                     
                                }

                            </View>
                        }
                        { isProcurement ?
                            <View style={styles.flexBox}>
                                <View style={styles.flexBoxCol}>
                                    <View style={styles.flexBoxColChild}>
                                        <TouchableOpacity onPress={() => this.authority('settleAccounts') }>
                                            <View style={styles.menu_child}>
                                                <Icon style={styles.menu_child_icon} name="calculator" size="lg" color="#660000" />
                                                <Text style={styles.menu_child_text}>结算单</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>  

                                <View style={styles.flexBoxCol}></View> 
                                <View style={styles.flexBoxCol}></View>                          
                            </View>
                            :
                            <View></View>
                        }
                    </View>         
                </Card.Body>
            </Card>



            <View style={styles.footer}><Text>——到底了——</Text></View>
            </WingBlank>
        </ScrollView>
        );
    }
}



const styles = StyleSheet.create({
    cardContent:{
        paddingTop:8
    },
    flexBox:{
        flexDirection:"row",
    },
    flexBoxCol:{
        flex:1
    },
    flexBoxColChild:{
        alignItems: 'center'
    },    
    versionContent:{
        flexDirection:'row',
        paddingBottom:12
        // justifyContent:'space-between',        
    },
    page:{ 
        backgroundColor:"white"
    },
    wingBlank:{
        paddingBottom:50
    },
    card:{
        marginTop:16
    },
    menu_box: {
        flexDirection: "row",
        flexWrap:"wrap",
        // height: 100,
        // padding: 12
        paddingTop:10,
        paddingLeft:12,
        paddingRight:12,
    },
    menu_child_icon:{
        fontSize:36
    },
    menu_child_icon_text:{
        marginTop:8,
        fontSize:14,
        paddingTop:3
    },    
    menu_child: {
        justifyContent: 'center',
        alignItems: 'center',
        width:100,
        height:100,   
        borderWidth: 1,
        borderColor: "#e8eaec",
        borderRadius: 6,
        // marginRight:12,
        marginBottom:12,
        // paddingLeft:6,
        // paddingRight:6
    },
    menu_child_text: {
        marginTop:3,
        fontSize:16,
        paddingTop:3
    },
    footer:{
        justifyContent: 'center',
        alignItems: 'center',  
        paddingTop:16, 
        fontSize:12
    }
  });

export default HomeScreen;
