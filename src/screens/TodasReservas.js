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
import { Calendar } from "react-native-calendars";
import api from "../axios/axios";
import { useNavigation } from "@react-navigation/native";
import ModalDeleteReserva from "../components/ModalDeleteReserva";

export default function TodasReservas() {
  const navigation = useNavigation();

  const [reservas, setReservas] = useState([]);
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  useEffect(() => {
    getTodasReservas();
  }, []);

  async function getTodasReservas() {
    try {
      const response = await api.getTodasReservas();
      const schedulesByDay = response.data.reservas;
      const todasReservas = Object.values(schedulesByDay).flat();

      setReservas(todasReservas);
      setReservasFiltradas(todasReservas);
    } catch (error) {
      console.error("Erro ao buscar reservas:", error);
      Alert.alert("Erro", error.response?.data?.error || "Erro ao buscar reservas.");
    }
  }

  const handleDayPress = (day) => {
    const data = day.dateString;
    setDataSelecionada(data);
    aplicarFiltroPorData(data);
  };

  const aplicarFiltroPorData = (data) => {
    if (!data) {
      setReservasFiltradas(reservas);
      return;
    }

    const filtradas = reservas.filter((reserva) => {
      const dataInicio = reserva.dataInicio?.substring(0, 10);
      const dataFim = reserva.dataFim?.substring(0, 10);
      return dataInicio <= data && dataFim >= data;
    });

    setReservasFiltradas(filtradas);
  };

  const handleReservaSelect = (reserva) => {
    setReservaSelecionada(reserva);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Todas as Reservas</Text>

        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            [dataSelecionada]: {
              selected: true,
              selectedColor: "#CC1E1E",
              selectedTextColor: "white",
            },
          }}
          theme={{
            todayTextColor: "#CC1E1E",
            arrowColor: "#CC1E1E",
          }}
          style={styles.calendar}
        />

        <Text style={styles.subtitle}>
          {dataSelecionada
            ? `Reservas em ${dataSelecionada}`
            : "Selecione uma data no calendário"}
        </Text>

        <View style={styles.roomsGrid}>
          {reservasFiltradas.length === 0 ? (
            <Text style={styles.noReserva}>Nenhuma reserva encontrada.</Text>
          ) : (
            reservasFiltradas.map((reserva, index) => (
              <TouchableOpacity
                key={`${reserva.id_reserva || reserva.id || "reserva"}-${index}`}
                style={styles.roomCard}
                onPress={() => handleReservaSelect(reserva)}
              >
                <View style={styles.roomHeader}>
                  <Text style={styles.roomTitle}>
                    {reserva.classroomName ||
                      reserva.descricaoSala ||
                      "Sala não identificada"}
                  </Text>
                </View>

                <Text style={styles.roomTitle2}>
                  Usuário: {reserva.nomeUsuario || "-"}
                </Text>
                <Text style={styles.roomTitle2}>
                  Período: {reserva.periodo || "-"}
                </Text>
                <Text style={styles.roomTitle2}>
                  Início: {reserva.dataInicio?.substring(0, 10) || "-"}
                </Text>
                <Text style={styles.roomTitle2}>
                  Fim: {reserva.dataFim?.substring(0, 10) || "-"}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.voltarButton}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Voltar</Text>
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
  container: { flex: 1, backgroundColor: "#FFF5F5" },
  scrollView: { flex: 1 },
  title: {
    fontSize: 24,
    color: "#CC1E1E",
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 15,
  },
  calendar: {
    margin: 15,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 10,
    color: "#333",
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
    height: 160,
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
    height: 40,
    borderRadius: 6,
    backgroundColor: "#CC1E1E",
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
