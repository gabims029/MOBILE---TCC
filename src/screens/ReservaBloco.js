import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import api from "../axios/axios";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";

export default function ReservaBloco({ route }) {
  const { sala, idUsuario } = route.params;
  const navigation = useNavigation();

  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [data, setData] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (data) {
      fetchHorarios(data);
    }
  }, [data]);

  async function fetchHorarios(selectedDate) {
    try {
      setLoading(true);
      setErro(false);
      const response = await api.getAllPeriodos();
      setHorarios(response.data.periodos);

      // A API precisa retornar algo como response.data.periodos
      setHorarios(response.data?.periodos || []);
    } catch (error) {
      console.log("Erro ao buscar horários:", error.response?.data || error);
      setErro(true);
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  }

  function toggleHorario(horario) {
    if (horario.status === "ocupado") return;
    setHorariosSelecionados((prev) =>
      prev.includes(horario.id_periodo)
        ? prev.filter((id) => id !== horario.id_periodo)
        : [...prev, horario.id_periodo]
    );
  }

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setData(formattedDate);
    }
  };

  async function confirmarReserva() {
  try {
    for (let i = 0; i < horariosSelecionados.length; i++) {
      const id_periodo = horariosSelecionados[i];
      const periodo = horarios.find((h) => h.id_periodo === id_periodo);

      await api.confirmarReserva({
        fk_id_user: idUsuario,
        fk_id_sala: sala.id_sala,
        fk_id_periodo: periodo.id_periodo,
        data_inicio: data,
        data_fim: data,
      });
    }

    Alert.alert("Sucesso", "Reserva confirmada!");
    setModalVisible(false);
    fetchHorarios(data);
    setHorariosSelecionados([]);
  } catch (error) {
    console.log(error.response?.data || error);
    Alert.alert("Erro", error.response?.data?.error || "Erro ao reservar");
    setModalVisible(false);
  }
}


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Botão voltar */}
        <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate("SalasPorBloco")}
              >
                <FontAwesome name="arrow-left" size={24} color="#ddd" />
              </TouchableOpacity>

        <View style={styles.tituloContainer}>
          <Text style={styles.tituloTexto}>
            Sala: {sala.numero} - {sala.descricao}
            </Text>
        </View>

        <View style={{ padding: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Selecione a data:</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowPicker(true)}
          >
            <Text>{data || "Selecione aqui"}</Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={data ? new Date(data) : new Date()}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
        </View>

        <View style={{ padding: 10, alignItems: "center" }}>
          {loading ? (
            <ActivityIndicator size="large" color="red" />
          ) : erro ? (
            <Text style={{ color: "red" }}>
              Erro ao carregar horários. Tente novamente.
            </Text>
          ) : horarios.length === 0 ? (
            <Text>Nenhum horário disponível.</Text>
          ) : (
            <View style={styles.horariosGrid}>
              {horarios.map((h) => {
                const selecionado = horariosSelecionados.includes(h.id_periodo);
                return (
                  <TouchableOpacity
                    key={h.id_periodo}
                    style={[
                      styles.horarioBtn,
                      h.status === "ocupado"
                        ? styles.ocupado
                        : selecionado
                        ? styles.selecionado
                        : styles.disponivel,
                    ]}
                    disabled={h.status === "ocupado"}
                    onPress={() => toggleHorario(h)}
                  >
                    <Text
                      style={[
                        styles.horarioTexto,
                        h.status === "ocupado"
                          ? { color: "#fff" }
                          : selecionado
                          ? { color: "#000" }
                          : { color: "#fff" },
                      ]}
                    >
                      {h.horario_inicio.slice(0, 5)} -{" "}
                      {h.horario_fim.slice(0, 5)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {horariosSelecionados.length > 0 && (
          <View style={{ alignItems: "center", marginVertical: 20 }}>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.reservarBtn}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Reservar
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          animationType="slide"
          transparent
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Confirmar Reserva</Text>
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                Sala: {sala.descricao}
              </Text>
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                Data: {data}
              </Text>
              <Text style={{ fontSize: 16, marginVertical: 5 }}>
                Horários:{" "}
                {horariosSelecionados
                  .map(
                    (id) =>
                      horarios
                        .find((h) => h.id_periodo === id)
                        ?.horario_inicio.slice(0, 5) +
                      " - " +
                      horarios
                        .find((h) => h.id_periodo === id)
                        ?.horario_fim.slice(0, 5)
                  )
                  .join(", ")}
              </Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelar}
                >
                  <Text style={{ fontWeight: "bold" }}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmarReserva}
                  style={styles.confirmar}
                >
                  <Text style={{ fontWeight: "bold", color: "#fff" }}>
                    CONFIRMAR
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F5" },
  tituloContainer: { backgroundColor: "#FFC9C9", padding: 16 },
  tituloTexto: { fontSize: 18, fontWeight: "bold", color: "#000" },
  dateButton: {
    width: 200,
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
  },
  horariosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  horarioBtn: {
    padding: 12,
    margin: 6,
    borderRadius: 6,
    minWidth: 120,
    alignItems: "center",
  },
  disponivel: { backgroundColor: "#81c784" },
  ocupado: { backgroundColor: "#e57373" },
  selecionado: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "red",
  },
  horarioTexto: { fontWeight: "bold" },
  reservarBtn: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
  },
  cancelar: {
    backgroundColor: "#F8BFC0",
    padding: 10,
    minWidth: 100,
    alignItems: "center",
    borderRadius: 5,
    marginRight: 5,
  },
  confirmar: {
    backgroundColor: "#66bb6a",
    padding: 10,
    minWidth: 100,
    alignItems: "center",
    borderRadius: 5,
    marginLeft: 5,
  },
  backButton: {
    padding: 1,
    alignSelf: "flex-start",
    margin: 5,
    borderRadius: 4,
    paddingHorizontal: 5,
    borderColor: "#ddd",
    right: 5,
  },
  icon: { margin: 10 },
});
