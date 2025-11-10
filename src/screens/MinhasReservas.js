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
      const idUsuario = await SecureStore.getItemAsync("id");
      if (!idUsuario) {
        Alert.alert("Erro", "ID do usuário não encontrado.");
        setLoading(false);
        return;
      }

      const response = await api.getSchedulesByUserID(idUsuario);
      setReservas(response.data.reservas || {});
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

  const renderReservaCard = (reserva, dia) => {
    const passou = reserva.periodos.some((p) => p.passou);
    const diasFormatados =
      reserva.dias && reserva.dias.length > 0
        ? Array.isArray(reserva.dias)
          ? reserva.dias.join(", ")
          : reserva.dias
        : "—";

    return (
      <TouchableOpacity
        key={reserva.nomeSalaDisplay + reserva.descricaoDetalhe + dia}
        style={[styles.card, passou && styles.cardPassado]}
        onPress={() => abrirModal(reserva, dia)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.sala}>{reserva.nomeSalaDisplay}</Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.descricao}>{reserva.descricaoDetalhe}</Text>
          <Text style={styles.diasReservados}>{diasFormatados}</Text>

          {reserva.periodos.map((p, index) => (
            <View key={index} style={styles.periodoBadge}>
              <Text style={styles.periodoTexto}>
                {p.horario_inicio} - {p.horario_fim}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B11010" />
        <Text style={styles.loadingText}>Carregando suas reservas...</Text>
      </View>
    );
  }

  // ✅ Corrigido: data local e formato brasileiro
  const getDiaSemana = (dataStr) => {
    if (!dataStr) return "";
    const [ano, mes, dia] = dataStr.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);
    const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return dias[data.getDay()];
  };

  // ✅ Formata data para o padrão brasileiro
  const formatarDataBrasileira = (dataStr) => {
    if (!dataStr) return "";
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
  };

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
              <Text style={styles.diaTitulo}>
                {getDiaSemana(dia)} : {formatarDataBrasileira(dia)}
              </Text>
              <View style={styles.listaReservas}>
                {reservas[dia].map((reserva) =>
                  renderReservaCard(reserva, dia)
                )}
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#B11010",
    marginBottom: 10,
    textAlign: "center",
    backgroundColor: "#FFD3D3",
    borderRadius: 10,
    paddingVertical: 6,
  },
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
  cardPassado: {
    opacity: 0.6,
  },
  cardHeader: {
    backgroundColor: "#B11010",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 6,
    alignItems: "center",
  },
  cardBody: {
    padding: 10,
    alignItems: "center",
  },
  sala: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
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
  periodoTexto: {
    color: "#B11010",
    fontWeight: "600",
  },
  diasReservados: {
    marginTop: 6,
    fontSize: 13,
    color: "#B11010",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
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
