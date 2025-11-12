import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import sheets from "../axios/axios";
import ModalExcluirSala from "../components/ModalExcluirSala";

const ListSalas = () => {
  const [salas, setSalas] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    carregarSalas();
  }, []);

  async function carregarSalas() {
    try {
      const response = await sheets.getSalas();
      console.log("Resposta da API (salas):", response.data);
      setSalas(response.data.salas || []);
    } catch (error) {
      console.log("Erro ao carregar salas:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (sala) => {
    setSalaSelecionada(sala);
    setModalVisible(true);
  };

  const handleDeleted = () => {
    setModalVisible(false);
    carregarSalas();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.nome}>Sala {item.numero}</Text>
        {item.descricao && <Text style={styles.descricao}>{item.descricao}</Text>}
        {item.capacidade && (
          <Text style={styles.descricao}>
            Capacidade: {item.capacidade} pessoas
          </Text>
        )}
        {item.bloco && <Text style={styles.descricao}>Bloco: {item.bloco}</Text>}
      </View>
      <TouchableOpacity
        onPress={() => handleOpenModal(item)}
        style={styles.trashButton}
      >
        <FontAwesome name="trash" size={22} color="#B11010" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.content, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#CC1E1E" />
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <FontAwesome name="arrow-left" size={24} color="#ddd" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>LISTA DE SALAS</Text>

        {salas.length === 0 ? (
          <Text style={{ color: "white", fontSize: 16 }}>
            Nenhuma sala cadastrada.
          </Text>
        ) : (
          <FlatList
            data={salas}
            keyExtractor={(item) =>
              item.id_sala ? item.id_sala.toString() : Math.random().toString()
            }
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <ModalExcluirSala
        visible={modalVisible}
        sala={salaSelecionada}
        onCancel={() => setModalVisible(false)}
        onDeleted={handleDeleted}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#FCECEC",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#CC1E1E",
    width: "90%",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    height: "95%",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    width: "100%",
  },
  infoContainer: {
    flexDirection: "column",
    paddingRight: 10,
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  descricao: {
    fontSize: 14,
    color: "#777",
  },
  trashButton: {
    padding: 0,
    marginLeft: -15,
  },
  backButton: {
    padding: 1,
    alignSelf: "flex-start",
    margin: 5,
    borderRadius: 4,
    paddingHorizontal: 20,
    borderColor: "#ddd",
    right: 20,
  },
});

export default ListSalas;