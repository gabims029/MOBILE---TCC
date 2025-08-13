import React from "react";
import {
  View,
  StyleSheet,
} from "react-native";
import Header from "./Header";

export default function MyLayout({ children, header }) {
    return (

      <View style={styles.container}>

        <Header header={header}/>

        <View style={styles.container}>{children}</View>
  
        {/* Rodapé */}
        <View style={styles.footer} />

      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFF5F5",
    },
    footer: {
      backgroundColor: "#CC1E1E",
      width: "100%",
      height: 50
    }
  });
  