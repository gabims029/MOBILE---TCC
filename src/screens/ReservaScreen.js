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
import api from "../axios/axios";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Reserva({ route }) {
  const { sala, idUsuario } = route.params;
  const navigation = useNavigation();
  const [disponiveis, setDisponiveis] = useState([]);
  const [reservados, setReservados] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [data, setData] = useState("");
  const [showPicker, setShowPicker] = useState(false); // controlar a exibição do DateTimePicker

  useEffect(() => {
    if (data) {
      getHorarios(data);
    }
  }, [data]);

  async function getHorarios(selectedDate) {
    await api.getHorarios({ id_sala: sala.id_sala, data: selectedDate }).then(
      (response) => {
        setDisponiveis(response.data.horarios.Disponiveis);
        setReservados(response.data.horarios.Indisponiveis);
        console.log(disponiveis);
        console.log(reservados)
      },
      (error) => {
        Alert.alert("Erro", error.response.data.error);
        saveId(response.data.id_usuario);
      }
    );
  }

  async function abrirModal(horario) {
    setHorarioSelecionado(horario);
    setModalVisible(true);
  }

  //event - interação do usuário vem do DateTimePicker
  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setData(formattedDate);
    }
  };

  async function confirmarReserva() {
    const inicio = horarioSelecionado.inicio;
    const fim = horarioSelecionado.fim;

    await api
      .confirmarReserva({
        id_usuario: idUsuario,
        fk_id_sala: sala.id_sala,
        data: data,
        horarioInicio: inicio,
        horarioFim: fim,
      })
      .then(
        () => {
          setModalVisible(false);
          Alert.alert("Sucesso", "Reserva confirmada!");
          getHorarios(data); // Atualiza horários após reserva
        },
        (error) => {
          Alert.alert(
            "Erro",
            error.response?.data?.error || "Erro ao reservar"
          );
          console.log(error);
          setModalVisible(false);
        }
      );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.tituloContainer}>
          <Text style={styles.tituloTexto}>
            Sala: {sala.numero} - {sala.descricao}
          </Text>
        </View>

        <View style={{ padding: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Selecione a data:</Text>
          <TouchableOpacity
            style={{
              width: 200,
              marginTop: 10,
              padding: 10,
              backgroundColor: "#ccc",
              borderRadius: 5,
            }}
            onPress={() => setShowPicker(true)}
          >
            <Text>{data || "Selecione a data"}</Text>
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

        <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 10 }}>
          {disponiveis.map((horario) => (
            <TouchableOpacity
              key={`disp-${horario.inicio}-${horario.fim}`}
              style={styles.horarioDisponivel}
              onPress={() => abrirModal(horario)}
            >
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                {horario.inicio} - {horario.fim}
              </Text>
            </TouchableOpacity>
          ))}
          {reservados.map((horario) => (
            <TouchableOpacity
              key={`res-${horario.inicio}-${horario.fim}`}
              style={styles.horarioReservado}
            >
              <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                {horario.inicio} - {horario.fim}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.voltarButton}
        >
          <Text>Voltar</Text>
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>RESERVAR</Text>
              <Text style={{ fontSize: 18 }}>SALA: {sala.descricao} </Text>
              <Text style={{ fontSize: 18 }}>DATA: {data}</Text>
              <Text style={{ fontSize: 18 }}>
                HORÁRIO: {horarioSelecionado?.inicio} -{" "}
                {horarioSelecionado?.fim}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  justifyContent: "space-between",
                }}
              >
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
                  <Text style={{ fontWeight: "bold" }}>CONFIRMAR</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  tituloContainer: {
    backgroundColor: "#FFC9C9", // fundo rosa claro
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  tituloTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  horarioReservado: {
    backgroundColor: "#E56565",
    padding: 10,
    margin: 8,
    borderRadius: 3,
    minWidth: 130,
    alignItems: "center",
  },
  horarioDisponivel: {
    backgroundColor: "#ADD7A9",
    padding: 10,
    margin: 8,
    borderRadius: 3,
    minWidth: 130,
    alignItems: "center",
  },
  voltarButton: {
    width: 100,
    height: 30,
    borderRadius: 3,
    backgroundColor: "#FF3F3F",
    marginTop: 15,
    marginLeft: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  //Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#F5F7FB", // cor de fundo mais clara
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
    padding: 0,
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#B92626", // vermelho forte
    color: "white",
    paddingVertical: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: "100%",
    textAlign: "center",
    marginBottom: 10,
  },
  cancelar: {
    backgroundColor: "#F8BFC0", // rosa claro
    padding: 10,
    minWidth: 100,
    alignItems: "center",
    borderRadius: 5,
    marginRight: 5,
  },
  confirmar: {
    backgroundColor: "#A5D6A7", // verde claro
    padding: 10,
    minWidth: 100,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
