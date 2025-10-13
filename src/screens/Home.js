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
import { Calendar } from "react-native-calendars";

export default function Home() {
  const navigation = useNavigation();
  const [idUsuario, setIdUsuario] = useState(null);
  const [blocoSelecionado, setBlocoSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);

  useEffect(() => {
    getSecureData();
  }, []);

  const getSecureData = async () => {
    const value = await SecureStore.getItemAsync("id");
    setIdUsuario(value);
  };

  const handleBlocoSelect = (bloco) => {
    setBlocoSelecionado(bloco);
    navigation.navigate("SalasPorBloco", { bloco, idUsuario });
  };

  const handleDateSelect = (date) => {
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
        <Text style={styles.subTitle}>Selecione um bloco para fazer sua reserva:</Text>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFECEC", // fundo rosado mais suave
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
  },

  // Cabeçalho
  header: {
    width: "100%",
    backgroundColor: "#CC1E1E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  profileIcon: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#CC1E1E",
  },
  headerTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Textos principais
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

  // Blocos
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

  // Calendário
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
});
