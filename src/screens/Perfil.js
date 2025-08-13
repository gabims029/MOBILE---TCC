import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import imgPerfil from "../../assets/imgPerfil.png";
import api from "../axios/axios";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import ModalAtualizarUser from "../components/ModalAtualizarUser";
import ModalExcluirUser from "../components/ModalExcluirUser";

const Perfil = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    nome: "",
    email: "",
    cpf: "",
    senha: "",
  });

  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    const getSecureData = async () => {
      const value = await SecureStore.getItemAsync("id");
      setIdUsuario(value);
      if (value) {
        carregarDadosUsuario(value);
      } else {
        Alert.alert("Erro", "ID do usuário não encontrado.");
      }
    };
    getSecureData();
  }, []);

  async function carregarDadosUsuario(id) {
    try {
      const response = await api.getUser(id);
      setUser({
        nome: response.data.user.nome,
        email: response.data.user.email,
        cpf: response.data.user.cpf,
        senha: response.data.user.senha,
      });
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar dados do usuário.");
      console.log(error);
    }
  }

  const [modalAtualizarVisible, setModalAtualizarVisible] = useState(false);
  const [modalExcluirVisible, setModalExcluirVisible] = useState(false);

  return (
    <View style={styles.content}>
      <View style={styles.perfilCard}>
        <Text style={styles.title}>MEU PERFIL</Text>

        <View style={styles.imgPerfilContainer}>
          <Image
            source={imgPerfil}
            resizeMode="contain"
            style={{ width: 120, height: 120 }}
          />
          <Text style={styles.name}>{user.nome}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>CPF</Text>
          <TextInput style={styles.input} value={user.cpf} editable={false} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>SENHA</Text>
          <TextInput
            style={styles.input}
            value={user.senha}
            secureTextEntry
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput style={styles.input} value={user.email} editable={false} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MinhasReservas")}
        >
          <Text style={styles.buttonText}>Minhas reservas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalAtualizarVisible(true)}
        >
          <Text style={styles.buttonText}>Editar Perfil</Text>
        </TouchableOpacity>

        

        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalExcluirVisible(true)}
        >
          <Text style={styles.buttonText}>Deletar Perfil</Text>
        </TouchableOpacity>

        <ModalAtualizarUser
          visible={modalAtualizarVisible}
          onClose={() => setModalAtualizarVisible(false)}
          usuario={{
            nome: user.nome,
            email: user.email,
            senha: user.senha,
            cpf: user.cpf,
            id_usuario: idUsuario,
          }}
          onSuccess={() => carregarDadosUsuario(idUsuario)}
        />

        <ModalExcluirUser
          visible={modalExcluirVisible}
          onClose={() => setModalExcluirVisible(false)}
          onCancel={() => setModalExcluirVisible(false)}
          onDeleted={() => {
            setModalExcluirVisible(false);
            navigation.navigate("Perfil")
          }}
          usuario={{
            idUsuario: idUsuario,
            nome: user.nome,
            email: user.email,
            senha: user.senha,
            cpf: user.cpf,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FCECEC",
  },
  perfilCard: {
    backgroundColor: "#CC1E1E",
    width: "90%",
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imgPerfilContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  name: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  inputContainer: {
    width: "100%",
    marginVertical: 5,
  },
  label: {
    color: "white",
    fontSize: 12,
    marginBottom: 5,
    marginLeft: 10,
  },
  input: {
    width: "100%",
    height: 45,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  button: {
    width: "100%",
    height: 45,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#CC1E1E",
    fontWeight: "bold",
    fontSize: 16,
  },
});


export default Perfil;
