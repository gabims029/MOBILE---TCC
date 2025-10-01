// ReservaBloco.js
import React, { useEffect, useState, useCallback } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../axios/axios";

export default function ReservaBloco({ route, navigation }) {
  const { sala, idUsuario: idUsuarioParam } = route.params || {};

  const hoje = new Date().toISOString().split("T")[0];

  const [idUsuario, setIdUsuario] = useState(idUsuarioParam || null);
  const [nomeUsuario, setNomeUsuario] = useState(null);

  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);

  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [dataInicio, setDataInicio] = useState(hoje);
  const [dataFim, setDataFim] = useState(hoje);
  const [showPickerInicio, setShowPickerInicio] = useState(false);
  const [showPickerFim, setShowPickerFim] = useState(false);

  const [diasSemana, setDiasSemana] = useState([
    "Seg",
    "Ter",
    "Qua",
    "Qui",
    "Sex",
    "Sab",
  ]);
  const [diasSelecionados, setDiasSelecionados] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  // buscar id/nome do AsyncStorage se não veio por param
  useEffect(() => {
    (async () => {
      if (!idUsuarioParam) {
        try {
          const id = await AsyncStorage.getItem("id_usuario");
          const nome = (await AsyncStorage.getItem("nome_usuario")) || "Usuário";
          if (id) setIdUsuario(id);
          setNomeUsuario(nome);
        } catch (e) {
          console.log("Erro ao ler AsyncStorage:", e);
        }
      } else {
        // se veio por param, tentar pegar nome armazenado
        (async () => {
          try {
            const nome = (await AsyncStorage.getItem("nome_usuario")) || "Usuário";
            setNomeUsuario(nome);
          } catch (e) {
            setNomeUsuario("Usuário");
          }
        })();
      }
    })();
  }, [idUsuarioParam]);

  // busca períodos disponíveis
  const fetchHorarios = useCallback(async () => {
    if (!sala) return;
    try {
      setLoading(true);
      setErro(false);
      const res = await api.getAllPeriodos(); // mantém uso do api centralizado
      setHorarios(res.data?.periodos || []);
    } catch (error) {
      console.log("Erro ao buscar períodos:", error);
      setErro(true);
      setHorarios([]);
    } finally {
      setLoading(false);
    }
  }, [sala]);

  useEffect(() => {
    fetchHorarios();
  }, [fetchHorarios]);

  // toggles
  function toggleHorario(h) {
    if (h.status === "ocupado") return;
    setHorariosSelecionados((prev) =>
      prev.includes(h.id_periodo)
        ? prev.filter((id) => id !== h.id_periodo)
        : [...prev, h.id_periodo]
    );
  }

  function toggleDia(dia) {
    setDiasSelecionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  }

  // date pickers
  const onChangeInicio = (event, selectedDate) => {
    setShowPickerInicio(false);
    if (selectedDate) {
      setDataInicio(selectedDate.toISOString().split("T")[0]);
    }
  };

  const onChangeFim = (event, selectedDate) => {
    setShowPickerFim(false);
    if (selectedDate) {
      setDataFim(selectedDate.toISOString().split("T")[0]);
    }
  };

  // formatar data antes de enviar - backend espera YYYY-MM-DD
  const formatarData = (d) =>
    d instanceof Date ? d.toISOString().split("T")[0] : d;

  // confirmar reserva (loop porque backend aceita 1 periodo por request)
  async function confirmarReserva() {
    if (!idUsuario) {
      return Alert.alert(
        "Erro",
        "ID do usuário não encontrado. Faça login novamente."
      );
    }

    if (
      !dataInicio ||
      !dataFim ||
      diasSelecionados.length === 0 ||
      horariosSelecionados.length === 0
    ) {
      return Alert.alert(
        "Atenção",
        "Selecione datas, dias da semana e ao menos um horário."
      );
    }

    // validação simples cliente: dataInicio <= dataFim
    if (new Date(dataInicio) > new Date(dataFim)) {
      return Alert.alert(
        "Atenção",
        "A data de início não pode ser maior que a data de fim."
      );
    }

    try {
      setLoading(true);
      for (const id_periodo of horariosSelecionados) {
        await api.createReserva({
          fk_id_user: idUsuario,
          fk_id_sala: sala.id_sala,
          fk_id_periodo: id_periodo,
          dias: diasSelecionados,
          data_inicio: formatarData(dataInicio),
          data_fim: formatarData(dataFim),
        });
      }

      Alert.alert("Sucesso", `Reserva realizada para sala ${sala.numero}`);
      setModalVisible(false);
      setHorariosSelecionados([]);
      setDiasSelecionados([]);
      setDataInicio(hoje);
      setDataFim(hoje);
      await fetchHorarios();
    } catch (error) {
      console.log("Erro ao criar reserva:", error?.response?.data || error);
      const msg =
        error?.response?.data?.error || "Erro ao processar a reserva. Tente novamente.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  }

  // Text for horarios selected join
  const horariosTexto = horariosSelecionados
    .map((id) => {
      const h = horarios.find((x) => x.id_periodo === id);
      if (!h) return null;
      return `${h.horario_inicio.slice(0, 5)} - ${h.horario_fim.slice(0, 5)}`;
    })
    .filter(Boolean)
    .join(", ");

  if (!sala) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ padding: 20 }}>
          <Text style={{ color: "red", fontWeight: "bold" }}>
            Sala não encontrada!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={22} color="#333" />
        </TouchableOpacity>

        <View style={styles.tituloContainer}>
          <Text style={styles.tituloTexto}>
            Sala: {sala.numero} {sala.descricao ? `- ${sala.descricao}` : ""}
          </Text>
        </View>

        <View style={styles.dataContainer}>
          <Text style={styles.label}>Data Início</Text>
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

          <Text style={styles.label}>Data Fim</Text>
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

        <View style={styles.diasContainer}>
          <Text style={styles.label}>Dias da semana</Text>
          <View style={styles.diasButtons}>
            {diasSemana.map((dia) => {
              const selecionado = diasSelecionados.includes(dia);
              return (
                <TouchableOpacity
                  key={dia}
                  style={[styles.dia, selecionado && styles.diaSelecionado]}
                  onPress={() => toggleDia(dia)}
                >
                  <Text style={[styles.textoDia, selecionado && styles.textoSelecionado]}>
                    {dia}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ padding: 10, alignItems: "center" }}>
          {loading ? (
            <ActivityIndicator size="large" />
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
                      {h.horario_inicio.slice(0, 5)} - {h.horario_fim.slice(0, 5)}
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
              style={styles.reservarBtn}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>Reservar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Modal de confirmação */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Confirmar Reserva</Text>
              <Text style={{ fontSize: 16 }}>Sala: {sala.numero}</Text>
              <Text style={{ fontSize: 16 }}>
                Data: {dataInicio} a {dataFim}
              </Text>
              <Text style={{ fontSize: 16 }}>Dias: {diasSelecionados.join(", ")}</Text>
              <Text style={{ fontSize: 16 }}>Horários: {horariosTexto}</Text>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelar}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ fontWeight: "bold" }}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmar} onPress={confirmarReserva}>
                  <Text style={{ fontWeight: "bold", color: "#fff" }}>CONFIRMAR</Text>
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
  backButton: { padding: 8, margin: 8, alignSelf: "flex-start" },
  dataContainer: { padding: 10 },
  label: { fontWeight: "bold", marginVertical: 6 },
  dateButton: {
    padding: 10,
    backgroundColor: "#ccc",
    borderRadius: 6,
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
    width: "88%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 14 },
  modalButtons: { flexDirection: "row", marginTop: 20 },
  cancelar: {
    backgroundColor: "#F8BFC0",
    padding: 10,
    minWidth: 100,
    alignItems: "center",
    borderRadius: 5,
    marginRight: 8,
  },
  confirmar: {
    backgroundColor: "#66bb6a",
    padding: 10,
    minWidth: 100,
    alignItems: "center",
    borderRadius: 5,
    marginLeft: 8,
  },
});
