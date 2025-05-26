import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          headerTitle: "Seven Coating",
          headerTitleAlign: "center",
        }}
      />
    </Stack>
  );
}
