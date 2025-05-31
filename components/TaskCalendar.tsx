import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";

type CalendarTheme = React.ComponentProps<typeof Calendar>["theme"];

const CALENDAR_THEME: CalendarTheme = {
  selectedDayBackgroundColor: "#00adf5",
  selectedDayTextColor: "#ffffff",
  todayTextColor: "#00adf5",
  dayTextColor: "#2d4150",
  textDisabledColor: "#d9e1e8",
  dotColor: "#00adf5",
  selectedDotColor: "#ffffff",
  arrowColor: "#00adf5",
  monthTextColor: "#2d4150",
  textDayFontWeight: "300",
  textMonthFontWeight: "bold",
  textDayHeaderFontWeight: "300",
  textDayFontSize: 16,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 16,
};

type TaskCalendarProps = {
  selected_date: string | null;
  markedDates: { [key: string]: any };
  onDayPress: (day: { dateString: string }) => void;
};

/**
 * タスク表示用カレンダーコンポーネント
 *
 * 特定の日付にマークを付け、ユーザーが日付をタップした際のイベントを処理
 *
 */
const TaskCalendar = ({
  selected_date,
  markedDates,
  onDayPress,
}: TaskCalendarProps) => {
  const combinedMarkedDates = {
    ...markedDates,
    ...(selected_date
      ? {
          [selected_date]: {
            ...markedDates[selected_date],
            selected: true,
            selectedColor: "blue",
          },
        }
      : {}),
  };

  return (
    <View style={styles.calendarContainer}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={combinedMarkedDates}
        theme={CALENDAR_THEME}
        monthFormat="yyyy年 MM月"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    flex: 1,
    width: "95%",
    marginHorizontal: "auto",
    marginBottom: 0,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
});

export default TaskCalendar;
