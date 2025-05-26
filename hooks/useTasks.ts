import { TaskData } from "@/types/data";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

const API_BASE_URL = "http://localhost/api";

type UseTasksResult = {
  selected_id: string | undefined;
  setSelectedId: (id: string | undefined) => void;
  tasks: TaskData[];
  loading: boolean;
  error: string | null;
  selected_data: string | null;
  marked_dates: { [key: string]: any };
  fetchTasks: (date_param?: string) => Promise<void>;
  onDayPress: (day: { dateString: string }) => void;
  onItemPress: (id: string) => void;
};

/**
 * アプリケーションのタスクデータ取得と状態管理を行うカスタムフック
 *
 * APIからタスクデータをフェッチし、ロード状態、エラー状態、カレンダーの選択日付、
 * タスクアイテムの選択ID、およびカレンダーの日付マークを管理
 *
 */
export const useTasksLogic = (): UseTasksResult => {
  const [selected_id, setSelectedId] = useState<string>();
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected_data, setSelectedDate] = useState<string | null>(null);
  const [marked_dates, setMarkedDates] = useState<{ [key: string]: any }>({});

  const fetchTasks = useCallback(async (date_param?: string) => {
    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE_URL}/tasks`;
      if (date_param) {
        const [year, month, day] = date_param.split("-");
        url = `${API_BASE_URL}/tasks?year=${year}&month=${month}&day=${day}`;
      }

      const response = await axios.get(url);
      const fetchedData: TaskData[] = response.data.map((task: any) => ({
        id: task.id.toString(),
        title: task.name || "No Car Name",
        content: task.content || "No Content",
        name: task.name || "No Car Name",
        color_code: task.code || "No Color Code",
        chassis_number: task.chassis_number || "No Car Number",
        u_name: task.u_name || "不明",
        wo_id: task.wo_id,
        ca_id: task.ca_id,
        u_id: task.u_id,
        admin_id: task.admin_id,
        co_id: task.co_id,
        remark: task.remark,
        admin_name: task.admin_name,
        comp_flg: task.comp_flg,
        completion: task.completion,
      }));
      setTasks(fetchedData);
    } catch (err) {
      console.error("API呼び出しエラー:", err);
      setError("データの取得に失敗しました。");

      if (axios.isAxiosError(err) && err.response) {
        console.error("レスポンスデータ:", err.response.data);
        console.error("ステータスコード:", err.response.status);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const newMarkedDates: { [key: string]: any } = {};

    tasks.forEach((task) => {
      if (task.completion) {
        const date = new Date(task.completion);
        const dateString = date.toISOString().split("T")[0];
        newMarkedDates[dateString] = {
          ...(newMarkedDates[dateString] || {}),
          marked: true,
          dotColor: "blue",
        };
      }
    });

    setMarkedDates(newMarkedDates);
  }, [tasks, selected_data]);

  // カレンダーの日付が選択された時のハンドラー
  const onDayPress = useCallback(
    (day: { dateString: string }) => {
      setSelectedDate(day.dateString);
      fetchTasks(day.dateString);
    },
    [fetchTasks]
  );

  // アイテムが選択された時のハンドラー
  const onItemPress = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return {
    selected_id,
    setSelectedId,
    tasks,
    loading,
    error,
    selected_data,
    marked_dates,
    fetchTasks,
    onDayPress,
    onItemPress,
  };
};
