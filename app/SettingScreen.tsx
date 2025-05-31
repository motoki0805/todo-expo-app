import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

/**
 * 設定画面
 *
 * todo:予約で作成、各種画面の表示を変えるような仕組みづくり
 *
 */
export default function TaskListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.noticeText}>Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 50,
    alignItems: "center",
  },
  noticeText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
  },
});
