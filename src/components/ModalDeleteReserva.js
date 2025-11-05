import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../axios/axios";

const ModalDeleteReserva = ({ isVisible, onClose, reserva, onDeleted }) => {
  useEffect(() => {
    if (reserva) {
      console.log("Reserva selecionada para deletar:", reserva);
    }
  }, [reserva]);

  const handleDeleteReserva = async () => {
    const id =
      reserva?.id_reserva ||
      reserva?.periodos?.[0]?.id_reserva;
    if (!id) {
      Alert.alert("Erro", "ID da reserva não encontrado.");
      return;
    }

    try {
      console.log("Deletando reserva com ID:", id);
      await api.deleteReserva(id);
      Alert.alert("Sucesso", "Reserva deletada com sucesso.");
      onDeleted();
      onClose();
    } catch (error) {
      console.log("Erro ao deletar:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Erro ao deletar reserva."
      );
    }
  };

  if (!reserva) return null;

  const nomeSala = reserva?.nomeSala || reserva?.nomeSalaDisplay || "—";
  const descricao = reserva?.descricao || reserva?.descricaoDetalhe || "—";
  const data = reserva?.data || "—";
  const horarioInicio =
    reserva?.horarioInicio || reserva?.periodos?.[0]?.horario_inicio || "—";
  const horarioFim =
    reserva?.horarioFim || reserva?.periodos?.[0]?.horario_fim || "—";

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>DELETAR</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.info}>SALA: {nomeSala}</Text>
            <Text style={styles.info}>DESCRIÇÃO: {descricao}</Text>
            <Text style={styles.info}>DATA: {data}</Text>
            <Text style={styles.info}>
              HORÁRIO: {horarioInicio} - {horarioFim}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelText}>CANCELAR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleDeleteReserva}
              >
                <Text style={styles.confirmText}>CONFIRMAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderColor: "#B11010",
    borderWidth: 1,
  },
  header: {
    backgroundColor: "#B11010",
    padding: 15,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  body: {
    padding: 20,
    alignItems: "flex-start",
  },
  info: {
    fontSize: 18,
    color: "#000",
    fontWeight: "500",
    marginBottom: 6,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#FFCCCC",
    paddingVertical: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#CCFFCC",
    paddingVertical: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  cancelText: {
    color: "#B11010",
    fontWeight: "bold",
    fontSize: 16,
  },
  confirmText: {
    color: "#28A745",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ModalDeleteReserva;
