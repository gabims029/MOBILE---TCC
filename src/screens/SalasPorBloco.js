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
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { FontAwesome } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import api from "../axios/axios";

export default function SalasPorBloco() {
  const navigation = useNavigation();
  const route = useRoute();

  const { bloco: blocoInicial, idUsuario: idUsuarioParam } = route.params || {};

  const [salas, setSalas] = useState([]);
  const [idUsuario, setIdUsuario] = useState(idUsuarioParam || null);
  const [blocoSelecionado, setBlocoSelecionado] = useState(blocoInicial || "");
  const [pesquisa, setPesquisa] = useState("");

  useEffect(() => {
    getSalas();
    getSecureData();
  }, []);

  const getSecureData = async () => {
    const value = await SecureStore.getItemAsync("id");
    if (value) setIdUsuario(value);
  };

  async function getSalas() {
    try {
      const response = await api.getSalas();
      setSalas(response.data.salas);
    } catch (error) {
      Alert.alert("Erro", error.response?.data?.error || "Erro ao carregar salas.");
    }
  }

  const handleSalaSelect = (sala) => {
    navigation.navigate("ReservaBloco", { sala, idUsuario });
  };

  const blocos = [...new Set(salas.map((s) => s.bloco))];

  // Pesquisa
  const salasFiltradas = salas.filter((sala) => {
    const termo = pesquisa.toLowerCase();
    const correspondePesquisa =
      sala.descricao.toLowerCase().includes(termo) ||
      sala.numero.toLowerCase().includes(termo);
    const correspondeBloco = blocoSelecionado
      ? sala.bloco === blocoSelecionado
      : true;

    return correspondePesquisa && correspondeBloco;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.searchContainer}>
          {/* Botão Voltar */}
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
            placeholderTextColor="#999"
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
                    : "Selecione um bloco"
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
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
    margin: 10,
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
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "white",
    borderRadius: 4,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: -11,
    right: 18,
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
    fontSize: 13.5,
    padding: 0,
  },
  roomTitle2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 12,
    padding: 2,
  },
  semResultados: {
    textAlign: "center",
    marginTop: 20,
    color: "#555",
    fontSize: 14,
  },
});
