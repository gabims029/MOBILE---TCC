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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SecureStore from "expo-secure-store";
import api from "../axios/axios";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ReservaBloco({ route }) {
  const navigation = useNavigation();
  const { sala } = route.params;
  const hoje = new Date().toISOString().split("T")[0];
  const [idUsuario, setIdUsuario] = useState(null);
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);
  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [diasSelecionados, setDiasSelecionados] = useState([]);
  const [dataInicio, setDataInicio] = useState(hoje);
  const [dataFim, setDataFim] = useState(hoje);
  const [showPickerInicio, setShowPickerInicio] = useState(false);
  const [showPickerFim, setShowPickerFim] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const diasSemana = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

  // Recupera idUsuario do SecureStore
  useEffect(() => {
    const getUsuarioId = async () => {
      const id = await SecureStore.getItemAsync("id");
      if (!id) {
        Alert.alert("Erro", "ID do usuário não encontrado. Faça login novamente.");
      } else {
        setIdUsuario(id);
      }
    };
    getUsuarioId();
  }, []);

  // Buscar horários disponíveis
  useEffect(() => {
    if (!sala) return;
    const fetchHorarios = async () => {
      try {
        setLoading(true);
        setErro(false);
        const res = await api.getAllPeriodos();
        setHorarios(res.data?.periodos || []);
      } catch (err) {
        console.log("Erro ao buscar horários:", err);
        setErro(true);
        setHorarios([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHorarios();
  }, [sala]);

  // Manipulação de seleção
  const toggleHorario = (h) => {
    if (h.status === "ocupado") return;
    setHorariosSelecionados((prev) =>
      prev.includes(h.id_periodo)
        ? prev.filter((id) => id !== h.id_periodo)
        : [...prev, h.id_periodo]
    );
  };

  const toggleDia = (dia) => {
    setDiasSelecionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  // Manipulação de datas
  const onChangeInicio = (event, selectedDate) => {
    setShowPickerInicio(false);
    if (selectedDate) setDataInicio(selectedDate.toISOString().split("T")[0]);
  };

  const onChangeFim = (event, selectedDate) => {
    setShowPickerFim(false);
    if (selectedDate) setDataFim(selectedDate.toISOString().split("T")[0]);
  };

  // Confirmar reserva
  const confirmarReserva = async () => {
    if (
      !idUsuario ||
      !dataInicio ||
      !dataFim ||
      diasSelecionados.length === 0 ||
      horariosSelecionados.length === 0
    ) {
      return Alert.alert("Atenção", "Selecione datas, dias e ao menos um horário.");
    }

    try {
      setLoading(true);

      for (const id_periodo of horariosSelecionados) {
        await api.createReserva({
          fk_id_user: Number(idUsuario),
          fk_id_sala: sala.id_sala,
          fk_id_periodo: id_periodo,
          dias: diasSelecionados,
          data_inicio: dataInicio,
          data_fim: dataFim,
        });
      }

      Alert.alert("Sucesso", `Reserva realizada para sala ${sala.numero}`);
      setHorariosSelecionados([]);
      setDiasSelecionados([]);
      setDataInicio(hoje);
      setDataFim(hoje);
      setModalVisible(false);
    } catch (err) {
      console.log("Erro ao criar reserva:", err?.response?.data || err);
      const msg = err?.response?.data?.error || "Erro ao processar a reserva";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  // Horários selecionados
  const horariosTexto = horariosSelecionados
    .map((id) => {
      const h = horarios.find((x) => x.id_periodo === id);
      return h ? `${h.horario_inicio.slice(0, 5)} - ${h.horario_fim.slice(0, 5)}` : null;
    })
    .filter(Boolean)
    .join(", ");

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("SalasPorBloco")}
      >
        <FontAwesome name="arrow-left" size={24} color="#ddd" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.tituloContainer}>
          <Text style={styles.tituloTexto}>
            {sala.numero} {sala.descricao ? `- ${sala.descricao}` : ""}
          </Text>
        </View>

        {/* Datas */}
        <View style={styles.datasContainer}>
          {/* Data Início */}
          <View style={styles.dataBox}>
            <Text style={styles.dataLabel}>Data Início:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPickerInicio(true)}
            >
              <Text style={styles.dataText}>{dataInicio}</Text>
            </TouchableOpacity>
            {showPickerInicio && (
              <DateTimePicker
                value={new Date(dataInicio)}
                mode="date"
                display="default"
                onChange={onChangeInicio}
              />
            )}
          </View>

          {/* Data Fim */}
          <View style={styles.dataBox}>
            <Text style={styles.dataLabel}>Data Fim:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPickerFim(true)}
            >
              <Text style={styles.dataText}>{dataFim}</Text>
            </TouchableOpacity>
            {showPickerFim && (
              <DateTimePicker
                value={new Date(dataFim)}
                mode="date"
                display="default"
                onChange={onChangeFim}
              />
            )}
          </View>
        </View>

        {/* Dias */}
        <View style={styles.diasContainer}>
          <Text style={styles.diasTitulo}>Dias da semana:</Text>
          <View style={styles.diasBotoesContainer}>
            {diasSemana.map((dia) => {
              const selecionado = diasSelecionados.includes(dia);
              return (
                <TouchableOpacity
                  key={dia}
                  style={[
                    styles.diaBotao,
                    { backgroundColor: selecionado ? "#FF6B6B" : "#E0E0E0" },
                  ]}
                  onPress={() => toggleDia(dia)}
                >
                  <Text
                    style={[
                      styles.diaTexto,
                      { color: selecionado ? "#fff" : "#000" },
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
        <View
          style={{
            padding: 10,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {horarios.map((h) => {
            const selecionado = horariosSelecionados.includes(h.id_periodo);
            return (
              <TouchableOpacity
                key={h.id_periodo}
                style={{
                  padding: 10,
                  margin: 6,
                  borderRadius: 6,
                  minWidth: 100,
                  alignItems: "center",
                  backgroundColor:
                    h.status === "ocupado"
                      ? "#e57373"
                      : selecionado
                      ? "#fff"
                      : "#81c784",
                  borderWidth: selecionado ? 2 : 0,
                  borderColor: selecionado ? "red" : "transparent",
                }}
                disabled={h.status === "ocupado"}
                onPress={() => toggleHorario(h)}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color:
                      h.status === "ocupado"
                        ? "#fff"
                        : selecionado
                        ? "#000"
                        : "#fff",
                  }}
                >
                  {h.horario_inicio.slice(0, 5)} - {h.horario_fim.slice(0, 5)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Reservar */}
        {horariosSelecionados.length > 0 && (
          <View style={{ alignItems: "center", marginVertical: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: "red",
                paddingVertical: 12,
                paddingHorizontal: 30,
                borderRadius: 8,
              }}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Reservar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Modal de confirmação */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                width: "85%",
                backgroundColor: "#fff",
                padding: 20,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}
              >
                Confirmar Reserva
              </Text>
              <Text>Sala: {sala.numero}</Text>
              <Text>
                Data: {dataInicio} a {dataFim}
              </Text>
              <Text>Dias: {diasSelecionados.join(", ")}</Text>
              <Text>Horários: {horariosTexto}</Text>

              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#F8BFC0",
                    padding: 10,
                    minWidth: 100,
                    alignItems: "center",
                    borderRadius: 5,
                    marginRight: 8,
                  }}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ fontWeight: "bold" }}>CANCELAR</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "#66bb6a",
                    padding: 10,
                    minWidth: 100,
                    alignItems: "center",
                    borderRadius: 5,
                  }}
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

  tituloContainer: {
    backgroundColor: "#FFC9C9",
    padding: 12,
  },

  tituloTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

  datasContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
  },

  dataBox: {
    flex: 1,
    alignItems: "center",
  },

  dataLabel: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },

  dateButton: {
    width: "80%",
    height: 40,
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  dataText: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },

  diasContainer: {
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 25,
  },

  diasTitulo: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    marginBottom: 8,
  },

  diasBotoesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  diaBotao: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    margin: 4,
    borderRadius: 8,
  },

  diaTexto: {
    fontSize: 14,
    fontWeight: "bold",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
    margin: 10,
  },
});