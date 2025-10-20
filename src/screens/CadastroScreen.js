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
import Menu from "../components/Menu";
// import * as ImagePicker from "expo-image-picker"; // ← COMENTE esta linha também

export default function Cadastro() {
  const [user, setUser] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
    tipo: "",
    showPassord: true,
  });

  // const [foto, setFoto] = useState(null); // ← COMENTE esta linha
  const [menuVisible, setMenuVisible] = useState(false);

  const navigation = useNavigation();

  // async function escolherFoto() {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setFoto(result.assets[0]); // pega primeira imagem
  //   }
  // }

  async function handleCadastro() {
    const formData = new FormData();
    formData.append("nome", user.nome);
    formData.append("email", user.email);
    formData.append("cpf", user.cpf);
    formData.append("senha", user.senha);
    formData.append("tipo", user.tipo);

    // if (foto) {
    //   formData.append("foto", {
    //     uri: foto.uri,
    //     name: "profile.jpg",
    //     type: "image/jpeg",
    //   });
    // }

    try {
      const response = await api.post("/user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("OK", response.data.message);
      navigation.navigate("Home");
    } catch (error) {
      console.log(error.response?.data);
      Alert.alert("Erro", error.response?.data?.error || "Erro ao cadastrar");
    }
  }

  return (
    <View style={styles.content}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
      />

      <View style={styles.cadastroCard}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={Logo}
              resizeMode="contain"
              style={{ width: "100%", height: undefined, aspectRatio: 4 }}
            />
          </View>
        </View>

        {/*
        ==== BLOCO DE FOTO COMENTADO ====
        <TouchableOpacity onPress={escolherFoto} style={styles.fotoButton}>
          <Text style={{ color: "white" }}>
            {foto ? "Foto selecionada" : "Escolher Foto"}
          </Text>
        </TouchableOpacity>

        {foto && (
          <Image
            source={{ uri: foto.uri }}
            style={{ width: 100, height: 100, borderRadius: 50, marginVertical: 10 }}
          />
        )}
        ==================================
        */}

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

        <TouchableOpacity onPress={handleCadastro} style={styles.cadastrarButton}>
          <Text style={styles.cadastrarButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <Menu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}