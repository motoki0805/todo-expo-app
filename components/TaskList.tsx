import TaskItem from "@/components/TaskItem";
import { TaskData } from "@/types/data";
import { FlatList, StyleSheet, Text, View } from "react-native";

type TaskListProps = {
  tasks: TaskData[];
  loading: boolean;
  error: string | null;
  selectedId: string | undefined;
  onItemPress: (id: string) => void;
};

/**
 * タスクリスト表示用コンポーネント
 *
 * APIから取得したタスクデータのリストを表示し、データの読み込み状態、
 * エラー状態、および個々のアイテムの選択状態を管理
 *
 */
const TaskList = ({
  tasks,
  loading,
  error,
  selectedId,
  onItemPress,
}: TaskListProps) => {
  const render_item = ({ item }: { item: TaskData }) => {
    const backgroundColor = item.id === selectedId ? "#a3a3a3" : "#f0f0f0";
    const color = item.id === selectedId ? "white" : "black";

    return (
      <TaskItem
        item={item}
        onPress={() => onItemPress(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>データを読み込み中...</Text>
      ) : error ? (
        <Text style={styles.errorText}>エラー: {error}</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={render_item}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  loadingText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    marginTop: 20,
    color: "red",
    textAlign: "center",
  },
  flatList: {
    flex: 1,
    width: "100%",
  },
  flatListContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
});

export default TaskList;
