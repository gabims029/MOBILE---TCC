import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import api from "../axios/axios";
import { useNavigation } from "@react-navigation/native";
import ModalDeleteReserva from "../components/ModalDeleteReserva";

export default function TodasReservas() {
  const navigation = useNavigation();
  const [reservas, setReservas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  useEffect(() => {
    getTodasReservas();
  }, []);

  async function getTodasReservas() {
    await api.getTodasReservas().then(
      (response) => {
        console.log(response.data);
        setReservas(response.data.reservas || []);
      },
      (error) => {
        Alert.alert(
          "Erro",
          error.response?.data?.error || "Erro ao buscar reservas."
        );
      }
    );
  }

  const handleReservaSelect = (reserva) => {
    setReservaSelecionada(reserva);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Todas as Reservas</Text>
        <View style={styles.roomsGrid}>
          {reservas.length === 0 ? (
            <Text style={styles.noReserva}>Nenhuma reserva encontrada.</Text>
          ) : (
            reservas.map((reserva) => (
              <TouchableOpacity
                key={reserva.id_reserva}
                style={styles.roomCard}
                onPress={() => handleReservaSelect(reserva)}
              >
                <View style={styles.roomHeader}>
                  <Text style={styles.roomTitle}>{reserva.descricao}</Text>
                </View>
                <Text style={styles.roomTitle2}>Data: {reserva.data}</Text>
                <Text style={styles.roomTitle2}>
                  Início: {reserva.horarioInicio}
                </Text>
                <Text style={styles.roomTitle2}>Fim: {reserva.horarioFim}</Text>
                <Text style={styles.roomTitle2}>
                  Usuário: {reserva.nomeUsuario}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.voltarButton}
        >
          <Text>Voltar</Text>
        </TouchableOpacity>
      </ScrollView>

      <ModalDeleteReserva
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        reserva={reservaSelecionada}
        onDeleted={() => {
          setModalVisible(false);
          getTodasReservas();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  title: {
    fontSize: 24,
    color: "#CC1E1E",
    fontWeight: "bold",
    marginBottom: 20,
    alignSelf: "center",
    marginTop: 15,
  },
  scrollView: {
    flex: 1,
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
    height: 150,
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
    fontSize: 13,
    padding: 2,
  },
  voltarButton: {
    width: "90%",
    height: 30,
    borderRadius: 3,
    backgroundColor: "#FF3F3F",
    margin: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  noReserva: {
    fontSize: 16,
    color: "#CC1E1E",
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 30,
  },
});
