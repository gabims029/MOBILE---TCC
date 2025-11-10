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

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>{item.email}</Text>
      <TouchableOpacity style={styles.deleteButton}>
        <FontAwesome name="trash" size={20} color="#fff" />
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
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#FCECEC", // fundo rosado claro
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#D32F2F", // fundo vermelho intenso
    width: "90%",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    height: "95%",
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 10,
    marginBottom: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between", // Para ter a lixeira na direita
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    flex: 1, // Faz com que o texto ocupe o espaço restante
  },
  deleteButton: {
    backgroundColor: "#D32F2F", // fundo vermelho para o botão de deletar
    borderRadius: 50,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    padding: 10,
    alignSelf: "flex-start",
    margin: 5,
    borderRadius: 4,
    paddingHorizontal: 20,
    borderColor: "#ddd",
  },
});

export default ListaUsuarios;
