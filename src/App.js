import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/LoginScreen";
import Cadastro from "./screens/CadastroScreen";
import Home from "./screens/Home";
import Reserva from "./screens/ReservaScreen";
import MinhasReservas from "./screens/MinhasReservas";
import Perfil from "./screens/Perfil";
import Layout from "./components/MyLayout";



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}>
        <Stack.Screen
          name="Login"
          component={() => (
            <Layout header={1}>
              <Login />
            </Layout>
          )}
        />
        <Stack.Screen
          name="Cadastro"
          component={() => (
            <Layout header={1}>
              <Cadastro/>
            </Layout>
          )}
        />
        <Stack.Screen name="Home" component={()=><Layout><Home/></Layout>} />
        <Stack.Screen name="Reserva" component={(props)=><Layout><Reserva {...props} /></Layout>}/>
        <Stack.Screen name="MinhasReservas" component={(props)=><Layout><MinhasReservas {...props} /></Layout>}/>
        <Stack.Screen name="Perfil" component={(props)=><Layout><Perfil {...props} /></Layout>}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
