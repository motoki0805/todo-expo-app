import TaskList from "@/components/TaskList";
import { useTasksLogic } from "@/hooks/useTasks";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * タスク一覧画面
 *
 * タスクをカードで一覧表示
 * todo:この画面から編集や削除を行えるようにする
 *
 */
export default function TaskListScreen() {
  const { tasks, loading, error, selected_id, onItemPress } = useTasksLogic();

  return (
    <View style={styles.container}>
      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        selected_id={selected_id}
        onItemPress={onItemPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
});
