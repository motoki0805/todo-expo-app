import TaskCalendar from "@/components/TaskCalendar";
import TaskList from "@/components/TaskList";
import { useTasksLogic } from "@/hooks/useTasks";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
    onAddButtonPress,
    onEditButtonPress,
    onSettingButtonPress,
  } = useTasksLogic();

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <SafeAreaView style={styles.contentContainer}>
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
        </SafeAreaView>
        <SafeAreaView style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={onAddButtonPress}
          >
            <Text style={styles.footerButtonText}>追加</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={onEditButtonPress}
          >
            <Text style={styles.footerButtonText}>編集</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={onSettingButtonPress}
          >
            <Text style={styles.footerButtonText}>設定</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#e7e7e7",
    paddingHorizontal: 10,
  },
  footerButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#007bff",
    borderRadius: 8,
  },
  footerButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
