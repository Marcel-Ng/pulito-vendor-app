import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const SERVICE_SLOTS = ["24 Hours", "48 Hours", "One Week", "3 Days"];

type BusinessHour = {
  day: string;
  openTime: string;
  closeTime: string;
};

export default function BusinessOperationScreen() {
  const router = useRouter();
  const [slotsOpen, setSlotsOpen] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([
    "24 Hours",
    "48 Hours",
    "One Week",
    "3 Days",
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [selectedDay, setSelectedDay] = useState("MON");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");

  const toggleSlot = (slot: string) => {
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot],
    );
  };

  const handleSaveHours = () => {
    if (!openTime || !closeTime) return;
    setBusinessHours((prev) => {
      const filtered = prev.filter((h) => h.day !== selectedDay);
      return [...filtered, { day: selectedDay, openTime, closeTime }];
    });
    setOpenTime("");
    setCloseTime("");
    setModalVisible(false);
  };

  const getHourForDay = (day: string) =>
    businessHours.find((h) => h.day === day);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#111" />
          </TouchableOpacity>
          <Text style={styles.title}>Business Operation</Text>
        </View>

        {/* Service Slots */}
        <Text style={styles.sectionLabel}>Service Slots</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setSlotsOpen((v) => !v)}
        >
          <Text style={styles.dropdownText} numberOfLines={1}>
            {selectedSlots.length > 0
              ? selectedSlots.join(", ")
              : "Select slots"}
          </Text>
          <Ionicons
            name={slotsOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>

        {slotsOpen && (
          <View style={styles.dropdownMenu}>
            {SERVICE_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={styles.dropdownItem}
                onPress={() => toggleSlot(slot)}
              >
                <Text style={styles.dropdownItemText}>{slot}</Text>
                {selectedSlots.includes(slot) && (
                  <Ionicons name="checkmark" size={18} color="#F5C518" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Business Hours */}
        <Text style={[styles.sectionLabel, { marginTop: 28 }]}>
          Business Hours
        </Text>

        {businessHours.length > 0 && (
          <View style={styles.hoursList}>
            {businessHours.map((h) => (
              <View key={h.day} style={styles.hourRow}>
                <Text style={styles.hourDay}>{h.day}</Text>
                <Text style={styles.hourTime}>
                  {h.openTime} – {h.closeTime}
                </Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.setupBtn}
          onPress={() => setModalVisible(true)}
        >
          <View style={styles.setupIcon}>
            <Ionicons name="add" size={18} color="#fff" />
          </View>
          <Text style={styles.setupText}>Setup business hours</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Sheet Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Setup Business Hours</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color="#111" />
              </TouchableOpacity>
            </View>

            <Text style={styles.sheetLabel}>Select Day</Text>
            <View style={styles.daysRow}>
              {DAYS.map((day) => {
                const hasHours = !!getHourForDay(day);
                const isSelected = selectedDay === day;
                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayBtn,
                      isSelected && styles.dayBtnSelected,
                      hasHours && !isSelected && styles.dayBtnHasHours,
                    ]}
                    onPress={() => {
                      setSelectedDay(day);
                      const existing = getHourForDay(day);
                      setOpenTime(existing?.openTime ?? "");
                      setCloseTime(existing?.closeTime ?? "");
                    }}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isSelected && styles.dayTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.timesRow}>
              <View style={styles.timeGroup}>
                <Text style={styles.sheetLabel}>Open time</Text>
                <TextInput
                  style={styles.timeInput}
                  placeholder="Set"
                  value={openTime}
                  onChangeText={setOpenTime}
                  placeholderTextColor="#aaa"
                />
              </View>
              <View style={styles.timeGroup}>
                <Text style={styles.sheetLabel}>Close time</Text>
                <TextInput
                  style={styles.timeInput}
                  placeholder="Set"
                  value={closeTime}
                  onChangeText={setCloseTime}
                  placeholderTextColor="#aaa"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.saveBtn,
                openTime && closeTime ? styles.saveBtnActive : null,
              ]}
              onPress={handleSaveHours}
            >
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 24, paddingTop: 60 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    gap: 12,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 22, fontWeight: "700", color: "#111" },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fafafa",
  },
  dropdownText: { fontSize: 15, color: "#444", flex: 1, marginRight: 8 },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginTop: 4,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: { fontSize: 15, color: "#222" },
  hoursList: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 12,
    overflow: "hidden",
  },
  hourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  hourDay: { fontWeight: "600", color: "#111" },
  hourTime: { color: "#555" },
  setupBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  setupIcon: {
    backgroundColor: "#F5C518",
    borderRadius: 8,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  setupText: {
    color: "#F5C518",
    fontWeight: "600",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  sheetTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  sheetLabel: { fontSize: 13, color: "#888", marginBottom: 10 },
  daysRow: { flexDirection: "row", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  dayBtn: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  dayBtnSelected: { borderColor: "#111", backgroundColor: "#111" },
  dayBtnHasHours: { borderColor: "#F5C518", backgroundColor: "#FFF8E1" },
  dayText: { fontSize: 12, fontWeight: "600", color: "#444" },
  dayTextSelected: { color: "#fff" },
  timesRow: { flexDirection: "row", gap: 16, marginBottom: 24 },
  timeGroup: { flex: 1 },
  timeInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#222",
  },
  saveBtn: {
    backgroundColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnActive: { backgroundColor: "#F5C518" },
  saveBtnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
