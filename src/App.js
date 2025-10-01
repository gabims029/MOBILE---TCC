import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/LoginScreen";
import Cadastro from "./screens/CadastroScreen";
import Home from "./screens/Home";
import ReservaBloco from "./screens/ReservaBloco";
import ReservaData from "./screens/ReservaData";
import MinhasReservas from "./screens/MinhasReservas";
import Perfil from "./screens/Perfil";
import Layout from "./components/MyLayout";
import CriarSala from "./screens/CriarSala";
import ListUser from "./screens/ListUser";
import TodasReservas from "./screens/TodasReservas";
import PerfilAdmin from "./screens/PerfilAdmin"; 
import SalasPorBloco from "./screens/SalasPorBloco";
import SalasPorData from "./screens/SalasPorData";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login">
          {() => (
            <Layout header={1}>
              <Login />
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="Cadastro">
          {() => (
            <Layout>
              <Cadastro />
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="Home">
          {() => (
            <Layout>
              <Home />
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="ReservaBloco">
          {(props) => (
            <Layout>
              <ReservaBloco {...props} />
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="ReservaData">
          {(props) => (
            <Layout>
              <ReservaData {...props} />
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="MinhasReservas">
          {(props) => (
            <Layout>
              <MinhasReservas {...props} />
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="Perfil">
          {(props) => (
            <Layout>
              <Perfil {...props} />
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="CriarSala">
          {(props) => (
            <Layout>
              <CriarSala {...props} />
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="ListUser">
          {(props) => (
            <Layout>
              <ListUser {...props} />
            </Layout>
          )}
        </Stack.Screen>

        <Stack.Screen name="TodasReservas">
          {(props) => (
            <Layout>
              <TodasReservas {...props} />
            </Layout>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="SalasPorBloco"
          component={(props) => (
            <Layout>
              <SalasPorBloco {...props} />
            </Layout>
          )}
        />
        <Stack.Screen
          name="SalasPorData"
          component={(props) => (
            <Layout>
              <SalasPorData />
            </Layout>
          )}
        />
        <Stack.Screen
          name="PerfilAdmin"
          component={(props) => (
            <Layout>
              <PerfilAdmin {...props} />
            </Layout>
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
