import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
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
        }}
      />
      <Tabs.Screen
        name="CreateTaskScreen"
        options={{
          title: "タスク作成",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" color={color} size={size} />
          ),
          headerTitle: "タスク作成",
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
