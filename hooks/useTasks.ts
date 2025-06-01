import { TaskData } from "@/types/data";
import axios from "axios";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";

export const API_BASE_URL = "http://localhost/api";

type AlertDialogConfig = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirm_text?: string;
  cancel_text?: string;
};

type NewTaskData = {
  title: string;
  content: string;
  name: string;
  color_code?: string | null;
  chassis_number?: string | null;
  u_name?: string | null;
  color_id: number;
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
  updateTask: (id: string, updated_task: NewTaskData) => Promise<boolean>;
  onDayPress: (day: { dateString: string }) => void;
  onItemPress: (id: string) => void;
  onCompletePress: (id: string) => void;
  onEditPress: (id: string) => void;
  onDeletePress: (id: string) => void;
  alert_dialog_config: AlertDialogConfig;
  setAlertDialogConfig: React.Dispatch<React.SetStateAction<AlertDialogConfig>>;
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
  const [alert_dialog_config, setAlertDialogConfig] =
    useState<AlertDialogConfig>({
      visible: false,
      title: "",
      message: "",
    });

  //タスク一覧の取得
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
        content: task.content || "No Content",
        chassis_number: task.chassis_number || "No Car Number",
        remark: task.remark,
        comp_flg: task.comp_flg,
        completion: task.completion,
        wo_id: task.wo_id,
        ca_id: task.ca_id,
        co_id: task.co_id,
        u_id: task.u_id,
        admin_id: task.admin_id,
        work: task.work,
        car_model: task.car_model,
        color: task.color,
        user: task.user,
        admin: task.admin,
        name: task.name || (task.car_model ? task.car_model.name : undefined),
        code: task.code || (task.color ? task.color.code : undefined),
        admin_name:
          task.admin_name || (task.admin ? task.admin.name : undefined),
        u_name: task.u_name || (task.user ? task.user.name : undefined),
        title:
          task.title ||
          task.name ||
          (task.car_model ? task.car_model.name : "不明なタイトル"),
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

  // タスク登録処理
  const createTask = useCallback(
    async (new_task: NewTaskData): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.post(`${API_BASE_URL}/tasks`, new_task);

        if (response.status === 201 || response.status === 200) {
          await fetchTasks(selected_date || undefined);
          return true;
        } else {
          setError(
            `タスクの登録に失敗しました。ステータスコード: ${response.status}`
          );
          return false;
        }
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorData = err.response.data;
          if (errorData.errors) {
            const validationErrors = Object.values(errorData.errors)
              .flat()
              .join("\n");
            setError(`登録エラー:\n${validationErrors}`);
          } else if (errorData.message) {
            setError(`登録エラー: ${errorData.message}`);
          } else {
            setError(
              `登録エラー: ${err.response.status} ${err.response.statusText}`
            );
          }
        } else {
          setError(
            `不明な登録エラー: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks, selected_date]
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const new_marked_dates: { [key: string]: any } = {};
    const task_by_date: { [key: string]: TaskData[] } = {};

    // カレンダーのマーク追加
    tasks.forEach((task) => {
      if (task.completion) {
        const date = new Date(task.completion);
        const date_string = date.toISOString().split("T")[0];
        if (!task_by_date[date_string]) {
          task_by_date[date_string] = [];
        }
        task_by_date[date_string].push(task);
      }

      for (const date_string in task_by_date) {
        const daily_tasks = task_by_date[date_string];
        new_marked_dates[date_string] = {
          ...(new_marked_dates[date_string] || {}),
          marked: true,
          dotColor: "blue",
          dots: [
            {
              key: "tasks",
              color: daily_tasks.length > 3 ? "red" : "green",
              selectedDotColor: "white",
            },
          ],
        };
      }
    });

    if (selected_date) {
      new_marked_dates[selected_date] = {
        ...(new_marked_dates[selected_date] || {}),
        selected: true,
        selectedColor: "blue",
      };
    }

    setMarkedDates(new_marked_dates);
  }, [tasks, selected_date]);

  // タスク編集処理
  const updateTask = useCallback(
    async (id: string, updated_task: NewTaskData): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.put(
          `${API_BASE_URL}/tasks/${id}`,
          updated_task
        );

        if (response.status === 200) {
          console.log(`タスクID ${id} を更新しました。`, response.data);
          setAlertDialogConfig({
            visible: true,
            title: "成功",
            message: "タスクが更新されました。",
            onConfirm: () =>
              setAlertDialogConfig({ ...alert_dialog_config, visible: false }),
          });
          await fetchTasks(selected_date || undefined);
          return true;
        } else {
          const message = `タスクの更新に失敗しました。ステータスコード: ${response.status}`;
          setError(message);
          setAlertDialogConfig({
            visible: true,
            title: "エラー",
            message: message,
            onConfirm: () =>
              setAlertDialogConfig({ ...alert_dialog_config, visible: false }),
          });
          return false;
        }
      } catch (err) {
        console.error("タスク更新エラー:", err);
        let error_message = "不明な更新エラー";
        if (axios.isAxiosError(err) && err.response) {
          const error_data = err.response.data;
          if (error_data.errors) {
            const validation_errors = Object.values(error_data.errors)
              .flat()
              .join("\n");
            error_message = `更新エラー:\n${validation_errors}`;
          } else if (error_data.message) {
            error_message = `更新エラー: ${error_data.message}`;
          } else {
            error_message = `更新エラー: ${err.response.status} ${
              err.response.statusText || ""
            }`;
          }
        } else {
          error_message = `不明な更新エラー: ${
            err instanceof Error ? err.message : String(err)
          }`;
        }
        setError(error_message);
        setAlertDialogConfig({
          visible: true,
          title: "エラー",
          message: error_message,
          onConfirm: () =>
            setAlertDialogConfig({ ...alert_dialog_config, visible: false }),
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchTasks, selected_date, alert_dialog_config]
  );

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

  // 編集ボタンが押下された時のハンドラー
  const onEditPress = useCallback((id: string) => {
    router.push({
      pathname: "/TaskEditScreen",
      params: { id: id },
    });
    console.log(`編集ボタンが押下されました：タスクID${id}`);
  }, []);

  // 完了ボタンが押下された時のハンドラー
  const onCompletePress = useCallback(
    async (id: string) => {
      setAlertDialogConfig({
        visible: true,
        title: "タスク完了の確認",
        message: `ID ${id} のタスクを完了状態にしますか？`,
        onConfirm: async () => {
          setAlertDialogConfig({ ...alert_dialog_config, visible: false });
          try {
            setLoading(true);
            setError(null);
            const response = await axios.put(
              `${API_BASE_URL}/tasks/${id}/complete`
            );

            if (response.status === 200) {
              console.log(`タスクID ${id} を完了しました。`);
              setAlertDialogConfig({
                visible: true,
                title: "成功",
                message: "タスクが完了されました。",
                onConfirm: () =>
                  setAlertDialogConfig({
                    ...alert_dialog_config,
                    visible: false,
                  }),
              });
              await fetchTasks(selected_date || undefined);
            } else {
              const message = `タスクの完了に失敗しました。ステータスコード: ${response.status}`;
              setError(message);
              setAlertDialogConfig({
                visible: true,
                title: "エラー",
                message: message,
                onConfirm: () =>
                  setAlertDialogConfig({
                    ...alert_dialog_config,
                    visible: false,
                  }),
              });
            }
          } catch (err) {
            console.error("タスク完了エラー:", err);
            let errorMessage = "不明な完了エラー";
            if (axios.isAxiosError(err) && err.response) {
              errorMessage = `完了エラー: ${err.response.status} ${
                err.response.statusText || err.response.data.message || ""
              }`;
            } else {
              errorMessage = `不明な完了エラー: ${
                err instanceof Error ? err.message : String(err)
              }`;
            }
            setError(errorMessage);
            setAlertDialogConfig({
              visible: true,
              title: "エラー",
              message: errorMessage,
              onConfirm: () =>
                setAlertDialogConfig({
                  ...alert_dialog_config,
                  visible: false,
                }),
            });
          } finally {
            setLoading(false);
          }
        },
        onCancel: () =>
          setAlertDialogConfig({ ...alert_dialog_config, visible: false }),
        confirm_text: "完了",
        cancel_text: "キャンセル",
      });
    },
    [fetchTasks, selected_date, alert_dialog_config]
  );

  // 削除ボタンが押下された時のハンドラー
  const onDeletePress = useCallback(
    async (id: string) => {
      setAlertDialogConfig({
        visible: true,
        title: "タスク削除の確認",
        message: `ID ${id} のタスクを本当に削除しますか？`,
        onConfirm: async () => {
          setAlertDialogConfig({ ...alert_dialog_config, visible: false });
          try {
            setLoading(true);
            setError(null);
            const response = await axios.delete(`${API_BASE_URL}/tasks/${id}`);

            if (response.status === 200 || response.status === 204) {
              console.log(`タスクID ${id} を削除しました。`);
              setAlertDialogConfig({
                visible: true,
                title: "成功",
                message: "タスクが削除されました。",
                onConfirm: () =>
                  setAlertDialogConfig({
                    ...alert_dialog_config,
                    visible: false,
                  }),
              });
              await fetchTasks(selected_date || undefined);
            } else {
              const message = `タスクの削除に失敗しました。ステータスコード: ${response.status}`;
              setError(message);
              setAlertDialogConfig({
                visible: true,
                title: "エラー",
                message: message,
                onConfirm: () =>
                  setAlertDialogConfig({
                    ...alert_dialog_config,
                    visible: false,
                  }),
              });
            }
          } catch (err) {
            console.error("タスク削除エラー:", err);
            let errorMessage = "不明な削除エラー";
            if (axios.isAxiosError(err) && err.response) {
              errorMessage = `削除エラー: ${err.response.status} ${
                err.response.statusText || err.response.data.message || ""
              }`;
            } else {
              errorMessage = `不明な削除エラー: ${
                err instanceof Error ? err.message : String(err)
              }`;
            }
            setError(errorMessage);
            setAlertDialogConfig({
              visible: true,
              title: "エラー",
              message: errorMessage,
              onConfirm: () =>
                setAlertDialogConfig({
                  ...alert_dialog_config,
                  visible: false,
                }),
            });
          } finally {
            setLoading(false);
          }
        },
        onCancel: () =>
          setAlertDialogConfig({ ...alert_dialog_config, visible: false }),
        confirm_text: "削除",
        cancel_text: "キャンセル",
      });
    },
    [fetchTasks, selected_date, alert_dialog_config]
  );

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
    updateTask,
    onDayPress,
    onItemPress,
    onEditPress,
    onCompletePress,
    onDeletePress,
    alert_dialog_config,
    setAlertDialogConfig,
  };
};
