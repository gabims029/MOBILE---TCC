import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import api from "../axios/axios";
import Logo from "../../assets/logosenai.png";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Menu from "../components/Menu"; // importa o menu lateral

export default function Cadastro() {
  const [user, setUser] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    tipo: "",
    showPassord: true,
  });

  const [menuVisible, setMenuVisible] = useState(false); // controla visibilidade do menu
  const navigation = useNavigation();

  async function handleCadastro() {
    await api.postCadastro(user).then(
      (response) => {
        Alert.alert("OK", response.data.message);
        navigation.navigate("Home");
      },
      (error) => {
        Alert.alert("Erro", error.response?.data?.error || "Erro ao cadastrar");
      }
    );
  }

  return (
    <View style={styles.content}>
      {/* Botão para abrir o menu */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
      >
        <Ionicons name="menu" size={32} color="white" />
      </TouchableOpacity>

      <View style={styles.cadastroCard}>
        {/* LOGO */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={Logo}
              resizeMode="contain"
              style={{ width: "100%", height: undefined, aspectRatio: 4 }}
            />
          </View>
        </View>

        {/* FORMULÁRIO */}
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={user.nome}
          onChangeText={(value) => setUser({ ...user, nome: value })}
        />

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={user.email}
          onChangeText={(value) => setUser({ ...user, email: value })}
        />

        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={user.cpf}
          maxLength={11}
          onChangeText={(value) => setUser({ ...user, cpf: value })}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha"
            value={user.senha}
            secureTextEntry={user.showPassord}
            onChangeText={(value) => setUser({ ...user, senha: value })}
          />
          <TouchableOpacity
            onPress={() =>
              setUser({ ...user, showPassord: !user.showPassord })
            }
          >
            <Ionicons
              name={user.showPassord ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={user.tipo}
            onValueChange={(value) => setUser({ ...user, tipo: value })}
            style={styles.picker}
            dropdownIconColor="#888"
          >
            <Picker.Item label="Tipo" value="" color="#888" />
            <Picker.Item label="Administrador" value="adm" />
            <Picker.Item label="Comum" value="comum" />
          </Picker>
        </View>

        <TouchableOpacity
          onPress={handleCadastro}
          style={styles.cadastrarButton}
        >
          <Text style={styles.cadastrarButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      {/* MENU LATERAL */}
      <Menu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FCECEC",
  },
  menuButton: {
    position: "absolute",
    top: 50,
    left: 30,
    zIndex: 10,
  },
  cadastroCard: {
    backgroundColor: "#CC1E1E",
    width: "90%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginTop: 80,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    width: "100%",
  },
  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "white",
    borderRadius: 25,
    marginVertical: 8,
    paddingHorizontal: 15,
  },
  cadastrarButton: {
    width: "100%",
    height: 45,
    backgroundColor: "#FF3F3F",
    borderRadius: 25,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  cadastrarButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  pickerContainer: {
    width: "100%",
    height: 45,
    backgroundColor: "white",
    borderRadius: 25,
    marginVertical: 8,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    height: "130%",
    color: "#888",
  },
});
