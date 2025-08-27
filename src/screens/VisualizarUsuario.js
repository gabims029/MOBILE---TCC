import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../axios/axios";

export default function VisualizarUsuario( ) {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const response = await api.get("/user"); 
        setUsuarios(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchUsuarios();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("Lista de Usuário", { id: item.id })}
    >
      <Text style={styles.email}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={24} color="white" />
        <Text style={styles.headerText}>Lista de Usuários</Text>
      </View>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c62828",
    padding: 15,
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
  listContainer: {
    padding: 10,
  },
  item: {
    backgroundColor: "#c62828",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  email: {
    color: "white",
    fontSize: 16,
  },
});
