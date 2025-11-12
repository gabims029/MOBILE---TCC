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
import { Calendar } from "react-native-calendars";
import api from "../axios/axios";
import ModalDeleteReserva from "../components/ModalDeleteReserva";

export default function TodasReservas() {
  const [reservas, setReservas] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSala, setSelectedSala] = useState(null);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const carregarReservasPorData = async (dataSelecionada) => {
    if (!dataSelecionada) return;
    try {
      setLoading(true);
      const response = await api.getReservasByData(dataSelecionada);
      console.log("Reservas recebidas:", response.data.reservaBySala);
      setReservas(response.data.reservaBySala || {});
    } catch (error) {
      console.log("Erro ao carregar reservas:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.error ||
          "Não foi possível carregar as reservas para esta data."
      );
      setReservas({});
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setModalVisible(false);
    if (selectedDate) {
      await carregarReservasPorData(selectedDate);
    }
  };

  const abrirModal = (reserva, nomeSala) => {
    setReservaSelecionada({
      id_reserva: reserva.id_reserva,
      nomeSala,
      horarioInicio: reserva.horario_inicio,
      horarioFim: reserva.horario_fim,
      nomeUsuario: reserva.nomeUsuario,
    });
    setModalVisible(true);
  };

  const renderReservaCard = (reserva, nomeSala, index) => (
    <TouchableOpacity
      key={index}
      style={styles.card}
      onPress={() => abrirModal(reserva, nomeSala)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.sala}>{nomeSala}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.usuario}>{reserva.nomeUsuario}</Text>
        <Text style={styles.periodoTexto}>
          {reserva.horario_inicio.slice(0, 5)} - {reserva.horario_fim.slice(0, 5)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Todas as reservas</Text>
      </View>

      {/* Calendário */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => {
            console.log("Dia selecionado:", day.dateString);
            setSelectedDate(day.dateString);
            carregarReservasPorData(day.dateString);
          }}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: "#B11010" },
          }}
          theme={{
            todayTextColor: "#B11010",
            selectedDayBackgroundColor: "#B11010",
            arrowColor: "#B11010",
          }}
        />
      </View>

      {/* Filtro por bloco */}
      <View style={styles.filtroContainer}>
        {["A", "B", "C", "D"].map((letra) => (
          <TouchableOpacity
            key={letra}
            style={[
              styles.filtroButton,
              selectedSala === letra && styles.filtroButtonAtivo,
            ]}
            onPress={() =>
              setSelectedSala(selectedSala === letra ? null : letra)
            }
          >
            <Text
              style={[
                styles.filtroText,
                selectedSala === letra && styles.filtroTextAtivo,
              ]}
            >
              {letra}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de reservas */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B11010" />
          <Text style={styles.loadingText}>Carregando reservas...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {selectedDate ? (
            Object.entries(reservas)
              .filter(([nomeSala]) =>
                selectedSala ? nomeSala.startsWith(selectedSala) : true
              )
              .map(([nomeSala, reservasSala]) => (
                <View key={nomeSala} style={styles.listaReservas}>
                  {reservasSala.map((reserva, index) =>
                    renderReservaCard(reserva, nomeSala, index)
                  )}
                </View>
              ))
          ) : (
            <Text style={styles.emptyText}>
              Selecione uma data para ver as reservas.
            </Text>
          )}
        </ScrollView>
      )}

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
  container: { flex: 1, backgroundColor: "#FFE9E9" },
  header: {
    backgroundColor: "#B11010",
    padding: 12,
    alignItems: "center",
  },
  headerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  calendarContainer: {
    margin: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 5,
    elevation: 3,
  },
  filtroContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 8,
  },
  filtroButton: {
    borderColor: "#B11010",
    borderWidth: 2,
    borderRadius: 12,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  filtroButtonAtivo: { backgroundColor: "#B11010" },
  filtroText: { fontSize: 18, fontWeight: "bold", color: "#B11010" },
  filtroTextAtivo: { color: "#fff" },
  scroll: { padding: 10 },
  listaReservas: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    flexBasis: "48%",
    maxWidth: "48%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    backgroundColor: "#B11010",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  cardBody: { padding: 10, alignItems: "center" },
  sala: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  usuario: { fontSize: 13, color: "#333", marginBottom: 4 },
  periodoTexto: { color: "#B11010", fontWeight: "600" },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE9E9",
  },
  loadingText: { marginTop: 10, color: "#B11010" },
});
