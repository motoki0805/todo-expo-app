import { TaskData } from "@/types/data";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type TaskItemProps = {
  item: TaskData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
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
}: TaskItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, { backgroundColor }]}
  >
    <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
    <Text style={[styles.content, { color: textColor }]}>
      内容: {item.content}
    </Text>
    <Text style={[styles.content, { color: textColor }]}>
      車種: {item.name}
    </Text>
    <Text style={[styles.content, { color: textColor }]}>
      カラー: {item.color_code}
    </Text>
    <Text style={[styles.content, { color: textColor }]}>
      車体番号: {item.chassis_number}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    fontSize: 16,
    color: "#333",
  },
});

export default TaskItem;
