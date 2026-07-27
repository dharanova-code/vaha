import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { 
  Text, 
  Button, 
  Surface, 
  Card, 
  Divider, 
  Chip, 
  Badge, 
  Tag, 
  Avatar, 
  ListItem, 
  SectionHeader, 
  EmptyState, 
  Loading, 
  Progress, 
  Input, 
  SearchBar, 
  Switch, 
  Toggle, 
  Checkbox, 
  Radio, 
  FAB, 
  BottomSheet, 
  Dialog, 
  Snackbar, 
  Toast, 
  TopBar, 
  SensorCard, 
  InsightCard, 
  CaptureCard, 
  CollectionCard, 
  DeviceCard, 
  SettingsItem 
} from "../src/design-system";

export default function ShowcaseScreen() {
  const [toggleVal, setToggleVal] = useState(false);
  const [checkboxVal, setCheckboxVal] = useState(false);
  const [radioVal, setRadioVal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TopBar title="VAHA Component Showcase" />
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Primitives */}
        <SectionHeader title="Primitives" />
        <View style={styles.group}>
          <Text variant="display-lg">Display Large</Text>
          <Text variant="headline-lg">Headline Large</Text>
          <Text variant="body-md">Body medium transcript text in sans-serif.</Text>
          <Text variant="mono-bold">MONO-BOLD: 120ms</Text>
          <Text variant="mono-reg">MONO-REG: 12:45:00</Text>
        </View>

        <Divider style={styles.divider} />

        {/* Buttons */}
        <SectionHeader title="Buttons" />
        <View style={styles.row}>
          <Button onPress={() => {}} variant="primary">Primary</Button>
          <Button onPress={() => {}} variant="secondary">Secondary</Button>
          <Button onPress={() => {}} variant="outline">Outline</Button>
        </View>
        <View style={[styles.row, { marginTop: 12 }]}>
          <Button onPress={() => {}} variant="danger">Danger</Button>
          <Button onPress={() => {}} variant="ghost">Ghost</Button>
          <Button onPress={() => {}} disabled={true}>Disabled</Button>
        </View>

        <Divider style={styles.divider} />

        {/* Controls */}
        <SectionHeader title="Controls" />
        <View style={styles.group}>
          <Toggle label="Theme Auto-Sync" value={toggleVal} onValueChange={setToggleVal} />
          <Checkbox checked={checkboxVal} onChange={setCheckboxVal} label="I accept local privacy storage model" />
          <Radio selected={radioVal} onSelect={() => setRadioVal(!radioVal)} label="Select primary bluetooth channel" />
          <SearchBar value={searchVal} onChangeText={setSearchVal} onClear={() => setSearchVal("")} />
          <Input placeholder="Custom entry log..." error={toggleVal ? "Simulated validation failure" : ""} />
        </View>

        <Divider style={styles.divider} />

        {/* Indicators */}
        <SectionHeader title="Indicators" />
        <View style={styles.row}>
          <Tag label="syncing" variant="info" />
          <Tag label="verified" variant="success" />
          <Tag label="alert" variant="error" />
          <Chip label="Filter Thought" selected={checkboxVal} onPress={() => setCheckboxVal(!checkboxVal)} />
          <Avatar initials="VH" />
          <Badge count={7} />
        </View>

        <Divider style={styles.divider} />

        {/* Loading & Progress */}
        <SectionHeader title="Loading & Progress" />
        <View style={styles.group}>
          <Progress progress={0.65} />
          <Loading variant="skeleton-card" />
        </View>

        <Divider style={styles.divider} />

        {/* Cards */}
        <SectionHeader title="Telemetry & Display Cards" />
        <View style={styles.row}>
          <SensorCard label="Battery" value="98" unit="%" status="normal" />
          <SensorCard label="BLE signal" value="-42" unit="dBm" status="warning" />
        </View>
        <View style={[styles.group, { marginTop: 12 }]}>
          <DeviceCard name="VAHA Pod v1 (00:1A:7D)" status="connected" batteryLevel={92} />
          <CaptureCard title="Quiet Reflection" excerpt="The copper vessel holds water in stillness. I captured the ambient recording..." timestamp="12:30" duration="45s" onPress={() => {}} />
          <InsightCard quote="Truth is local. A thought exists in context and stillness." sourceTitle="Stoic Journal" timestamp="13:00" />
          <CollectionCard name="Weekly Reflection Logs" count={12} onPress={() => {}} />
          <SettingsItem label="Encryption Ledger Key" value="AES-256-GCM" onPress={() => {}} />
        </View>

        <Divider style={styles.divider} />

        {/* Overlays Triggers */}
        <SectionHeader title="Modals & Overlay Triggers" />
        <View style={styles.row}>
          <Button onPress={() => setSheetOpen(true)} variant="secondary">Open Sheet</Button>
          <Button onPress={() => setDialogOpen(true)} variant="secondary">Open Dialog</Button>
          <Button onPress={() => setSnackOpen(true)} variant="secondary">Show Snack</Button>
        </View>

        {/* Bottom Sheet */}
        <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
          <Text variant="headline-lg">Hardware Status Configuration</Text>
          <Text style={{ marginTop: 8, marginBottom: 16 }}>Configure firmware updates, key rotation settings, and battery logs.</Text>
          <Button onPress={() => setSheetOpen(false)}>Close Config Panel</Button>
        </BottomSheet>

        {/* Dialog */}
        <Dialog 
          visible={dialogOpen} 
          title="Factory System Reset" 
          message="This action will completely erase the local database encryption keys. This cannot be undone." 
          onConfirm={() => setDialogOpen(false)} 
          onCancel={() => setDialogOpen(false)} 
          confirmText="Yes, Reset" 
          cancelText="No, Keep Keys"
        />

        {/* Snackbar */}
        <Snackbar visible={snackOpen} message="Branding configuration synchronized." onDismiss={() => setSnackOpen(false)} />

        <Divider style={styles.divider} />
        
        {/* Empty States */}
        <SectionHeader title="Empty States" />
        <EmptyState variant="captures" />

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  scroll: {
    paddingBottom: 80,
    paddingHorizontal: 24,
  },
  group: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  divider: {
    marginVertical: 24,
  },
});
