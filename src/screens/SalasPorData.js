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
  const { dataSelecionada } = route.params;
  const [blocoSelecionado, setBlocoSelecionado] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [salas, setSalas] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);

  useEffect(() => {
    getSalas();
    getSecureData();
  }, []);

  const getSecureData = async () => {
    const value = await SecureStore.getItemAsync("id");
    setIdUsuario(value);
  };

  async function getSalas() {
    try {
      const response = await api.getSalas();
      setSalas(response.data.salas);
      getSecureData();
    } catch (error) {
      Alert.alert("Erro", error.response?.data?.error || "Erro ao carregar salas.");
    }
  }

  const handleSalaSelect = (sala) => {
    navigation.navigate("ReservaBloco", {
      sala: sala,
      idUsuario: idUsuario,
    });
  };

  const blocos = [...new Set(salas.map((s) => s.bloco))];

  // Pesquisa
  const salasFiltradas = salas.filter((sala) => {
    const termo = pesquisa.toLowerCase();

    const correspondePesquisa =
      sala.numero.toLowerCase().includes(termo) ||
      sala.descricao.toLowerCase().includes(termo);

    const correspondeBloco = blocoSelecionado
      ? sala.bloco === blocoSelecionado
      : true;

    return correspondePesquisa && correspondeBloco;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.searchContainer}>
          {/* Botão de voltar */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Home")}
          >
            <FontAwesome name="arrow-left" size={24} color="#ddd" />
          </TouchableOpacity>

          {/* Pesquisa */}
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar"
            value={pesquisa}
            onChangeText={setPesquisa}
          />

          {/* Seletor de blocos */}
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={blocoSelecionado}
              onValueChange={(itemValue) => setBlocoSelecionado(itemValue)}
              style={styles.picker}
              dropdownIconColor="#888"
            >
              <Picker.Item
                label={
                  blocoSelecionado
                    ? `Bloco: ${blocoSelecionado}`
                    : "Bloco:"
                }
                value=""
                color="#888"
              />
              {blocos.map((bloco) => (
                <Picker.Item key={bloco} label={bloco} value={bloco} />
              ))}
            </Picker>
          </View>
        </View>

        <Text style={styles.dataTitulo}>
          Data selecionada:{" "}
          {new Date(dataSelecionada).toLocaleDateString("pt-BR")}
        </Text>

        <View style={styles.roomsGrid}>
          {salasFiltradas.length > 0 ? (
            salasFiltradas.map((sala) => (
              <TouchableOpacity
                key={sala.id_sala}
                style={styles.roomCard}
                onPress={() => handleSalaSelect(sala)}
              >
                <View style={styles.roomHeader}>
                  <Text style={styles.roomTitle}>{sala.numero}</Text>
                </View>
                <Text style={styles.roomTitle2}>{sala.descricao}</Text>
                <Text style={styles.roomTitle2}>Bloco: {sala.bloco}</Text>
                <Text style={styles.roomTitle2}>
                  Capacidade: {sala.capacidade}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.semResultados}>Nenhuma sala encontrada.</Text>
          )}
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

  blocoSelecionado: {
    marginHorizontal: 15,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: "#CC1E1E",
  },

  semResultados: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
    fontSize: 14,
  },

  scrollView: { flex: 1 },

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
    width: 80,
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
    padding: 10,
  },

  roomTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    padding: 0,
  },

  roomTitle2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 12,
    padding: 2,
  },
});
