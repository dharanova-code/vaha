import React from "react";
import { Modal, View, Text } from "react-native";
import { DialogProps } from "./Component.types";
import { styles } from "./Component.styles";
import { Button } from "../Button";

export const Dialog: React.FC<DialogProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  children,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {children}
          <View style={styles.buttons}>
            {onCancel && cancelText ? (
              <Button onPress={onCancel} variant="secondary">{cancelText}</Button>
            ) : null}
            <Button onPress={onConfirm}>{confirmText}</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};