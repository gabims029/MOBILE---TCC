import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "../axios/axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";

export default function SalasPorData() {
  const navigation = useNavigation();
  const route = useRoute();
  const { dataSelecionada } = route.params; // recebe a data vinda da Home
  const [blocoSelecionado, setBlocoSelecionado] = useState("");
  const [salas, setSalas] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    getSalas();
    getSecureData();
  }, []);

  const handleSalaSelect = (sala) => {
    navigation.navigate("ReservaData", { 
      sala: sala, 
      idUsuario: idUsuario, 
      data: dataSelecionada 
    });
  };

  const getSecureData = async () => {
    const value = await SecureStore.getItemAsync("id");
    setIdUsuario(value);
  };

  async function getSalas() {
    await api.getSalas().then(
      (response) => {
        setSalas(response.data.salas);
        getSecureData();
      },
      (error) => {
        Alert.alert("Erro", error.response.data.error);
      }
    );
  }
  const blocos = [...new Set(salas.map((s) => s.bloco))];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.searchContainer}>
        <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <FontAwesome name="arrow-left" size={24} color="#ddd" />
      </TouchableOpacity>
          <TextInput style={styles.searchInput} placeholder="Pesquisar" />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={blocoSelecionado}
              onValueChange={(itemValue) => setBlocoSelecionado(itemValue)}
              style={styles.picker}
              dropdownIconColor="#888"
            >
              <Picker.Item label="Selecione um bloco:" color="#888" />
              {blocos.map((bloco) => (
                <Picker.Item key={bloco} label={bloco} value={bloco} />
              ))}
            </Picker>
          </View>
        </View>
        <Text style={styles.dataTitulo}>
          Data escolhida: {new Date(dataSelecionada).toLocaleDateString("pt-BR")}
        </Text>

        <View style={styles.roomsGrid}>
          {salas.map((sala) => (
            <TouchableOpacity
              key={sala.id_sala}
              style={styles.roomCard}
              onPress={() => handleSalaSelect(sala)}
            >
              <View style={styles.roomHeader}>
                <Text style={styles.roomTitle}>{sala.descricao}</Text>
              </View>
              <Text style={styles.roomTitle2}>Bloco: {sala.bloco}</Text>
              <Text style={styles.roomTitle2}>Capacidade: {sala.capacidade}</Text>
              <Text style={styles.roomTitle2}>N° da sala: {sala.numero}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F5" },
  dataTitulo: {
    margin: 15,
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollView: { flex: 1 },
  roomsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  roomCard: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "48%",
    height: 130,
    marginBottom: 15,
    overflow: "hidden",
  },
  roomHeader: {
    backgroundColor: "#CC1E1E",
    padding: 8,
  },
  roomTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    padding: 2,
  },
  roomTitle2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 14,
    padding: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 0,
    margin: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "white",
    borderRadius: 4,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 0,
    right: 18,
  },
  backButton: {
    padding: 1,
    alignSelf: "flex-start",
    margin: 5,
    borderRadius: 4,
    paddingHorizontal: 5,
    borderColor: "#ddd",
    right: 20,
  },
  pickerContainer: {
    width: 70,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    backgroundColor: "white",
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    height: "100%",
  },
});
