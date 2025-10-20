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
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate("PerfilAdmin", { idUsuario: item.id_user })}
    >
      <Text style={styles.text}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <Text style={styles.title}> USUÁRIOS CADASTRADOS </Text>
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
    backgroundColor: "#CC1E1E", // fundo vermelho
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
    width: "200%", 
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 12,
    alignSelf: "center", // garante que fique centralizada
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "center", 
     },
});



export default ListaUsuarios;
