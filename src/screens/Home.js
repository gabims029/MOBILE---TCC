import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import api from "../axios/axios";
import { Calendar } from "react-native-calendars";

export default function Home() {
  const navigation = useNavigation();
  const [salas, setSalas] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);
  const [blocoSelecionado, setBlocoSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);

  useEffect(() => {
    getSalas();
    getSecureData();
  }, []);

  const handleSalaSelect = (sala) => {
    navigation.navigate("Reserva", { sala: sala, idUsuario: idUsuario });
  };

  const getSecureData = async () => {
    const value = await SecureStore.getItemAsync("id");
    setIdUsuario(value);
  };

  async function getSalas() {
    await api.getSalas().then(
      (response) => {
        setSalas(response.data.salas);
      },
      (error) => {
        Alert.alert("Erro", error.response?.data?.error || "Erro ao buscar salas");
      }
    );
  }

  // Filtra salas por bloco e data selecionada
  const salasFiltradas = salas.filter((sala) => {
    const blocoOk = blocoSelecionado ? sala.bloco === blocoSelecionado : true;
    const dataOk = dataSelecionada
      ? sala.datasDisponiveis?.includes(dataSelecionada)
      : true;
    return blocoOk && dataOk;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Botões dos Blocos */}
        <View style={styles.roomsRow}>
          {["A", "B", "C", "D"].map((bloco, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.roomButton,
                blocoSelecionado === bloco && { backgroundColor: "#CC1E1E" },
              ]}
              onPress={() =>
                setBlocoSelecionado(blocoSelecionado === bloco ? null : bloco)
              }
            >
              <Text
                style={[
                  styles.roomButtonText,
                  blocoSelecionado === bloco && { color: "white" },
                ]}
              >
                {bloco}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Lista de Salas Filtradas */}
        <View style={styles.roomsGrid}>
          {salasFiltradas.length > 0 ? (
            salasFiltradas.map((sala) => (
              <TouchableOpacity
                key={sala.id_sala}
                style={styles.roomCard}
                onPress={() => handleSalaSelect(sala)}
              >
                <View style={styles.roomHeader}>
                  <Text style={styles.roomTitle}>{sala.descricao}</Text>
                </View>
                <Text style={styles.roomTitle2}>
                  Capacidade: {sala.capacidade}
                </Text>
                <Text style={styles.roomTitle2}>
                  N° da sala: {sala.numero}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noRoomsText}>
              Nenhuma sala encontrada para {blocoSelecionado || "todos os blocos"}{" "}
              {dataSelecionada ? `em ${dataSelecionada}` : ""}
            </Text>
          )}
        </View>

        {/* Calendário */}
        <View style={styles.calendarContainer}>
          <Calendar
            monthFormat={"MMMM yyyy"}
            hideExtraDays={false}
            markedDates={{
              [dataSelecionada]: {
                selected: true,
                selectedColor: "#CC1E1E",
                selectedTextColor: "white",
              },
            }}
            onDayPress={(day) => setDataSelecionada(day.dateString)}
            theme={{
              textMonthFontWeight: "bold",
              textMonthFontSize: 18,
              arrowColor: "#CC1E1E",
              textDayFontWeight: "500",
              todayTextColor: "#CC1E1E",
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  roomsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  roomButton: {
    backgroundColor: "#FEECEC",
    borderColor: "#CC1E1E",
    borderWidth: 1,
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  roomButtonText: {
    color: "#CC1E1E",
    fontSize: 20,
    fontWeight: "bold",
  },
  roomsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  roomCard: {
    backgroundColor: "white",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "48%",
    height: 130,
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
    fontSize: 14,
    padding: 2,
  },
  noRoomsText: {
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
    marginTop: 10,
  },
  calendarContainer: {
    backgroundColor: "#FEECEC",
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CC1E1E",
    padding: 10,
  },
});
