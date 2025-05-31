import { TaskData } from "@/types/data";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export const API_BASE_URL = "http://localhost/api";

type NewTaskData = {
  title: string;
  content: string;
  name: string;
  color_code?: string | null;
  chassis_number?: string | null;
  u_name?: string | null;
  work_id: number;
  car_id: number;
  user_id: number;
  remark?: string | null;
  completion: string;
};


type UseTasksResult = {
  selected_id: string | undefined;
  setSelectedId: (id: string | undefined) => void;
  tasks: TaskData[];
  loading: boolean;
  error: string | null;
  selected_date: string | null;
  marked_dates: { [key: string]: any };
  fetchTasks: (date_param?: string) => Promise<void>;
  createTask: (newTask: NewTaskData) => Promise<boolean>;
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
  const [selected_date, setSelectedDate] = useState<string | null>(null);
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

  const createTask = useCallback(async (newTask: NewTaskData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_BASE_URL}/tasks`, newTask);

      if (response.status === 201 || response.status === 200) {
        console.log("タスク登録成功:", response.data);

        await fetchTasks(selected_date || undefined);
        return true;
      } else {
        setError(`タスクの登録に失敗しました。ステータスコード: ${response.status}`);
        return false;
      }
    } catch (err) {
      console.error("タスク登録エラー:", err);

      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;
        if (errorData.errors) {
          const validationErrors = Object.values(errorData.errors).flat().join('\n');
          setError(`登録エラー:\n${validationErrors}`);
        } else if (errorData.message) {
          setError(`登録エラー: ${errorData.message}`);
        } else {
          setError(`登録エラー: ${err.response.status} ${err.response.statusText}`);
        }
      } else {
        setError(`不明な登録エラー: ${err instanceof Error ? err.message : String(err)}`);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchTasks, selected_date]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const new_marked_dates: { [key: string]: any } = {};
    const task_by_date: { [key: string]: TaskData[] } = {};

    tasks.forEach((task) => {
      if (task.completion) {
        const date = new Date(task.completion);
        const dateString = date.toISOString().split("T")[0];
        if (!task_by_date[dateString]) {
          task_by_date[dateString] = [];
        }
        task_by_date[dateString].push(task);
      }

      for (const dateString in task_by_date){
        const daily_tasks = task_by_date[dateString];
        new_marked_dates[dateString] = {
          ...(new_marked_dates[dateString] || {}),
          marked: true,
          dotColor: "blue",
          dots:[
            {key:'tasks',color:daily_tasks.length > 3 ? 'red':'green',selectedDotColor: 'white'}
          ]
        };
      }
    });

    if(selected_date){
      new_marked_dates[selected_date] = {
        ...(new_marked_dates[selected_date] || {}),
        selected:true,
        selectedColor:"blue",
      };
    }

    setMarkedDates(new_marked_dates);
  }, [tasks, selected_date]);

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
    selected_date,
    marked_dates,
    fetchTasks,
    createTask,
    onDayPress,
    onItemPress,
  };
};
