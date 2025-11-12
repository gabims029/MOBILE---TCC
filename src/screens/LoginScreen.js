import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import api from "../axios/axios";
import Logo from "../../assets/logosenai.png";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Snackbar } from "react-native-paper";

export default function Login() {
  const [user, setUser] = useState({
    email: "",
    senha: "",
    showPassword: true,
  });

  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    color: "#fff",
    backgroundColor: "#CC1E1E",
  });

  const navigation = useNavigation();

  const showSnackbar = (message, backgroundColor = "#CC1E1E") => {
    setSnackbar({ visible: true, message, backgroundColor });
  };

  const saveInfos = async (token, id_user, tipo) => {
    try {
      await SecureStore.setItemAsync("token", token);
      await SecureStore.setItemAsync("id", id_user.toString());
      await SecureStore.setItemAsync("tipo", tipo.toLowerCase());
    } catch (error) {
      console.log("Erro ao salvar no SecureStore:", error);
      showSnackbar("Erro ao salvar informações localmente.");
    }
  };

  const handleLogin = async () => {
    if (!user.email || !user.senha) {
      showSnackbar("Preencha todos os campos!");
      return;
    }

    try {
      const response = await api.postLogin({
        email: user.email,
        senha: user.senha,
      });

      const { token, user: userObj } = response.data;
      const { id_user, tipo } = userObj;

      await saveInfos(token, id_user, tipo);

      showSnackbar("Login realizado com sucesso!", "#28a745"); // verde sucesso
      setTimeout(() => {
        navigation.navigate("Home");
      }, 1200);
    } catch (error) {
      showSnackbar(
        error.response?.data?.error ||
          "Erro ao conectar com o servidor. Tente novamente."
      );
    }
  };

  return (
    <View style={styles.content}>
      <View style={styles.loginCard}>
        <View style={styles.logoContainer}>
          <Image
            source={Logo}
            resizeMode="contain"
            style={{ width: "100%", height: undefined, aspectRatio: 4 }}
          />
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Email"
            value={user.email}
            autoCapitalize="none"
            onChangeText={(value) => setUser({ ...user, email: value })}
          />
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha"
            value={user.senha}
            secureTextEntry={user.showPassword}
            onChangeText={(value) => setUser({ ...user, senha: value })}
          />
          <TouchableOpacity
            onPress={() =>
              setUser({ ...user, showPassword: !user.showPassword })
            }
          >
            <Ionicons
              name={user.showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}> Entrar </Text>
        </TouchableOpacity>
      </View>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={2500}
        style={[styles.snackbar, { backgroundColor: snackbar.backgroundColor }]}
      >
        <Text style={styles.snackbarText}>{snackbar.message}</Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  loginCard: {
    backgroundColor: "#CC1E1E",
    width: "90%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  passwordContainer: {
    width: "100%",
    height: 45,
    backgroundColor: "white",
    borderRadius: 25,
    marginVertical: 8,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    height: 40,
  },
  loginButton: {
    width: "100%",
    height: 45,
    backgroundColor: "#FF3F3F",
    borderRadius: 25,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  snackbar: {
    position: "absolute",
    bottom: 20,
    borderRadius: 10,
    alignSelf: "center",
    width: "90%",
    elevation: 6,
  },
  snackbarText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
