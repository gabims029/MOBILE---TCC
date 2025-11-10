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
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSala, setSelectedSala] = useState(null);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 🔄 Carrega todas as reservas
  const carregarTodasReservas = async () => {
    try {
      setLoading(true);
      const response = await api.getTodasReservas();
      setReservas(response.data.reservas || {});
    } catch (error) {
      console.log("Erro ao carregar todas as reservas:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Não foi possível carregar as reservas."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTodasReservas();
  }, []);

  const handleDelete = async () => {
    setModalVisible(false);
    await carregarTodasReservas();
  };

  const abrirModal = (reserva, dia) => {
    const periodo = reserva.periodos?.[0] || {};
    setReservaSelecionada({
      id_reserva: periodo.id_reserva,
      nomeSala: reserva.nomeSalaDisplay,
      descricao: reserva.descricaoDetalhe,
      data: dia,
      horarioInicio: periodo.horario_inicio,
      horarioFim: periodo.horario_fim,
    });
    setModalVisible(true);
  };

  // 💳 Renderiza um cartão de reserva
  const renderReservaCard = (reserva, dia, index) => {
    const passou = reserva.periodos?.some((p) => p.passou);
    const diasFormatados =
      reserva.dias && reserva.dias.length > 0
        ? Array.isArray(reserva.dias)
          ? reserva.dias.join(", ")
          : reserva.dias
        : "—";

    return (
      <TouchableOpacity
        // 🔐 key única e segura
        key={`${reserva?.id_reserva || index}-${dia}`}
        style={[styles.card, passou && styles.cardPassado]}
        onPress={() => abrirModal(reserva, dia)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.sala}>{reserva?.nomeSalaDisplay || "Sala ?"}</Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.descricao}>
            {reserva?.descricaoDetalhe || "Sem descrição"}
          </Text>
          <Text style={styles.diasReservados}>{diasFormatados}</Text>

          {reserva?.periodos?.map((p, idx) => (
            <View key={idx} style={styles.periodoBadge}>
              <Text style={styles.periodoTexto}>
                {p.horario_inicio} - {p.horario_fim}
              </Text>
            </View>
          ))}
          <Text style={styles.usuario}>
            Usuário: {reserva?.nomeUsuario || "—"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B11010" />
        <Text style={styles.loadingText}>Carregando reservas...</Text>
      </View>
    );
  }

  const reservasDoDia = selectedDate ? reservas[selectedDate] || [] : [];

  // 🧩 Filtro de sala com fallback seguro
  const reservasFiltradas =
    selectedSala && reservasDoDia.length > 0
      ? reservasDoDia.filter((r) =>
          (r?.nomeSalaDisplay || "").toUpperCase().includes(selectedSala)
        )
      : reservasDoDia;

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Todas as reservas</Text>
      </View>

      {/* Calendário */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => {
            console.log("Dia selecionado:", day.dateString);
            setSelectedDate(day.dateString);
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

      {/* Filtro por sala */}
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
      <ScrollView contentContainerStyle={styles.scroll}>
        {selectedDate ? (
          reservasFiltradas.length > 0 ? (
            <View style={styles.listaReservas}>
              {reservasFiltradas.map((reserva, index) =>
                renderReservaCard(reserva, selectedDate, index)
              )}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              Nenhuma reserva para {selectedDate}
              {selectedSala ? ` na sala ${selectedSala}` : ""}.
            </Text>
          )
        ) : (
          <Text style={styles.emptyText}>
            Selecione um dia no calendário para ver as reservas.
          </Text>
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
  cardPassado: { opacity: 0.6 },
  cardHeader: {
    backgroundColor: "#B11010",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  cardBody: { padding: 10, alignItems: "center" },
  sala: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  descricao: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  periodoBadge: {
    backgroundColor: "#FFD3D3",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  periodoTexto: { color: "#B11010", fontWeight: "600" },
  diasReservados: {
    marginTop: 6,
    fontSize: 13,
    color: "#B11010",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  usuario: { fontSize: 12, color: "#333", marginTop: 4 },
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
