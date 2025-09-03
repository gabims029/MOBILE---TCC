import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import api from "../axios/axios";

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      const response = await api.get("/usuarios"); // Ajuste se sua rota for diferente
      setUsuarios(response.data);
    } catch (error) {
      console.log("Erro ao carregar usuários:", error);
    }
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>{item.email}</Text>
    </View>
  );

  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <Text style={styles.title}>LISTA DE USUÁRIOS</Text>
        <FlatList
          data={usuarios}
          keyExtractor={(item) => item.id_usuario.toString()}
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
    backgroundColor: "#CC1E1E", // vermelho do card
    width: "90%",
    borderRadius: 0,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    height: "95%",
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
});

export default ListaUsuarios;
