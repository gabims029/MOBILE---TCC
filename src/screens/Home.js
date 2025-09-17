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

  // Quando clicar em um bloco
  const handleBlocoSelect = (bloco) => {
    navigation.navigate("SalasPorBloco", { bloco, idUsuario });
  };

  //Quando clicar em uma data do calendário
  const handleDateSelect = (date) => {
    navigation.navigate("SalasPorData", { 
      dataSelecionada: date.toISOString().split("T")[0]
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
                  blocoSelecionado === bloco && { color: "white" },
                ]}
              >
                {bloco}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
              handleDateSelect(new Date(day.dateString)); // navega
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
    backgroundColor: "#FFF5F5", // fundo rosado
  },

  // Linha dos blocos
  roomsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 35,
    marginBottom: 80,
  },
  roomButton: {
    backgroundColor: "#FFF", // fundo branco
    borderColor: "#CC1E1E",
    borderWidth: 1,
    width: 80,
    height: 80,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  roomButtonText: {
    color: "#CC1E1E",
    fontSize: 35,
    fontWeight: "bold",
  },

  // Calendário
  calendarContainer: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CC1E1E",
    padding: 10,
    marginBottom: 15,
  },
});
