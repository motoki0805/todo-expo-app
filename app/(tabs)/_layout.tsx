import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const headerButtonStyles = StyleSheet.create({
  headerButton: {
    marginRight: 15,
    padding: 5,
  },
});

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#007bff",
        tabBarStyle: {
          height: 60,
          paddingBottom: 0,
        },
        tabBarLabelStyle: {
          marginBottom: 0,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="TaskListScreen"
        options={{
          title: "タスク一覧",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" color={color} size={size} />
          ),
          headerTitle: "すべてのタスク",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/TaskCreateScreen")}
              style={headerButtonStyles.headerButton}
            >
              <Ionicons name="add" size={28} color="#007bff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="TaskCalendarScreen"
        options={{
          title: "カレンダー",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
          headerTitle: "タスクカレンダー",
        }}
      />
      <Tabs.Screen
        name="SettingScreen"
        options={{
          title: "設定",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
          headerTitle: "設定",
        }}
      />
    </Tabs>
  );
}
