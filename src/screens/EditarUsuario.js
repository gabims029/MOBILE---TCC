import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EditarUsuario() {
  const [cpf] = useState("***.***.***-**"); // CPF fixo
  const [email, setEmail] = useState("adriano@docente.senai.br");
  const [senha, setSenha] = useState("******");

  return (
    <View style={styles.content}>
      <View style={styles.card}>
        {/* Ícone de usuário */}
        <Ionicons name="person-circle-outline" size={90} color="white" />
        <Text style={styles.nome}>NOME</Text>

        {/* Campo CPF */}
        <Text style={styles.label}>CPF</Text>
        <TextInput
          style={[styles.input, styles.inputBloqueado]}
          value={cpf}
          editable={false} // não pode editar
        />

        {/* Campo Email */}
        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          value={email}
          autoCapitalize="none"
          onChangeText={setEmail}
        />

        {/* Campo Senha */}
        <Text style={styles.label}>SENHA</Text>
        <TextInput
          style={styles.input}
          value={senha}
          secureTextEntry={true}
          placeholderTextColor="#999"
          onChangeText={setSenha}
        />

        {/* Botões */}
        <TouchableOpacity style={styles.btnEditar}>
          <Text style={styles.txtBtn}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnDeletar}>
          <Text style={styles.txtBtn}>Deletar Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#FCECEC", 
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#CC1E1E", 
    width: "90%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  nome: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  label: {
    alignSelf: "flex-start",
    color: "white",
    fontSize: 12,
    marginTop: 10,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "white", 
    width: "100%",
    borderRadius: 15,
    padding: 10,
    marginTop: 5,
  },
  inputBloqueado: {
    opacity: 0.7, 
  },
  btnEditar: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  btnDeletar: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  txtBtn: {
    color: "#CC1E1E",
    fontWeight: "bold",
  },
});