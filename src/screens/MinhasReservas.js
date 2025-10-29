import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import api from "../axios/axios";
import ModalDeleteReserva from "../components/ModalDeleteReserva";

export default function MinhasReservas() {
  const [reservas, setReservas] = useState({});
  const [loading, setLoading] = useState(true);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const carregarReservas = async () => {
    try {
      setLoading(true);
      const idUsuario = await SecureStore.getItemAsync("id_usuario");

      if (!idUsuario) {
        Alert.alert("Erro", "ID do usuário não encontrado.");
        setLoading(false);
        return;
      }

      const response = await api.get(`/reserva/usuario/${idUsuario}`);

      setReservas(response.data.schedule || {});
    } catch (error) {
      console.log("Erro ao carregar reservas:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Não foi possível carregar suas reservas."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarReservas();
  }, []);

  const handleDelete = async () => {
    setModalVisible(false);
    await carregarReservas();
  };

  const renderReservaCard = (reserva) => (
    <TouchableOpacity
      key={reserva.id}
      style={styles.card}
      onPress={() => {
        setReservaSelecionada(reserva);
        setModalVisible(true);
      }}
    >
      <Text style={styles.sala}>{reserva.classroomName || "Sala"}</Text>
      <Text style={styles.text}>
        Início: {new Date(reserva.horaInicio).toLocaleDateString()}
      </Text>
      <Text style={styles.text}>
        Fim: {new Date(reserva.horaFim).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B11010" />
        <Text style={styles.loadingText}>Carregando suas reservas...</Text>
      </View>
    );
  }

  const diasComReservas = Object.keys(reservas).filter(
    (dia) => reservas[dia].length > 0
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {diasComReservas.length === 0 ? (
          <Text style={styles.emptyText}>Você não possui reservas.</Text>
        ) : (
          diasComReservas.map((dia) => (
            <View key={dia} style={styles.diaContainer}>
              <Text style={styles.diaTitulo}>{dia}</Text>
              <View style={styles.listaReservas}>
                {reservas[dia].map((reserva) => renderReservaCard(reserva))}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <ModalDeleteReserva
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        reserva={reservaSelecionada}
        onDeleted={handleDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE9E9",
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  diaContainer: {
    marginBottom: 25,
  },
  diaTitulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#B11010",
    marginBottom: 10,
    textAlign: "center",
  },
  listaReservas: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 150,
    padding: 10,
    margin: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: "center",
  },
  sala: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B11010",
    marginBottom: 5,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE9E9",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: "#B11010",
  },
});
