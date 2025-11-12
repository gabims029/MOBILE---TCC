import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { Calendar } from "react-native-calendars";
import { Snackbar } from "react-native-paper";

export default function Home() {
  const navigation = useNavigation();
  const [idUsuario, setIdUsuario] = useState(null);
  const [blocoSelecionado, setBlocoSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("#CC1E1E");

  useEffect(() => {
    getSecureData();
  }, []);

  const getSecureData = async () => {
    try {
      const value = await SecureStore.getItemAsync("id");
      if (!value) {
        setSnackbarMessage("Usuário não identificado. Faça login novamente.");
        setSnackbarColor("#CC1E1E");
        setSnackbarVisible(true);
      }
      setIdUsuario(value);
    } catch (error) {
      setSnackbarMessage("Erro ao recuperar dados do usuário.");
      setSnackbarColor("#CC1E1E");
      setSnackbarVisible(true);
    }
  };

  const handleBlocoSelect = (bloco) => {
    if (!idUsuario) {
      setSnackbarMessage("Você precisa estar logado para acessar as salas.");
      setSnackbarColor("#CC1E1E");
      setSnackbarVisible(true);
      return;
    }
    setBlocoSelecionado(bloco);
    navigation.navigate("SalasPorBloco", { bloco, idUsuario });
  };

  const handleDateSelect = (date) => {
    if (!idUsuario) {
      setSnackbarMessage("Faça login antes de visualizar as salas.");
      setSnackbarColor("#CC1E1E");
      setSnackbarVisible(true);
      return;
    }

    navigation.navigate("SalasPorData", {
      dataSelecionada: date.toISOString().split("T")[0],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Título */}
        <Text style={styles.welcomeText}>SEJA BEM-VINDO AO</Text>
        <Text style={styles.welcomeTextBold}>RESERVAS SENAI</Text>

        {/* Texto de instrução */}
        <Text style={styles.subTitle}>
          Selecione um bloco para fazer sua reserva:
        </Text>

        {/* Botões dos blocos */}
        <View style={styles.roomsRow}>
          {["A", "B", "C", "D"].map((bloco, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.roomButton,
                blocoSelecionado === bloco && { backgroundColor: "#CC1E1E" },
              ]}
              onPress={() => handleBlocoSelect(bloco)}
            >
              <Text
                style={[
                  styles.roomButtonText,
                  blocoSelecionado === bloco && { color: "#FFF" },
                ]}
              >
                {bloco}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Texto acima do calendário */}
        <Text style={styles.calendarTitle}>Visualizar salas disponíveis:</Text>

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
            onDayPress={(day) => {
              setDataSelecionada(day.dateString);
              handleDateSelect(new Date(day.dateString));
            }}
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

      {/* Snackbar personalizado */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2500}
        style={[styles.snackbar, { backgroundColor: snackbarColor }]}
      >
        <Text style={styles.snackbarText}>{snackbarMessage}</Text>
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFECEC",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
  },
  welcomeText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#000",
    marginTop: 15,
    textAlign: "center",
  },
  welcomeTextBold: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 40,
  },
  subTitle: {
    fontSize: 15,
    color: "#000",
    marginBottom: 5,
    textAlign: "center",
  },
  roomsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
    marginTop: 6,
    marginBottom: 50,
  },
  roomButton: {
    backgroundColor: "#FFF",
    borderColor: "#CC1E1E",
    borderWidth: 1,
    width: 70,
    height: 70,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  roomButtonText: {
    color: "#CC1E1E",
    fontSize: 30,
    fontWeight: "bold",
  },
  calendarTitle: {
    fontSize: 15,
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  calendarContainer: {
    backgroundColor: "#FFF",
    width: "90%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CC1E1E",
    padding: 10,
  },
  snackbar: {
    borderRadius: 10,
    marginBottom: 30,
    alignSelf: "center",
    width: "90%",
  },
  snackbarText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
});
