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
  marked_dates: { [key: string]: any };
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
  marked_dates,
  onDayPress,
}: TaskCalendarProps) => {
  return (
    <View style={styles.calendarContainer}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          ...marked_dates,
          ...(selected_date
            ? { [selected_date]: { selected: true, selectedColor: "blue" } }
            : {}),
        }}
        theme={CALENDAR_THEME}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    width: "95%",
    marginInline: "auto",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
});

export default TaskCalendar;
