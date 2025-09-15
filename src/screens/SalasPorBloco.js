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
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Picker } from "@react-native-picker/picker";

export default function Home() {
  const navigation = useNavigation();
  const [salas, setSalas] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);
  const [blocoSelecionado, setBlocoSelecionado] = useState("");

  useEffect(() => {
    getSalas();
    getSecureData();
  }, []);

  const handleSalaSelect = (sala) => {
    navigation.navigate("Reserva", { sala: sala, idUsuario: idUsuario });
  };

  const getSecureData = async () => {
    const value = await SecureStore.getItemAsync("id");
    setIdUsuario(value);
    console.log(value);
  };

  async function getSalas() {
    await api.getSalas().then(
      (response) => {
        //console.log(response.data);
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

        <View style={styles.roomsGrid}>
          {salas
            .filter((sala) =>
              blocoSelecionado ? sala.bloco === blocoSelecionado : true
            )
            .map((sala) => (
              <TouchableOpacity
                key={sala.id_sala}
                style={styles.roomCard}
                onPress={() => handleSalaSelect(sala)}
              >
                <View style={styles.roomHeader}>
                  <Text style={styles.roomTitle}>{sala.descricao}</Text>
                </View>
                <Text style={styles.roomTitle2}>Bloco: {sala.bloco}</Text>
                <Text style={styles.roomTitle2}>
                  Capacidade: {sala.capacidade}
                </Text>
                <Text style={styles.roomTitle2}>N° da sala: {sala.numero}</Text>
              </TouchableOpacity>
            ))}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.sairButton}
        >
          <Text>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
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
    marginRight: 10,
  },
  pickerContainer: {
    width: 100,
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
  scrollView: {
    flex: 1,
  },
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
  sairButton: {
    width: "90%",
    height: 30,
    borderRadius: 3,
    backgroundColor: "#FF3F3F",
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
