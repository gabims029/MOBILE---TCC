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

export default function SalasPorData() {
  const navigation = useNavigation();
  const route = useRoute();
  const { dataSelecionada } = route.params; // recebe a data vinda da Home

  const [salas, setSalas] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    getSalas();
    getSecureData();
  }, []);

  const handleSalaSelect = (sala) => {
    navigation.navigate("Reserva", { 
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
      },
      (error) => {
        Alert.alert("Erro", error.response.data.error);
      }
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
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
