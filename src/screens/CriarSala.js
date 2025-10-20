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
import api from "../axios/axios"; // já deve estar configurado
import Logo from "../../assets/logosenai.png";
import { useNavigation } from "@react-navigation/native";

export default function CriarSala() {
  const [sala, setSala] = useState({
    numero: "",
    descricao: "",
    capacidade: "",
    bloco: "",
  });

  const navigation = useNavigation();

  async function handleCriarSala() {
    try {
      const response = await api.post("/sala", sala);
      Alert.alert("Sucesso", response.data.message);
      navigation.goBack(); // volta para a tela anterior
    } catch (error) {
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Erro ao cadastrar sala"
      );
    }
  }

  return (
    <View style={styles.content}>
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

        <TextInput
          style={styles.input}
          placeholder="Número da Sala"
          value={sala.numero}
          keyboardType="numeric"
          onChangeText={(value) => setSala({ ...sala, numero: value })}
        />

        <TextInput
          style={styles.input}
          placeholder="Descrição"
          value={sala.descricao}
          onChangeText={(value) => setSala({ ...sala, descricao: value })}
        />

        <TextInput
          style={styles.input}
          placeholder="Capacidade"
          value={sala.capacidade}
          keyboardType="numeric"
          onChangeText={(value) => setSala({ ...sala, capacidade: value })}
        />

        <TextInput
          style={styles.input}
          placeholder="Bloco"
          value={sala.bloco}
          onChangeText={(value) => setSala({ ...sala, bloco: value })}
        />

        <TouchableOpacity
          onPress={handleCriarSala}
          style={styles.cadastrarButton}
        >
          <Text style={styles.cadastrarButtonText}>Cadastrar Sala</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  cadastroCard: {
    backgroundColor: "#CC1E1E",
    width: "90%",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
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
});
