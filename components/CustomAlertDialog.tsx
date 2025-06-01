import * as React from "react";
import { StyleSheet } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

type CustomAlertDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirm_text?: string;
  cancel_text?: string;
};

/**
 * アラート表示用コンポーネント
 *
 */
const CustomAlertDialog = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirm_text = "OK",
  cancel_text = "キャンセル",
}: CustomAlertDialogProps) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.messageText}>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          {onCancel && <Button onPress={onCancel}>{cancel_text}</Button>}
          {onConfirm && (
            <Button mode="contained" onPress={onConfirm}>
              {confirm_text}
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  messageText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default CustomAlertDialog;
