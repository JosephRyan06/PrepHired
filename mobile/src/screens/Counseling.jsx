import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { getStudentCounseling, requestCounselingAppointment, completeCounselingRecommendation } from "../api/counseling";

const formatDate = (value) => new Date(value).toLocaleString(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const Counseling = ({ navigation }) => {
  const [data, setData] = useState({ counselors: [], recommendations: [], appointments: [] });
  const [selectedCounselor, setSelectedCounselor] = useState("");
  const [startsAt, setStartsAt] = useState(new Date(Date.now() + 86400000));
  const [purpose, setPurpose] = useState("");
  const [pickerMode, setPickerMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const result = await getStudentCounseling();
      setData(result);
      setSelectedCounselor((current) => current || result.counselors[0]?._id || "");
    } catch (error) {
      Alert.alert("Career counseling", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitAppointment = async () => {
    if (!selectedCounselor) {
      Alert.alert("No counselor assigned", "Ask your program administrator to assign a counselor before requesting a session.");
      return;
    }
    if (startsAt <= new Date()) {
      Alert.alert("Choose a future time", "Appointments need to be scheduled for a future date and time.");
      return;
    }
    setSaving(true);
    try {
      await requestCounselingAppointment({
        counselorId: selectedCounselor,
        startsAt: startsAt.toISOString(),
        purpose: purpose.trim(),
      });
      setPurpose("");
      Alert.alert("Request sent", "Your counselor will confirm the session.");
      await loadData();
    } catch (error) {
      Alert.alert("Could not request session", error.message);
    } finally {
      setSaving(false);
    }
  };

  const completeTask = async (recommendationId) => {
    try {
      await completeCounselingRecommendation(recommendationId);
      await loadData();
    } catch (error) {
      Alert.alert("Could not update task", error.message);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity accessibilityLabel="Go back" onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
          </TouchableOpacity>
          <View><Text style={styles.kicker}>CAREER SUPPORT</Text><Text style={styles.title}>Counseling</Text></View>
        </View>

        <View style={styles.intro}>
          <Ionicons name="chatbubbles-outline" size={23} color="#93BFFF" />
          <View style={styles.introCopy}><Text style={styles.introTitle}>A plan, with a person behind it.</Text><Text style={styles.muted}>Meet with your assigned counselor and keep your next steps in view.</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Your action plan</Text>
        {loading ? <Text style={styles.muted}>Loading your recommendations...</Text> : data.recommendations.length === 0 ? (
          <View style={styles.empty}><Text style={styles.muted}>No recommendations yet. Your counselor can add tailored next steps here.</Text></View>
        ) : data.recommendations.map((item) => (
          <View style={styles.task} key={item._id}>
            <View style={styles.taskIcon}><Ionicons name={item.category === "interview" ? "mic-outline" : item.category === "skill" ? "construct-outline" : "document-text-outline"} size={19} color="#A8CAFF" /></View>
            <View style={styles.taskCopy}><Text style={styles.taskTitle}>{item.title}</Text>{item.details ? <Text style={styles.muted}>{item.details}</Text> : null}<Text style={styles.taskMeta}>{item.category} · {item.status}</Text></View>
            {item.status === "open" ? <TouchableOpacity accessibilityLabel="Mark task complete" onPress={() => completeTask(item._id)} style={styles.completeButton}><Ionicons name="checkmark" size={19} color="#A7E4C7" /></TouchableOpacity> : <Ionicons name="checkmark-circle" size={22} color="#7AD6B0" />}
          </View>
        ))}

        <Text style={[styles.sectionTitle, styles.sectionGap]}>Request a counseling session</Text>
        {data.counselors.length ? (
          <View style={styles.panel}>
            <Text style={styles.label}>Assigned counselor</Text>
            {data.counselors.map((counselor) => (
              <TouchableOpacity key={counselor._id} onPress={() => setSelectedCounselor(counselor._id)} style={[styles.counselorOption, selectedCounselor === counselor._id && styles.counselorSelected]}>
                <View style={styles.personIcon}><Ionicons name="person-outline" size={17} color="#DCE7FD" /></View>
                <View style={styles.counselorCopy}><Text style={styles.counselorName}>{counselor.fullName}</Text><Text style={styles.muted}>{counselor.email}</Text></View>
                {selectedCounselor === counselor._id && <Ionicons name="checkmark-circle" size={20} color="#72A9FF" />}
              </TouchableOpacity>
            ))}
            <Text style={[styles.label, styles.dateLabel]}>Choose a date and time</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity style={styles.dateButton} onPress={() => setPickerMode("date")}><Ionicons name="calendar-outline" size={18} color="#A9C9FF" /><Text style={styles.dateButtonText}>{startsAt.toLocaleDateString()}</Text></TouchableOpacity>
              <TouchableOpacity style={styles.dateButton} onPress={() => setPickerMode("time")}><Ionicons name="time-outline" size={18} color="#A9C9FF" /><Text style={styles.dateButtonText}>{startsAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</Text></TouchableOpacity>
            </View>
            {pickerMode && <DateTimePicker value={startsAt} mode={pickerMode} minimumDate={pickerMode === "date" ? new Date() : undefined} onChange={(event, selectedDate) => { setPickerMode(null); if (selectedDate) setStartsAt(selectedDate); }} />}
            <Text style={[styles.label, styles.dateLabel]}>What would you like to discuss?</Text>
            <TextInput style={styles.input} placeholder="Resume feedback, interview practice..." placeholderTextColor="#777B89" value={purpose} onChangeText={setPurpose} maxLength={1000} multiline />
            <TouchableOpacity disabled={saving} onPress={submitAppointment} style={[styles.submitButton, saving && styles.disabled]}><Text style={styles.submitText}>{saving ? "Sending request..." : "Request session"}</Text><Ionicons name="arrow-forward" size={18} color="#FFFFFF" /></TouchableOpacity>
          </View>
        ) : (
          <View style={styles.empty}><Text style={styles.emptyTitle}>No counselor assigned yet</Text><Text style={styles.muted}>Your administrator will connect you with a career counselor. You can request a session once one is assigned.</Text></View>
        )}

        <Text style={[styles.sectionTitle, styles.sectionGap]}>Session history</Text>
        {!data.appointments.length ? <View style={styles.empty}><Text style={styles.muted}>Your counseling requests and scheduled sessions will appear here.</Text></View> : data.appointments.map((item) => (
          <View style={styles.session} key={item._id}><View style={styles.sessionIcon}><Ionicons name="calendar-outline" size={19} color="#A9C9FF" /></View><View style={styles.sessionCopy}><Text style={styles.sessionDate}>{formatDate(item.startsAt)}</Text><Text style={styles.muted}>{item.counselorId?.fullName || "Career counselor"}{item.purpose ? ` · ${item.purpose}` : ""}</Text></View><Text style={[styles.status, item.status === "confirmed" && styles.confirmed]}>{item.status}</Text></View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#15151B" },
  content: { paddingHorizontal: 22, paddingTop: 35, paddingBottom: 48 },
  header: { flexDirection: "row", alignItems: "center", gap: 13, marginBottom: 23 },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: "#25252F" },
  kicker: { color: "#777B89", fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  title: { color: "#F8FAFC", fontSize: 25, fontWeight: "800", marginTop: 3 },
  intro: { flexDirection: "row", alignItems: "flex-start", gap: 13, padding: 16, borderRadius: 12, backgroundColor: "#202630", borderWidth: 1, borderColor: "#344153" },
  introCopy: { flex: 1 },
  introTitle: { color: "#F8FAFC", fontSize: 14, fontWeight: "700", marginBottom: 5 },
  muted: { color: "#9699A5", fontSize: 12, lineHeight: 18 },
  sectionTitle: { color: "#F8FAFC", fontSize: 17, fontWeight: "700", marginTop: 25, marginBottom: 11 },
  sectionGap: { marginTop: 30 },
  empty: { padding: 16, borderRadius: 10, backgroundColor: "#20212A", borderWidth: 1, borderColor: "#30313B" },
  emptyTitle: { color: "#F8FAFC", fontSize: 13, fontWeight: "700", marginBottom: 5 },
  task: { flexDirection: "row", alignItems: "center", gap: 11, padding: 13, marginBottom: 8, backgroundColor: "#25252F", borderWidth: 1, borderColor: "#333440", borderRadius: 11 },
  taskIcon: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "#1C2635" },
  taskCopy: { flex: 1 },
  taskTitle: { color: "#F8FAFC", fontSize: 13, fontWeight: "650", marginBottom: 4 },
  taskMeta: { color: "#83B4FF", fontSize: 10, textTransform: "capitalize", marginTop: 5 },
  completeButton: { width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 17, backgroundColor: "#23382F" },
  panel: { padding: 15, borderRadius: 12, backgroundColor: "#20212A", borderWidth: 1, borderColor: "#333440" },
  label: { color: "#D4D6DE", fontSize: 12, fontWeight: "650", marginBottom: 8 },
  counselorOption: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 9, borderWidth: 1, borderColor: "#393A45", marginBottom: 8 },
  counselorSelected: { borderColor: "#5288D9", backgroundColor: "#252D3A" },
  personIcon: { width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: 17, backgroundColor: "#30313C" },
  counselorCopy: { flex: 1 },
  counselorName: { color: "#F8FAFC", fontSize: 12, fontWeight: "650", marginBottom: 3 },
  dateLabel: { marginTop: 13 },
  dateRow: { flexDirection: "row", gap: 9 },
  dateButton: { flex: 1, minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 8, borderWidth: 1, borderColor: "#41434E", backgroundColor: "#191A21" },
  dateButtonText: { color: "#F0F1F5", fontSize: 12 },
  input: { minHeight: 76, padding: 11, borderRadius: 8, borderWidth: 1, borderColor: "#41434E", color: "#F8FAFC", backgroundColor: "#191A21", textAlignVertical: "top", fontSize: 12 },
  submitButton: { minHeight: 46, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, marginTop: 13, borderRadius: 8, backgroundColor: "#2563EB" },
  submitText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  disabled: { opacity: 0.65 },
  session: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, marginBottom: 8, borderRadius: 10, backgroundColor: "#25252F" },
  sessionIcon: { width: 37, height: 37, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "#202B3A" },
  sessionCopy: { flex: 1 },
  sessionDate: { color: "#F8FAFC", fontSize: 12, fontWeight: "650", marginBottom: 4 },
  status: { color: "#EAC17E", fontSize: 10, textTransform: "capitalize" },
  confirmed: { color: "#8EDBB5" },
});

export default Counseling;