import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import api from "../axios/axios";

export default function ReservaBloco({ route, navigation }) {
  const { sala, idUsuario } = route.params;

  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);

  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [showPickerInicio, setShowPickerInicio] = useState(false);
  const [showPickerFim, setShowPickerFim] = useState(false);

  const [diasSemana, setDiasSemana] = useState([]);
  const [diasSelecionados, setDiasSelecionados] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchDiasSemana();
  }, []);

  useEffect(() => {
    if (dataInicio) fetchHorarios();
  }, [dataInicio]);

  async function fetchDiasSemana() {
    try {
      const res = await api.getDiasSemana(); // endpoint da API que retorna os dias
      setDiasSemana(
        res.data.dias || ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
      );
    } catch {
      setDiasSemana(["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]);
    }
  }

  async function fetchHorarios() {
    try {
      setLoading(true);
      setErro(false);
      const res = await api.getAllPeriodos();
      setHorarios(res.data.periodos || []);
    } catch (error) {
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

  function toggleDia(dia) {
    setDiasSelecionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  }

  const onChangeInicio = (event, selectedDate) => {
    setShowPickerInicio(false);
    if (selectedDate) setDataInicio(selectedDate.toISOString().split("T")[0]);
  };

  const onChangeFim = (event, selectedDate) => {
    setShowPickerFim(false);
    if (selectedDate) setDataFim(selectedDate.toISOString().split("T")[0]);
  };

  async function confirmarReserva() {
    if (
      !dataInicio ||
      !dataFim ||
      diasSelecionados.length === 0 ||
      horariosSelecionados.length === 0
    ) {
      return Alert.alert(
        "Atenção",
        "Selecione datas, dias da semana e horários!"
      );
    }

    try {
      for (const id_periodo of horariosSelecionados) {
        await api.createReserva({
          fk_id_user: idUsuario,
          fk_id_sala: sala.id_sala,
          fk_id_periodo: id_periodo,
          dias: diasSelecionados,
          data_inicio: dataInicio,
          data_fim: dataFim,
        });
      }

      Alert.alert("Sucesso", "Reserva realizada com sucesso!");
      setModalVisible(false);
      setHorariosSelecionados([]);
      setDiasSelecionados([]);
      setDataInicio("");
      setDataFim("");
      fetchHorarios();
    } catch (error) {
      Alert.alert("Erro", error.response?.data?.error || "Erro ao reservar");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={24} color="#ddd" />
        </TouchableOpacity>

        {/* Sala */}
        <View style={styles.tituloContainer}>
          <Text style={styles.tituloTexto}>
            Sala: {sala.numero} - {sala.descricao}
          </Text>
        </View>

        {/* Datas */}
        <View style={styles.dataContainer}>
          <Text style={styles.label}>Data Início:</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowPickerInicio(true)}
          >
            <Text>{dataInicio || "Selecione a data"}</Text>
          </TouchableOpacity>
          {showPickerInicio && (
            <DateTimePicker
              value={dataInicio ? new Date(dataInicio) : new Date()}
              mode="date"
              display="default"
              onChange={onChangeInicio}
            />
          )}

          <Text style={styles.label}>Data Fim:</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowPickerFim(true)}
          >
            <Text>{dataFim || "Selecione a data"}</Text>
          </TouchableOpacity>
          {showPickerFim && (
            <DateTimePicker
              value={dataFim ? new Date(dataFim) : new Date()}
              mode="date"
              display="default"
              onChange={onChangeFim}
            />
          )}
        </View>

        {/* Dias da semana */}
        <View style={styles.diasContainer}>
          <Text style={styles.label}>Dias da semana:</Text>
          <View style={styles.diasButtons}>
            {diasSemana.map((dia) => {
              const selecionado = diasSelecionados.includes(dia);
              return (
                <TouchableOpacity
                  key={dia}
                  style={[styles.dia, selecionado && styles.diaSelecionado]}
                  onPress={() => toggleDia(dia)}
                >
                  <Text
                    style={[
                      styles.textoDia,
                      selecionado && styles.textoSelecionado,
                    ]}
                  >
                    {dia}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Horários */}
        <View style={{ padding: 10, alignItems: "center" }}>
          {loading ? (
            <ActivityIndicator size="large" color="red" />
          ) : erro ? (
            <Text style={{ color: "red" }}>Erro ao carregar horários</Text>
          ) : horarios.length === 0 ? (
            <Text>Nenhum horário disponível</Text>
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

        {/* Botão Reservar */}
        {horariosSelecionados.length > 0 && (
          <View style={{ alignItems: "center", marginVertical: 20 }}>
            <TouchableOpacity
              style={styles.reservarBtn}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Reservar
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Confirmar Reserva</Text>
              <Text style={{ fontSize: 16 }}>Sala: {sala.descricao}</Text>
              <Text style={{ fontSize: 16 }}>
                Data: {dataInicio} a {dataFim}
              </Text>
              <Text style={{ fontSize: 16 }}>
                Dias: {diasSelecionados.join(", ")}
              </Text>
              <Text style={{ fontSize: 16 }}>
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
                  style={styles.cancelar}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ fontWeight: "bold" }}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmar}
                  onPress={confirmarReserva}
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
  backButton: { padding: 5, margin: 5, alignSelf: "flex-start" },
  dataContainer: { padding: 10 },
  label: { fontWeight: "bold", marginVertical: 5 },
  dateButton: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  
  diasContainer: { padding: 10 },

  diasButtons: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  dia: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#ddd",
    margin: 4,
  },
  diaSelecionado: { backgroundColor: "red" },
  textoDia: { fontSize: 14, color: "#333" },
  textoSelecionado: { color: "#fff", fontWeight: "bold" },
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
  selecionado: { backgroundColor: "#fff", borderWidth: 2, borderColor: "red" },
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
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  modalButtons: { flexDirection: "row", marginTop: 20 },
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
});
