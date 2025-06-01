import { TaskData } from "@/types/data";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TaskItemProps = {
  item: TaskData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
  onComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

/**
 * 個々のタスクアイテムを表示用コンポーネント
 *
 * タスクの詳細情報を表示し、アイテムがタップされた際のイベントを処理
 * リストアイテムの背景色と文字色は、選択状態に基づいて動的に設定
 *
 */
const TaskItem = ({
  item,
  onPress,
  backgroundColor,
  textColor,
  onComplete,
  onEdit,
  onDelete,
}: TaskItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, { backgroundColor }]}
  >
    <View style={styles.detailsContainer}>
      <Text style={[styles.title, { color: textColor }]}>
        {item.car_model.name}
      </Text>
      <Text style={[styles.content, { color: textColor }]}>
        車体番号: {item.chassis_number}
      </Text>
      <Text style={[styles.content, { color: textColor }]}>
        内容: {item.content}
      </Text>

      <Text style={[styles.content, { color: textColor }]}>
        カラー: {item.code}
      </Text>
      <Text style={[styles.content, { color: textColor }]}>
        担当者: {item.u_name}
      </Text>
    </View>
    <View style={styles.buttonsContainer}>
      <TouchableOpacity
        onPress={() => onComplete(item.id)}
        style={[styles.button, styles.completeButton]}
      >
        <Text style={styles.buttonText}>完了</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onEdit(item.id)}
        style={[styles.button, styles.editButton]}
      >
        <Text style={styles.buttonText}>編集</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onDelete(item.id)}
        style={[styles.button, styles.deleteButton]}
      >
        <Text style={styles.buttonText}>削除</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  item: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  buttonsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  content: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginVertical: 3,
    minWidth: 70,
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
  },
  editButton: {
    backgroundColor: "#007bff",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default TaskItem;
