import React, { Component } from 'react';
import { Dimensions,StyleSheet,ActivityIndicator,DeviceEventEmitter,TouchableOpacity, View, Text, } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Provider, Drawer } from '@ant-design/react-native';
import BarBottom from './view/BarBottom';   // 底部按钮
import CenterScreen from './view/Center';       // 个人中心
import WISHttpUtils from '@wis_component/http';   // http 




// 页面
import HomeScreen from './view/Home';    // 主页
import LoginScreen from './view/Login';   // 登录


import onlineScreen from './view_page/online/index';     // 上料










import taskScreen from './view/task/index';   // 待办任务
import procurementOrderScreen from './view/procurementOrder/index';   // 采购订单
import procurementIssueScreen from './view/procurementOrder/details';   // 采购订单 详情
import procurementOrderPendingScreen from './view/procurementOrder/pending';   // 采购订单 待下发
import procurementOrderWeekScreen from './view/procurementOrder/week';   // 采购订单 本周
import procurementOrderMonthScreen from './view/procurementOrder/month';   // 采购订单 本月




import procurementPlanScreen from './view/procurementPlan/index';     // 采购计划
import procurementPlanDetailsScreen from './view/procurementPlan/details';     // 采购计划 详情
import procurementPlanPendingScreen from './view/procurementPlan/pending';     // 采购计划 待下发
import procurementPlanWeekScreen from './view/procurementPlan/week';     // 采购计划 本周
import procurementPlanMonthScreen from './view/procurementPlan/month';     // 采购计划 本周

import voucherScreen from './view/voucher/index';     // 待办单据
import vouchereDetailScreen from './view/voucher/details';     // 待办单据 详情

import deferredScreen from './view/deferred/index';     // 交货延期订单
import deferredDetailScreen from './view/deferred/details';     // 交货延期订单 详情

import takeDeliveryScreen from './view/takeDelivery/index';     // 待收货
import takeDeliveryDetailScreen from './view/takeDelivery/details';     // 待收货 详情
 



import salesReturnScreen from './view/salesReturn/index';     // 退货管理

import settleAccountsScreen from './view/settleAccounts/index';     // 结算单
import settleAccountsDetailsScreen from './view/settleAccounts/details';     // 结算单 详情

import waitCloseScreen from './view/waitClose/index';   // 待下发结算源
import waitCloseDetailScreen from './view/waitClose/details';   // 待下发结算源 详情

import waitCloseCheckScreen from './view/waitCloseCheck/index';   // 待审核结算单
import waitCloseCheckDetailScreen from './view/waitCloseCheck/details';   // 待审核结算单 详情



import Config from 'react-native-config';
const base_url=Config.base_url;





//------------------------------  react func  ----------------------------------------------

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

class App extends Component {
  constructor (props) {
    super(props);

    this.state={
      activityIndicatorVisible: false,    // loding
    }  
  }
  
  componentDidMount() {
    let that=this;

    // loding
    this.listener =DeviceEventEmitter.addListener('globalEmitter_toggle_loding',function(active){
      that.setState({
        activityIndicatorVisible:active
      });
    });

  }

  componentWillUnmount(){
    this.listener.remove();
  }

  render() {
    let that=this;
    let {activityIndicatorVisible}=this.state;

    // 公共头部
    let headOption={
      headerStyle: {
        backgroundColor:'#1890ff',
        borderWidth:0
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
      headerRight: (props) => (
        <TouchableOpacity onPress={() =>{ 
          DeviceEventEmitter.emit('globalEmitter_to_center');

          // this.drawer.openDrawer();
          // DeviceEventEmitter.emit('globalEmitter_get_login_config');
        }}>
          <View style={{paddingTop:5,paddingRight:20}}><Icon style={{color:"#fff"}} name={"setting"}/></View>
        </TouchableOpacity> ),

    }

    // 个人中心
    let headOptionCenterPage={
      headerTransparent:true,
      headerStyle: {
        backgroundColor: '#13c2c2',
        borderWidth:0
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        borderWidth:0
      },      
    }


    return(
      <Provider>
        { activityIndicatorVisible ?
          <View style={{...styles.activityIndicatorStyle,width:Dimensions.get('window').width,height:Dimensions.get('window').height}}>
            <ActivityIndicator size="large" color="#13c2c2" />
          </View>
          :
          <View></View>
        }



        {/* <Drawer
          sidebar={<CenterScreen onClose={()=> that.drawer.closeDrawer() } />}
          position="left"
          // open={false}
          drawerRef={el => (this.drawer = el)}
          // onOpenChange={this.onOpenChange}
          drawerBackgroundColor="#fff"
        > */}

        {/* 菜单 */}
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Home"
            // screenOptions={({ route, navigation }) =>{
            //   // 首页
            //   // console.log(route.route.params.routeParams);
            //   // if(route["name"]=="Home"){
            //   //   console.log("fafnan 2323,000,9099oo");
            //   // }
            // }}            
            onTransitionEnd={(route,isInitRouter)=>{
              DeviceEventEmitter.emit('globalEmitter_updata_home');
            }}
            // transitionStart={(...aaa)=>{
            //   // console.log("fafnan 2323");
            //   // console.log(aaa);
            // }}
          >

            <Stack.Screen name="Login"
              options={{
                title:' ',
                headerShown: false
              }} 
              component={LoginScreen} 
            />
            
            <Stack.Screen name="Home" options={{title:'首页',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="Home" component={HomeScreen} />
                </Tab.Navigator>
              )}
            </Stack.Screen>  


            <Stack.Screen name="centerPage" options={{title:'个人中心',...headOptionCenterPage}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="centerPage" component={CenterScreen} />
                </Tab.Navigator>
              )}
            </Stack.Screen> 

            <Stack.Screen name="online" options={{title:'上料',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="online" component={onlineScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>


            















            <Stack.Screen name="task" options={{title:'待办任务',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="task" component={taskScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>

            <Stack.Screen name="salesReturn" options={{title:'收货',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="salesReturn" component={salesReturnScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>

            <Stack.Screen name="settleAccounts" options={{title:'结算单',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="settleAccounts" component={settleAccountsScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>

            <Stack.Screen name="settleAccountsDetails" options={{title:'结算单详情',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="settleAccountsDetails" component={settleAccountsDetailsScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>            

            
            
            
            <Stack.Screen name="voucher" options={{title:'待办单据',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="voucher" component={voucherScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>
            <Stack.Screen name="vouchereDetail" options={{title:'待办单据-详情',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="vouchereDetail" component={vouchereDetailScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>           

            <Stack.Screen name="deferred" options={{title:'交货延期订单',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="deferred" component={deferredScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>
            <Stack.Screen name="deferredDetail" options={{title:'交货延期订单-详情',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="deferredDetail" component={deferredDetailScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>            
            



            <Stack.Screen name="takeDelivery" options={{title:'待收货',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="takeDelivery" component={takeDeliveryScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>            
            <Stack.Screen name="takeDeliveryDetail" options={{title:'待收货-详情',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="takeDeliveryDetail" component={takeDeliveryDetailScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>              
            


            <Stack.Screen name="procurementOrder" options={{title:'采购订单',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="procurementOrder" component={procurementOrderScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>
            <Stack.Screen name="procurementOrderPending" options={{title:'采购订单',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="procurementOrderPending" component={procurementOrderPendingScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>
            <Stack.Screen name="procurementOrderWeek" options={{title:'采购订单-本周',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="procurementOrderWeek" component={procurementOrderWeekScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>    
            <Stack.Screen name="procurementOrderMonth" options={{title:'采购订单-本月',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="procurementOrderMonth" component={procurementOrderMonthScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>   

                  
            <Stack.Screen name="waitClose" options={{title:'待下发结算源',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="waitClose" component={waitCloseScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>     
            <Stack.Screen name="waitCloseDetail" options={{title:'待下发结算源-明细',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="waitCloseDetail" component={waitCloseDetailScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>    


            <Stack.Screen name="waitCloseCheck" options={{title:'待审核结算单',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="waitCloseCheck" component={waitCloseCheckScreen} />
                </Tab.Navigator>
              )}               
            </Stack.Screen>     
            <Stack.Screen name="waitCloseCheckDetail" options={{title:'待审核结算单-明细',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="waitCloseCheckDetail" component={waitCloseCheckDetailScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>                               
            

            <Stack.Screen name="procurementPlan" options={{title:'采购计划',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="procurementPlan" component={procurementPlanScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>    
            <Stack.Screen name="procurementPlanPending" options={{title:'采购计划',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="procurementPlanPending" component={procurementPlanPendingScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen> 
            
            <Stack.Screen name="procurementPlanWeek" options={{title:'采购计划-本周',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="procurementPlanWeek" component={procurementPlanWeekScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>     
            <Stack.Screen name="procurementPlanMonth" options={{title:'采购计划-本月',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="procurementPlanMonth" component={procurementPlanMonthScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>                     
            


            <Stack.Screen name="procurementPlanDetails" options={{title:'采购计划-详情',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="procurementPlanDetails" component={procurementPlanDetailsScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen> 
                    

            <Stack.Screen name="procurementIssue" options={{title:'采购订单-详情',...headOption}}>
              {(TabProps) => (
                <Tab.Navigator tabBar={() => <BarBottom TabProps={TabProps} /> }>
                  <Tab.Screen initialParams={{routeParams: TabProps.route.params}} name="procurementIssue" component={procurementIssueScreen} />
                </Tab.Navigator>
              )}            
            </Stack.Screen>  
               
            
          </Stack.Navigator>
        </NavigationContainer>
      
      
      {/* </Drawer> */}
      </Provider>
    );
  }  
}


const styles = StyleSheet.create({
  activityIndicatorStyle:{
    position:"absolute",
    top:0,
    left:0,
    zIndex:999999,
    justifyContent:'center',
    backgroundColor:'#dde5dd24'
  }
})

export default App;