import CustomAlertDialog from "@/components/CustomAlertDialog";
import TaskList from "@/components/TaskList";
import { useTasksLogic } from "@/hooks/useTasks";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * タスク一覧画面
 *
 * タスクをカードで一覧表示、ヘッダーからタスクの新規作成、
 * カードから完了、編集、削除が行える
 *
 */
export default function TaskListScreen() {
  const {
    tasks,
    loading,
    error,
    selected_id,
    onItemPress,
    onCompletePress,
    onEditPress,
    onDeletePress,
    alert_dialog_config,
  } = useTasksLogic();

  return (
    <View style={styles.container}>
      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        selected_id={selected_id}
        onItem={onItemPress}
        onComplete={onCompletePress}
        onEdit={onEditPress}
        onDelete={onDeletePress}
      />
      <CustomAlertDialog
        visible={alert_dialog_config.visible}
        title={alert_dialog_config.title}
        message={alert_dialog_config.message}
        onConfirm={alert_dialog_config.onConfirm}
        onCancel={alert_dialog_config.onCancel}
        confirm_text={alert_dialog_config.confirm_text}
        cancel_text={alert_dialog_config.cancel_text}
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
