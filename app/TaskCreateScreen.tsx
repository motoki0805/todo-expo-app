import CustomAlertDialog from "@/components/CustomAlertDialog";
import { API_BASE_URL, useTasksLogic } from "@/hooks/useTasks";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { router, Stack } from "expo-router";
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
 * タスク登録画面
 *
 * タスクの新規登録を行う
 *
 */
export default function TaskCreateScreen() {
  const [work_id, setWorkId] = useState<string | null>(null);
  const [car_id, setCarId] = useState<string | null>(null);
  const [chassis_number, setChassisNumber] = useState("");
  const [color_id, setColorId] = useState<string | null>(null);
  const [user_id, setUserId] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [completion_date, setCompletionDate] = useState(new Date());
  const [show_date_picker, setShowDatePicker] = useState(false);

  // マスターデータ
  const [works, setWorks] = useState<MasterDataItem[]>([]);
  const [car_models, setCarModels] = useState<MasterDataItem[]>([]);
  const [colors, setColors] = useState<MasterDataItem[]>([]);
  const [users, setUsers] = useState<MasterDataItem[]>([]);
  const [master_data_loading, setMasterDataLoading] = useState(true);
  const [master_data_error, setMasterDataError] = useState<string | null>(null);

  const {
    createTask,
    loading,
    error,
    alert_dialog_config,
    setAlertDialogConfig,
  } = useTasksLogic();

  useEffect(() => {
    // マスターデータ取得
    const fetchMasterData = async () => {
      try {
        setMasterDataLoading(true);

        const response = await axios.get(`${API_BASE_URL}/tasks/create/init`);

        setWorks(response.data.works);
        setCarModels(response.data.carModels);
        setColors(response.data.colors);
        setUsers(response.data.users);

        if (response.data.works.length > 0)
          setWorkId(response.data.works[0].id.toString());
        if (response.data.carModels.length > 0)
          setCarId(response.data.carModels[0].id.toString());
        if (response.data.colors.length > 0)
          setColorId(response.data.colors[0].id.toString());
        if (response.data.users.length > 0)
          setUserId(response.data.users[0].id.toString());
      } catch (err) {
        setMasterDataError("マスターデータの取得に失敗しました。");
      } finally {
        setMasterDataLoading(false);
      }
    };
    fetchMasterData();
  }, []);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const current_date = selectedDate || completion_date;
    setCompletionDate(current_date);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  // 登録ボタン押下
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

    const new_task_data: NewTaskData = {
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

    const success = await createTask(new_task_data);
    if (success) {
      setAlertDialogConfig({
        visible: true,
        title: "成功",
        message: "タスクが登録されました。",
        onConfirm: () => {
          setAlertDialogConfig((prev) => ({ ...prev, visible: false }));
          router.back();
        },
      });
    } else {
      setAlertDialogConfig({
        visible: true,
        title: "エラー",
        message: error || "タスクの登録に失敗しました。",
        onConfirm: () =>
          setAlertDialogConfig((prev) => ({ ...prev, visible: false })),
      });
    }
  };

  // ロード中/エラー表示
  if (master_data_loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>マスターデータを読み込み中...</Text>
      </View>
    );
  }
  if (master_data_error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{master_data_error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <Stack.Screen options={{ headerTitle: "タスク新規登録" }} />
      <View style={styles.formContainer}>
        {/* 作業箇所 */}
        <Text style={styles.label}>作業箇所：</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={work_id}
            onValueChange={(itemValue: any) => setWorkId(itemValue)}
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
            onValueChange={(itemValue: any) => setCarId(itemValue)}
          >
            {car_models.map((car_models) => (
              <Picker.Item
                key={car_models.id}
                label={`${car_models.name}：${car_models.number}`}
                value={car_models.id.toString()}
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
              <Text style={styles.colorLabel}>{color.code}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 担当者 */}
        <Text style={styles.label}>担当者：</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={user_id}
            onValueChange={(itemValue: any) => setUserId(itemValue)}
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
          title={loading ? "登録中..." : "登録"}
          onPress={handleSubmit}
          disabled={loading || master_data_loading}
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
    shadowOffset: { width: 0, height: 2 },
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
    textShadowOffset: { width: 1, height: 1 },
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
