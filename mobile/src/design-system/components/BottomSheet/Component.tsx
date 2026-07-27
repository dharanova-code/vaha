import React from "react";
import { View, TouchableWithoutFeedback, Modal } from "react-native";
import { BottomSheetProps } from "./Component.types";
import { styles } from "./Component.styles";

export const BottomSheet: React.FC<BottomSheetProps> = ({ visible, onClose, children }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.sheet}>
        {children}
      </View>
    </Modal>
  );
};