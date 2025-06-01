import { Stack } from "expo-router";
import React from "react";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="CreateTaskScreen"
          options={{
            headerTitle: "タスク新規作成",
          }}
        />
        <Stack.Screen
          name="TaskEditScreen"
          options={{
            headerTitle: "タスク編集",
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
