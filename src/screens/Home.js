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
import api from "../axios/axios";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const navigation = useNavigation();
  const [salas, setSalas] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null);

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
        Alert.alert("Erro", error.response.data.error);
      }
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView>
        {/* Botões das Salas */}
        <View style={styles.roomsRow}>
          {["A", "B", "C", "D"].map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={styles.roomButton}
              onPress={() => handleSalaSelect({ descricao: `Sala ${letter}` })}
            >
              <Text style={styles.roomButtonText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calendário */}
        <View style={styles.calendarContainer}>
          <Calendar
            monthFormat={"MMMM yyyy"}
            hideExtraDays={false}
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
  header: {
    backgroundColor: "#CC1E1E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
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
  calendarContainer: {
    backgroundColor: "#FEECEC",
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CC1E1E",
    padding: 10,
  },
});
