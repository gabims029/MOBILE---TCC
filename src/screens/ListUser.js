import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import api from "../axios/axios";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import ModalExcluirUser from "../components/ModalExcluirUser"; // importa o modal

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const response = await api.getUsuarios();
      console.log("Resposta da API:", response.data);
      setUsuarios(response.data.users);
    } catch (error) {
      console.log("Erro ao carregar usuários:", error);
    }
  }

  // Função chamada ao clicar na lixeira
  const handleOpenModal = (usuario) => {
    setUsuarioSelecionado(usuario);
    setModalVisible(true);
  };

  // Função chamada após exclusão
  const handleDeleted = () => {
    setModalVisible(false);
    carregarUsuarios(); // recarrega lista após exclusão
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleOpenModal(item)}
        style={styles.trashButton}
      >
        <FontAwesome name="trash" size={22} color="#B11010" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.content}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("Home")}
      >
        <FontAwesome name="arrow-left" size={24} color="#ddd" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>LISTA DE USUÁRIOS</Text>

        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id_user.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Modal de exclusão */}
      <ModalExcluirUser
        visible={modalVisible}
        usuario={usuarioSelecionado}
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
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    width: "100%",
  },
  infoContainer: {
    flexDirection: "column",
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  email: {
    fontSize: 14,
    color: "#777",
  },
  trashButton: {
    padding: 8,
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

export default ListaUsuarios;