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
import { Picker } from "@react-native-picker/picker";
import sheets from "../axios/axios";
import Logo from "../../assets/logosenai.png";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

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
      const response = await sheets.postSalas(sala);

      Alert.alert("Sucesso", response.data.message);
      navigation.goBack();
    } catch (error) {
      console.log(
        "Erro ao cadastrar sala:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Erro ao cadastrar sala"
      );
    }
  }

  return (
    <View style={styles.content}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <FontAwesome name="arrow-left" size={24} color="#ddd" />
      </TouchableOpacity>

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
          placeholder="Sala"
          placeholderTextColor="#999" 
          value={sala.numero}
          keyboardType="numeric"
          onChangeText={(value) => setSala({ ...sala, numero: value })}
        />

        <TextInput
          style={styles.input}
          placeholder="Descrição"
          placeholderTextColor="#999" 
          value={sala.descricao}
          onChangeText={(value) => setSala({ ...sala, descricao: value })}
        />

        <TextInput
          style={styles.input}
          placeholder="Capacidade"
          placeholderTextColor="#999" 
          value={sala.capacidade}
          keyboardType="numeric"
          onChangeText={(value) => setSala({ ...sala, capacidade: value })}
        />

        {/* Seletor de Bloco com mesmo estilo do Cadastro */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sala.bloco}
            onValueChange={(value) => setSala({ ...sala, bloco: value })}
            style={styles.picker}
            dropdownIconColor="#888"
          >
            <Picker.Item label="Bloco" value="" color="#888" />
            <Picker.Item label="Bloco A" value="A" />
            <Picker.Item label="Bloco B" value="B" />
            <Picker.Item label="Bloco C" value="C" />
            <Picker.Item label="Bloco D" value="D" />
          </Picker>
        </View>

        <TouchableOpacity
          onPress={handleCriarSala}
          style={styles.cadastrarButton}
        >
          <Text style={styles.cadastrarButtonText}>Criar Sala</Text>
        </TouchableOpacity>

        <TouchableOpacity
      onPress={() => navigation.navigate("ListSalas")}
      style={styles.cadastrarButton}
    >
      <Text style={styles.cadastrarButtonText}>Listar Salas</Text>
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
  backButton: {
    padding: 1,
    alignSelf: "flex-start",
    margin: 5,
    borderRadius: 4,
    paddingHorizontal: 1,
    borderColor: "#ddd",
    right: 20,
    top: -90,
  },
});