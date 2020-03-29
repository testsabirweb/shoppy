import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer'
import { Platform, SafeAreaView, View, Button } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'

import ProductsOverviewScreen, { productsOverviewScreenOptions } from '../screens/shop/ProductsOverviewScreen'
import ProductDetailScreen, { productDetailScreenOptions } from '../screens/shop/ProductDetailScreen';
import CartScreen, { cartScreenOptions } from '../screens/shop/CartScreen'
import OrdersScreen, { ordersScreenOptions } from '../screens/shop/OrdersScreen'
import UserProductsScreen, { userProductsScreenOptions } from '../screens/user/UserProductsScreen'
import EditProductScreen, { editProductScreenOptions } from '../screens/user/EditProductScreen'
import AuthScreen, { authScreenOptions } from '../screens/user/AuthScreen'
import Colors from '../constants/Colors'
import * as authActions from '../store/actions/auth'

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
}

const ProductsStackNavigator = createStackNavigator()

const ProductsNavigator = () => {
  return (
    <ProductsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ProductsStackNavigator.Screen
        name='ProductsOverview'
        component={ProductsOverviewScreen}
        options={productsOverviewScreenOptions}
      />
      <ProductsStackNavigator.Screen
        name='ProductDetail'
        component={ProductDetailScreen}
        options={productDetailScreenOptions}
      />
      <ProductsStackNavigator.Screen
        name='Cart'
        component={CartScreen}
        options={cartScreenOptions}
      />
    </ProductsStackNavigator.Navigator>
  )
}

// const ProductsNavigator = createStackNavigator({
//     ProductsOverview: ProductsOverviewScreen,
//     ProductDetail: ProductDetailScreen,
//     Cart: CartScreen
// }, {
//         navigationOptions: {
//             drawerIcon: drawerConfig => (
//                 <Ionicons
//                     name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
//                     size={23}
//                     color={drawerConfig.tintColor}
//                 />
//             )
//         },
//         defaultNavigationOptions: defaultNavOptions
//     }
// )

const OrdersStackNavigator = createStackNavigator()

const OrdersNavigator = () => {
  return (
    <OrdersStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <OrdersStackNavigator.Screen
        name='Orders'
        component={OrdersScreen}
        options={ordersScreenOptions}
      />
    </OrdersStackNavigator.Navigator>
  )
}

// const OrdersNavigator = createStackNavigator({
//   Orders: OrdersScreen
// }, {
//     navigationOptions: {
//       drawerIcon: drawerConfig => (
//         <Ionicons
//           name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       )
//     },
//     defaultNavigationOptions: defaultNavOptions
//   }
// )

const AdminStackNavigator = createStackNavigator()

const AdminNavigator = () => {
  return (
    <AdminStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AdminStackNavigator.Screen
        name='UserProducts'
        component={UserProductsScreen}
        options={userProductsScreenOptions}
      />
      <AdminStackNavigator.Screen
        name='EditProduct'
        component={EditProductScreen}
        options={editProductScreenOptions}
      />
    </AdminStackNavigator.Navigator>
  )
}

// const AdminNavigator = createStackNavigator({
//   UserProducts: UserProductsScreen,
//   EditProduct: EditProductScreen
// }, {
//     navigationOptions: {
//       drawerIcon: drawerConfig => (
//         <Ionicons
//           name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
//           size={23}
//           color={drawerConfig.tintColor}
//         />
//       )
//     },
//     defaultNavigationOptions: defaultNavOptions
//   }
// )

const ShopStackNavigator = createDrawerNavigator()

export const ShopNavigator = () => {
  const dispatch = useDispatch()

  return (
    <ShopStackNavigator.Navigator
      drawerContent={props => {
        return (
          <View style={{ flex: 1, paddingTop: 20 }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }} >
              <DrawerItemList {...props} />
              <Button title='Logout' color={Colors.primary} onPress={() => {
                dispatch(authActions.logout())
                // props.navigation.navigate('Auth')
              }} />
            </SafeAreaView>
          </View>
        )
      }}
      drawerContentOptions={{
        activeTintColor: Colors.primary
      }}
    >
      <ShopStackNavigator.Screen
        name='Products'
        component={ProductsNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
      <ShopStackNavigator.Screen
        name='Orders'
        component={OrdersNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
      <ShopStackNavigator.Screen
        name='Admin'
        component={AdminNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
    </ShopStackNavigator.Navigator>
  )
}

// const ShopNavigator = createDrawerNavigator({
//   Products: ProductsNavigator,
//   Orders: OrdersNavigator,
//   Admin: AdminNavigator
// }, {
//     contentOptions: {
//       activeTintColor: Colors.primary
//     },
//     contentComponent: props => {
//       const dispatch = useDispatch()
//       return (
//         <View style={{ flex: 1, paddingTop: 20 }}>
//           <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }} >
//             <DrawerNavigatorItems {...props} />
//             <Button title='Logout' color={Colors.primary} onPress={() => {
//               dispatch(authActions.logout())
//               // props.navigation.navigate('Auth')
//             }} />
//           </SafeAreaView>
//         </View>
//       )
//     }
//   }
// )

const AuthStackNavigator = createStackNavigator()

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen
        name='Auth'
        component={AuthScreen}
        options={authScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  )
}

// const AuthNavigator = createStackNavigator({
//   Auth: AuthScreen
// }, {
//     defaultNavigationOptions: defaultNavOptions
//   })

// const MainNavigator = createSwitchNavigator({
//   BootingUp: BootingUpScreen,
//   Auth: AuthNavigator,
//   Shop: ShopNavigator
// })

// export default createAppContainer(MainNavigator)