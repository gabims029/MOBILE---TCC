import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../axios/axios";

const ModalAtualizarUser = ({ visible, onClose, usuario, onSuccess }) => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");

  useEffect(() => {
    if (usuario) {
      console.log("Dados do usuário:", usuario);
      setNome(usuario.nome || "");
      setEmail(usuario.email || "");
      setSenha(usuario.senha || "");
      setCpf(usuario.cpf || "");
    }
  }, [usuario]);

  async function handleAtualizar() {
    try {
      await api.updateUser({
        id: usuario.id_usuario,
        cpf,
        nome,
        email,
        senha,
      });
      Alert.alert("Sucesso", "Usuário atualizado com sucesso.");
      onSuccess();
      onClose();
    } catch (error) {
      console.log("Erro ao atualizar usuário:", error);
      console.log("Detalhes do erro:", error.response?.data || error.message);
      Alert.alert("Erro", error.response?.data?.error || "Erro ao atualizar");
    }
  }

  if (!usuario) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>ATUALIZAR PERFIL</Text>

          <Text style={styles.label}>CPF</Text>
          <TextInput
            style={styles.input}
            value={cpf}
            editable={false} // <- CPF não pode mais ser alterado
          />

          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            onChangeText={setSenha}
            placeholder="Digite sua senha"
            keyboardType="password"
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleAtualizar}>
              <Text style={styles.buttonText}>Atualizar</Text>
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
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#B11010",
    width: "85%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    alignSelf: "flex-start",
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
    marginBottom: 5,
    color: "#000",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#B11010",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});

export default ModalAtualizarUser;