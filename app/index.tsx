import TaskCalendar from "@/components/TaskCalendar";
import TaskList from "@/components/TaskList";
import { useTasksLogic } from "@/hooks/useTasks";
import { StyleSheet, View } from "react-native";

export default function Index() {
  const {
    selected_id,
    tasks,
    loading,
    error,
    selected_data,
    marked_dates,
    onDayPress,
    onItemPress,
  } = useTasksLogic();

  return (
    <View style={styles.container}>
      <TaskCalendar
        selected_date={selected_data}
        marked_dates={marked_dates}
        onDayPress={onDayPress}
      />
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
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});
