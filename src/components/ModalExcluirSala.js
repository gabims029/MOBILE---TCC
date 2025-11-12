import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import sheets from "../axios/axios";

const ModalExcluirSala = ({ visible, sala, onCancel, onDeleted, onClose }) => {
  useEffect(() => {
    if (sala) {
      console.log("Sala para excluir:", sala);
    }
  }, [sala]);

  const handleExcluirSala = async () => {
    console.log("Sala recebida no handle:", sala);

    // Verifica se o número da sala existe
    if (!sala?.numero) {
      Alert.alert("Erro", "Número da sala não encontrado.");
      return;
    }

    try {
      // Chamada para API de exclusão
      await sheets.deleteSala(sala.numero);
      Alert.alert("Sucesso", "Sala deletada com sucesso.");

      onDeleted?.();
      onClose?.();
    } catch (error) {
      console.log("Erro ao deletar sala:", error.response?.data || error.message);
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Erro ao deletar sala."
      );
    }
  };

  if (!sala) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Deseja realmente deletar a sala {sala?.numero}?
          </Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleExcluirSala}>
              <Text style={styles.confirmText}>Deletar</Text>
            </TouchableOpacity>
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
  container: {
    backgroundColor: "#B11010",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 20,
  },
  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  cancelText: {
    color: "#B11010",
    fontWeight: "bold",
  },
  confirmText: {
    color: "#B11010",
    fontWeight: "bold",
  },
});

export default ModalExcluirSala;
