import CustomAlertDialog from "@/components/CustomAlertDialog";
import { API_BASE_URL, useTasksLogic } from "@/hooks/useTasks";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type MasterDataItem = {
  id: number;
  name?: string;
  content?: string;
  number?: string;
  code?: string;
  color_code?: string;
  car_name?: string;
  user_name?: string;
  work_content?: string;
};

type NewTaskData = {
  title: string;
  content: string;
  name: string;
  chassis_number?: string | null;
  u_name?: string | null;
  color_id: number;
  work_id: number;
  car_id: number;
  user_id: number;
  remark?: string | null;
  completion: string;
};

/**
 * タスク編集画面
 *
 * タスク一覧画面で選択されたタスクの編集を行う画面
 *
 */
export default function TaskEditScreen() {
  const params = useLocalSearchParams();
  const task_id = params.id as string;

  const [work_id, setWorkId] = useState<string | null>(null);
  const [car_id, setCarId] = useState<string | null>(null);
  const [chassis_number, setChassisNumber] = useState("");
  const [color_id, setColorId] = useState<string | null>(null);
  const [user_id, setUserId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [completion_date, setCompletionDate] = useState(new Date());
  const [show_date_picker, setShowDatePicker] = useState(false);

  const [works, setWorks] = useState<MasterDataItem[]>([]);
  const [car_models, setCarModels] = useState<MasterDataItem[]>([]);
  const [colors, setColors] = useState<MasterDataItem[]>([]);
  const [users, setUsers] = useState<MasterDataItem[]>([]);
  const [master_data_loading, setMasterDataLoading] = useState(true);
  const [master_data_error, setMasterDataError] = useState<string | null>(null);

  const {
    updateTask,
    loading,
    error,
    alert_dialog_config,
    setAlertDialogConfig,
  } = useTasksLogic();

  const [initial_task_loading, setInitialTaskLoading] = useState(true);
  const [initial_task_error, setInitialTaskError] = useState<string | null>(
    null
  );

  useEffect(() => {
    // タスクデータ、マスターデータ取得
    const fetchInitialData = async () => {
      if (!task_id) {
        setInitialTaskError("タスクIDが指定されていません。");
        setInitialTaskLoading(false);
        setMasterDataLoading(false);
        return;
      }
      try {
        setInitialTaskLoading(true);
        setMasterDataLoading(true);

        const master_response = await axios.get(
          `${API_BASE_URL}/tasks/create/init`
        );

        const api_works = master_response.data.works || [];
        const api_car_models = master_response.data.carModels || [];
        const api_colors = master_response.data.colors || [];
        const api_users = master_response.data.users || [];

        setWorks(api_works);
        setCarModels(api_car_models);
        setColors(api_colors);
        setUsers(api_users);

        const task_response = await axios.get(
          `${API_BASE_URL}/tasks/${task_id}`
        );
        const fetched_task = task_response.data;

        setWorkId(fetched_task.work_id?.toString() || null);
        setCarId(fetched_task.car_id?.toString() || null);
        setChassisNumber(fetched_task.chassis_number || "");
        setColorId(fetched_task.color_id?.toString() || null);
        setUserId(fetched_task.user_id?.toString() || null);
        setRemark(fetched_task.remark || "");
        setCompletionDate(
          fetched_task.completion
            ? new Date(fetched_task.completion)
            : new Date()
        );

        if (master_response.data.works.length > 0 && !fetched_task.wo_id)
          setWorkId(master_response.data.works[0].id.toString());
        if (master_response.data.carModels.length > 0 && !fetched_task.ca_id)
          setCarId(master_response.data.carModels[0].id.toString());
        if (master_response.data.colors.length > 0 && !fetched_task.co_id)
          setColorId(master_response.data.colors[0].id.toString());
        if (master_response.data.users.length > 0 && !fetched_task.u_id)
          setUserId(master_response.data.users[0].id.toString());
      } catch (err) {
        setInitialTaskError(
          "タスクデータまたはマスターデータの取得に失敗しました。"
        );
      } finally {
        setInitialTaskLoading(false);
        setMasterDataLoading(false);
      }
    };
    fetchInitialData();
  }, [task_id]);

  const onDateChange = (event: any, selected_date_param?: Date) => {
    const current_date = selected_date_param || completion_date;
    setCompletionDate(current_date);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // 更新ボタン押下
  const handleSubmit = async () => {
    if (!work_id || !car_id || !chassis_number || !color_id || !user_id) {
      setAlertDialogConfig({
        visible: true,
        title: "エラー",
        message: "作業箇所、車名、車台番号、カラー、担当者、作業日は必須です。",
        onConfirm: () =>
          setAlertDialogConfig((prev) => ({ ...prev, visible: false })),
      });
      return;
    }
    if (!/^[0-9]{8}$/.test(chassis_number)) {
      setAlertDialogConfig({
        visible: true,
        title: "エラー",
        message: "車台番号は8桁の数字で入力してください。",
        onConfirm: () =>
          setAlertDialogConfig((prev) => ({ ...prev, visible: false })),
      });
      return;
    }

    const updated_task_data: NewTaskData = {
      work_id: parseInt(work_id),
      car_id: parseInt(car_id),
      chassis_number: chassis_number,
      color_id: parseInt(color_id),
      user_id: parseInt(user_id),
      remark: remark || null,
      completion: completion_date.toISOString().split("T")[0],
      title:
        works.find((w) => w.id === parseInt(work_id))?.content || "不明な作業",
      content:
        works.find((w) => w.id === parseInt(work_id))?.content || "不明な作業",
      name:
        car_models.find((cm) => cm.id === parseInt(car_id))?.name ||
        "不明な車種",
      u_name:
        users.find((u) => u.id === parseInt(user_id))?.name || "不明な担当者",
    };

    const success = await updateTask(task_id, updated_task_data);
    if (success) {
      setAlertDialogConfig({
        visible: true,
        title: "成功",
        message: "タスクが更新されました。",
        onConfirm: () => {
          setAlertDialogConfig((prev) => ({ ...prev, visible: false }));
          router.back();
        },
      });
    } else {
      setAlertDialogConfig({
        visible: true,
        title: "エラー",
        message: error || "タスクの更新に失敗しました。",
        onConfirm: () =>
          setAlertDialogConfig((prev) => ({ ...prev, visible: false })),
      });
    }
  };

  // ロード中/エラー表示
  if (initial_task_loading || master_data_loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>データを読み込み中...</Text>
      </View>
    );
  }
  if (initial_task_error || master_data_error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>
          {initial_task_error || master_data_error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <Stack.Screen options={{ headerTitle: "タスク編集" }} />
      <View style={styles.formContainer}>
        {/* 作業箇所 */}
        <Text style={styles.label}>作業箇所：</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={work_id}
            onValueChange={(item_value: any) => setWorkId(item_value)}
          >
            {works.map((work) => (
              <Picker.Item
                key={work.id}
                label={work.content || ""}
                value={work.id.toString()}
              />
            ))}
          </Picker>
        </View>

        {/* 車名 */}
        <Text style={styles.label}>車名：</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={car_id}
            onValueChange={(item_value: any) => setCarId(item_value)}
          >
            {car_models.map((car_model) => (
              <Picker.Item
                key={car_model.id}
                label={`${car_model.name}：${car_model.number}`} // APIレスポンスのキー名を確認
                value={car_model.id.toString()}
              />
            ))}
          </Picker>
        </View>

        {/* 車台番号 */}
        <Text style={styles.label}>車台番号：</Text>
        <TextInput
          style={styles.input}
          placeholder="8桁の数字"
          value={chassis_number}
          onChangeText={setChassisNumber}
          keyboardType="numeric"
          maxLength={8}
        />

        {/* カラー */}
        <Text style={styles.label}>カラー：</Text>
        <View style={styles.colorPickerContainer}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color.id}
              style={[
                styles.colorOption,
                { backgroundColor: `#${color.color_code}` },
                color_id === color.id.toString() && styles.selectedColorOption,
              ]}
              onPress={() => setColorId(color.id.toString())}
            >
              <Text style={styles.colorLabel}>{color.code}</Text>{" "}
            </TouchableOpacity>
          ))}
        </View>

        {/* 担当者 */}
        <Text style={styles.label}>担当者：</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={user_id}
            onValueChange={(item_value: any) => setUserId(item_value)}
          >
            {users.map((user) => (
              <Picker.Item
                key={user.id}
                label={user.name || ""}
                value={user.id.toString()}
              />
            ))}
          </Picker>
        </View>

        {/* 備考 */}
        <Text style={styles.label}>備考：</Text>
        <TextInput
          style={styles.input}
          placeholder="備考を入力"
          value={remark}
          onChangeText={setRemark}
        />

        {/* 作業日 */}
        <Text style={styles.label}>作業日：</Text>
        <TouchableOpacity
          onPress={showDatepicker}
          style={styles.dateInputContainer}
        >
          <TextInput
            style={styles.input}
            value={completion_date.toISOString().split("T")[0]}
            editable={false}
          />
          <Ionicons
            name="calendar"
            size={24}
            color="#333"
            style={styles.calendarIcon}
          />
        </TouchableOpacity>
        {show_date_picker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={completion_date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Button
          title={loading ? "更新中..." : "タスクを更新"}
          onPress={handleSubmit}
          disabled={loading || initial_task_loading || master_data_loading}
          color="#007bff"
        />
        {error && <Text style={styles.errorMessage}>{error}</Text>}
      </View>
      <CustomAlertDialog
        visible={alert_dialog_config.visible}
        title={alert_dialog_config.title}
        message={alert_dialog_config.message}
        onConfirm={alert_dialog_config.onConfirm}
        onCancel={alert_dialog_config.onCancel}
        confirm_text={alert_dialog_config.confirm_text}
        cancel_text={alert_dialog_config.cancel_text}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#fefefe",
    fontSize: 16,
  },
  pickerContainer: {
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fefefe",
    overflow: "hidden",
  },
  colorPickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
    gap: 10,
  },
  colorOption: {
    width: 80,
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColorOption: {
    borderColor: "#007bff",
  },
  colorLabel: {
    color: "white",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 2,
  },
  dateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  calendarIcon: {
    position: "absolute",
    right: 15,
  },
  errorMessage: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});
