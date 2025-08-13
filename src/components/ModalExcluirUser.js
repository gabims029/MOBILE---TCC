import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import {useNavigation} from "@react-navigation/native"
import api from "../axios/axios";

const ModalExcluirUser = ({ visible, usuario, onCancel, onDeleted, onClose }) => {
  useEffect(() => {
    if (usuario) {
      console.log("Usuário para excluir:", usuario);
    }
  }, [usuario]);

  const navigation = useNavigation();

  const handleExcluirUser = async () => {
    const id = usuario?.idUsuario;
    if (!id) {
      Alert.alert("Erro", "ID do usuário não encontrado.");
      return;
    }
    try {
      await api.deleteUser(id); // Verifique se esse endpoint existe no seu api.js
      Alert.alert("Sucesso", "Usuário deletado com sucesso.");
      onDeleted?.();
      onClose?.();
      navigation.navigate("Login");
    } catch (error) {
      console.log("Erro ao deletar:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.error || "Erro ao deletar usuário."
      );
    }
  };

  if (!usuario) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Deseja realmente deletar sua conta?
          </Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleExcluirUser}>
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

export default ModalExcluirUser;
