import TaskCalendar from "@/components/TaskCalendar";
import { useTasksLogic } from "@/hooks/useTasks";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * カレンダー画面
 *
 * タスク数を一見的に把握できるように表示
 * todo:現在は、ドットを使用しての表示のため、数を表示に変更したい
 *
 */
export default function TaskCalendarScreen() {
  const { selected_date, marked_dates, onDayPress } = useTasksLogic();

  return (
    <View style={styles.container}>
      <TaskCalendar
        selected_date={selected_date}
        marked_dates={marked_dates}
        onDayPress={onDayPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    alignItems: "center",
  },
});
