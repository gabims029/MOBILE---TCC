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
import { Ionicons } from "@expo/vector-icons";
import sheets from "../axios/axios";

const ModalEditarUsuario = ({ visible, onClose, userId, onUpdated }) => {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  // Carrega dados do usuário logado
  useEffect(() => {
    if (visible && userId) {
      carregarUsuario();
    }
  }, [visible]);

  async function carregarUsuario() {
    try {
      const response = await sheets.getUser(userId);
      const dados = response.data.user || response.data;

      setNome(dados.nome || "");
      setCpf(dados.cpf || "");
      setEmail(dados.email || "");
      setSenha("");
      setNovaSenha("");
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
    }
  }

  async function salvarAlteracoes() {
    if (!nome || !email) {
      Alert.alert("Atenção", "Preencha todos os campos obrigatórios.");
      return;
    }
  
    // Se o usuário quiser trocar a senha, precisa informar a atual e a nova
    if ((senha && !novaSenha) || (!senha && novaSenha)) {
      Alert.alert("Atenção", "Informe a senha atual e a nova senha para alterar.");
      return;
    }
  
    try {
      await sheets.updateUser({
        id: userId,
        nome,
        email,
        cpf,               
        senhaAtual: senha, 
        senha: novaSenha,  
      });
  
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      onUpdated?.();
      onClose();
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Erro", error.response?.data?.error || "Não foi possível atualizar o perfil.");
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Ionicons name="person-circle-outline" size={80} color="white" />

          {/* NOME */}
          <Text style={styles.label}>NOME</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
            placeholderTextColor="#999"
          />

          {/* CPF (bloqueado) */}
          <Text style={styles.label}>CPF</Text>
          <TextInput
            style={[styles.input, styles.inputBloqueado]}
            value={cpf}
            editable={false}
          />

          {/* EMAIL */}
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu email"
            placeholderTextColor="#999"
          />

          {/* SENHA */}
          <Text style={styles.label}>SENHA</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder="Senha atual"
            placeholderTextColor="#999"
          />

          {/* NOVA SENHA */}
          <Text style={styles.label}>NOVA SENHA</Text>
          <TextInput
            style={styles.input}
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry
            placeholder="Nova senha"
            placeholderTextColor="#999"
          />

          {/* BOTÕES */}
          <TouchableOpacity style={styles.btnSalvar} onPress={salvarAlteracoes}>
            <Text style={styles.txtBtnSalvar}>SALVAR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnCancelar} onPress={onClose}>
            <Text style={styles.txtBtnCancelar}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "#CC1E1E",
    width: "85%",
    borderRadius: 10,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  label: {
    color: "white",
    alignSelf: "flex-start",
    marginLeft: 5,
    marginTop: 8,
    fontSize: 12,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 5,
    fontSize: 14,
  },
  inputBloqueado: {
    opacity: 0.6,
  },
  btnSalvar: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 20,
  },
  txtBtnSalvar: {
    color: "#CC1E1E",
    fontWeight: "bold",
    fontSize: 15,
  },
  btnCancelar: {
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 10,
  },
  txtBtnCancelar: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default ModalEditarUsuario;
