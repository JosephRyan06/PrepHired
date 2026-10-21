import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import {
  addCounselorNote,
  addCounselorRecommendation,
  getCounselorAppointments,
  getCounselorDashboard,
  getCounselorStudentReport,
  updateCounselorAppointment,
  updateCounselorRecommendation,
} from "../api/counselor";

const formatDate = (value) => value
  ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
  : "Not recorded";

const formatDateTime = (value) => value
  ? new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
  : "Time not set";

const CounselorHome = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState({ students: [], needsAttention: 0, averageReadiness: 0 });
  const [appointments, setAppointments] = useState([]);
  const [report, setReport] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [note, setNote] = useState("");
  const [task, setTask] = useState({ title: "", details: "", category: "resume" });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadDashboard = async () => {
    try {
      const [dashboardResult, appointmentResult, savedUser] = await Promise.all([
        getCounselorDashboard(),
        getCounselorAppointments(),
        AsyncStorage.getItem("user"),
      ]);
      setDashboard(dashboardResult);
      setAppointments(appointmentResult.appointments || []);
      setUser(savedUser ? JSON.parse(savedUser) : null);
    } catch (error) {
      Alert.alert("Counselor workspace", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    if (selectedId) await openStudent(selectedId);
    setRefreshing(false);
  };

  const openStudent = async (studentId) => {
    setSelectedId(studentId);
    try {
      setReport(await getCounselorStudentReport(studentId));
    } catch (error) {
      Alert.alert("Student report", error.message);
    }
  };

  const saveNote = async () => {
    if (!note.trim() || !selectedId) return;
    setSaving(true);
    try {
      await addCounselorNote(selectedId, note.trim());
      setNote("");
      await openStudent(selectedId);
    } catch (error) {
      Alert.alert("Private note", error.message);
    } finally {
      setSaving(false);
    }
  };

  const saveTask = async () => {
    if (!task.title.trim() || !selectedId) return;
    setSaving(true);
    try {
      await addCounselorRecommendation(selectedId, task);
      setTask({ title: "", details: "", category: "resume" });
      await openStudent(selectedId);
    } catch (error) {
      Alert.alert("Progress task", error.message);
    } finally {
      setSaving(false);
    }
  };

  const changeAppointment = async (appointmentId, status) => {
    try {
      await updateCounselorAppointment(appointmentId, status);
      await loadDashboard();
    } catch (error) {
      Alert.alert("Appointment", error.message);
    }
  };

  const changeTask = async (recommendationId, status) => {
    try {
      await updateCounselorRecommendation(recommendationId, status);
      await openStudent(selectedId);
    } catch (error) {
      Alert.alert("Action plan", error.message);
    }
  };

  const signOut = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    navigation.replace("Login");
  };

  const latestResume = report?.resumes?.[0];
  const latestInterview = report?.interviews?.[0];

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#F8FAFC" colors={["#F8FAFC"]} progressBackgroundColor="#25252F" />}
      >
        <View style={styles.header}>
          <View style={styles.headerCopy}><Text style={styles.kicker}>CAREER GUIDANCE COUNSELOR</Text><Text style={styles.title}>Your students, in focus.</Text><Text style={styles.subtitle}>Welcome, {user?.firstName || "Counselor"}</Text></View>
          <TouchableOpacity accessibilityLabel="Sign out" onPress={signOut} style={styles.signOut}><Ionicons name="log-out-outline" size={21} color="#D3D6E0" /></TouchableOpacity>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metric}><Text style={styles.metricLabel}>STUDENTS</Text><Text style={styles.metricValue}>{dashboard.students.length}</Text><Text style={styles.metricNote}>Assigned to you</Text></View>
          <View style={[styles.metric, styles.metricBlue]}><Text style={styles.metricLabel}>AVG. READINESS</Text><Text style={styles.metricValue}>{dashboard.averageReadiness}<Text style={styles.percent}>%</Text></Text><Text style={styles.metricNote}>Current caseload</Text></View>
          <View style={styles.metric}><Text style={styles.metricLabel}>NEEDS FOCUS</Text><Text style={styles.metricValue}>{dashboard.needsAttention}</Text><Text style={styles.metricNote}>Below 50% readiness</Text></View>
        </View>

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Student progress</Text><Text style={styles.sectionMeta}>{dashboard.students.length} ASSIGNED</Text></View>
        {loading ? <Text style={styles.muted}>Loading student progress...</Text> : dashboard.students.length === 0 ? (
          <View style={styles.empty}><Ionicons name="people-outline" size={23} color="#7F9AB9" /><Text style={styles.emptyTitle}>No assigned students yet</Text><Text style={styles.muted}>Ask an administrator to assign students to your counselor account.</Text></View>
        ) : dashboard.students.map((student) => (
          <TouchableOpacity key={student._id} onPress={() => openStudent(student._id)} style={[styles.studentRow, selectedId === student._id && styles.studentSelected]}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{student.firstName?.slice(0, 1)}{student.lastName?.slice(0, 1)}</Text></View>
            <View style={styles.studentInfo}><Text style={styles.studentName}>{student.fullName}</Text><Text style={styles.muted}>{student.progress.readinessLabel} · {student.progress.resume.completed + student.progress.interviews.completed} activities</Text><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${student.progress.employmentReadiness}%` }]} /></View></View>
            <Text style={styles.studentScore}>{student.progress.employmentReadiness}<Text style={styles.percent}>%</Text></Text>
          </TouchableOpacity>
        ))}

        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Upcoming sessions</Text><Text style={styles.sectionMeta}>{appointments.length} TOTAL</Text></View>
        {appointments.length === 0 ? <View style={styles.empty}><Text style={styles.muted}>Student session requests will appear here.</Text></View> : appointments.map((appointment) => (
          <View key={appointment._id} style={styles.appointment}>
            <View style={styles.calendarIcon}><Ionicons name="calendar-outline" size={19} color="#A9C9FF" /></View>
            <View style={styles.appointmentInfo}><Text style={styles.studentName}>{appointment.studentId?.fullName || "Student"}</Text><Text style={styles.appointmentDate}>{formatDateTime(appointment.startsAt)}</Text><Text style={styles.muted}>{appointment.purpose || "Career guidance session"}</Text></View>
            <View style={styles.appointmentActions}>
              <Text style={[styles.status, appointment.status === "confirmed" && styles.statusConfirmed]}>{appointment.status}</Text>
              {appointment.status === "requested" && <TouchableOpacity onPress={() => changeAppointment(appointment._id, "confirmed")}><Text style={styles.actionText}>Confirm</Text></TouchableOpacity>}
              {appointment.status === "confirmed" && <TouchableOpacity onPress={() => changeAppointment(appointment._id, "completed")}><Text style={styles.actionText}>Complete</Text></TouchableOpacity>}
            </View>
          </View>
        ))}

        {selectedId && report && (
          <View style={styles.report}>
            <View style={styles.reportHeading}><View style={styles.reportHeadingCopy}><Text style={styles.kicker}>JOB READINESS REPORT</Text><Text style={styles.reportTitle}>{report.student.fullName}</Text><Text style={styles.muted}>{report.careerProfile?.targetJob?.jobTitle || "Career target not selected"}</Text></View><TouchableOpacity accessibilityLabel="Close student report" onPress={() => { setSelectedId(""); setReport(null); }}><Ionicons name="close" size={22} color="#A1A1AA" /></TouchableOpacity></View>

            <View style={styles.scoreGrid}>
              <View style={styles.scoreCell}><Text style={styles.metricLabel}>READINESS</Text><Text style={styles.scoreValue}>{report.progress.employmentReadiness}%</Text><Text style={styles.muted}>{report.progress.readinessLabel}</Text></View>
              <View style={styles.scoreCell}><Text style={styles.metricLabel}>RESUME</Text><Text style={styles.scoreValue}>{latestResume?.atsScore || 0}%</Text><Text style={styles.muted}>{latestResume ? formatDate(latestResume.createdAt) : "No completed resume"}</Text></View>
              <View style={styles.scoreCell}><Text style={styles.metricLabel}>INTERVIEW</Text><Text style={styles.scoreValue}>{report.progress.interviews.averageScore}%</Text><Text style={styles.muted}>{report.progress.interviews.completed} sessions</Text></View>
              <View style={styles.scoreCell}><Text style={styles.metricLabel}>CAREER TARGET</Text><Text style={styles.targetValue}>{report.careerProfile?.targetJob?.jobTitle || "Not set"}</Text><Text style={styles.muted}>{report.careerProfile?.targetJob?.industry || "Industry not set"}</Text></View>
            </View>

            <Text style={styles.subsectionTitle}>Preparation history</Text>
            {[...report.resumes.map((item) => ({ ...item, kind: "Resume", score: item.atsScore })), ...report.interviews.map((item) => ({ ...item, kind: "Mock interview", score: item.overallScore, createdAt: item.completedAt }))]
              .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
              .map((item) => <View key={`${item.kind}-${item._id}`} style={styles.historyRow}><Ionicons name={item.kind === "Resume" ? "document-text-outline" : "mic-outline"} size={17} color="#9FC4FF" /><Text style={styles.historyName}>{item.kind} · {formatDate(item.createdAt)}</Text><Text style={styles.historyScore}>{item.score || 0}%</Text></View>)}

            {latestInterview?.skillBreakdown && <><Text style={styles.subsectionTitle}>Interview skill review</Text>{Object.entries(latestInterview.skillBreakdown).map(([skill, value]) => <View key={skill} style={styles.skillRow}><Text style={styles.skillName}>{skill.replace(/([A-Z])/g, " $1")}</Text><View style={styles.skillTrack}><View style={[styles.progressFill, { width: `${value}%` }]} /></View><Text style={styles.skillValue}>{value}%</Text></View>)}</>}

            <Text style={styles.subsectionTitle}>Skills to build</Text>
            {report.careerProfile?.skillGaps?.length ? <View style={styles.skillGaps}>{report.careerProfile.skillGaps.map((item) => <Text key={item} style={styles.skillGap}>{item}</Text>)}</View> : <Text style={styles.muted}>No skill gaps are available from the latest resume analysis.</Text>}

            <Text style={styles.subsectionTitle}>Private counseling notes</Text>
            <TextInput style={styles.textArea} value={note} onChangeText={setNote} placeholder="Record observations or an action plan..." placeholderTextColor="#777B89" multiline maxLength={5000} />
            <TouchableOpacity disabled={saving || !note.trim()} onPress={saveNote} style={[styles.primaryButton, (saving || !note.trim()) && styles.disabled]}><Text style={styles.primaryButtonText}>Save private note</Text></TouchableOpacity>
            {report.notes.map((item) => <View key={item._id} style={styles.noteCard}><Text style={styles.noteText}>{item.content}</Text><Text style={styles.noteDate}>{formatDate(item.createdAt)}</Text></View>)}

            <Text style={styles.subsectionTitle}>Progress recommendations</Text>
            <TextInput style={styles.textInput} value={task.title} onChangeText={(title) => setTask({ ...task, title })} placeholder="Task title" placeholderTextColor="#777B89" maxLength={160} />
            <TextInput style={[styles.textArea, styles.taskDetails]} value={task.details} onChangeText={(details) => setTask({ ...task, details })} placeholder="Details for the student" placeholderTextColor="#777B89" multiline maxLength={2000} />
            <View style={styles.categoryRow}>{[["resume", "Resume"], ["skill", "Skill"], ["interview", "Interview"], ["career", "Career"]].map(([value, label]) => <TouchableOpacity key={value} onPress={() => setTask({ ...task, category: value })} style={[styles.categoryOption, task.category === value && styles.categorySelected]}><Text style={[styles.categoryText, task.category === value && styles.categoryTextSelected]}>{label}</Text></TouchableOpacity>)}</View>
            <TouchableOpacity disabled={saving || !task.title.trim()} onPress={saveTask} style={[styles.primaryButton, (saving || !task.title.trim()) && styles.disabled]}><Text style={styles.primaryButtonText}>Add to action plan</Text></TouchableOpacity>
            {report.recommendations.map((item) => <TouchableOpacity key={item._id} onPress={() => changeTask(item._id, item.status === "open" ? "completed" : "open")} style={styles.recommendation}><Ionicons name={item.status === "completed" ? "checkmark-circle" : "ellipse-outline"} size={20} color={item.status === "completed" ? "#7AD6B0" : "#A9C9FF"} /><View style={styles.recommendationCopy}><Text style={styles.studentName}>{item.title}</Text><Text style={styles.muted}>{item.category} · {item.status}{item.details ? ` · ${item.details}` : ""}</Text></View></TouchableOpacity>)}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#15151B" },
  content: { paddingHorizontal: 20, paddingTop: 34, paddingBottom: 45 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20 },
  headerCopy: { flex: 1 },
  kicker: { color: "#7C8291", fontSize: 9, fontWeight: "700", letterSpacing: 1 },
  title: { marginTop: 6, color: "#F8FAFC", fontSize: 22, fontWeight: "800" },
  subtitle: { marginTop: 5, color: "#A1A1AA", fontSize: 12 },
  signOut: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 11, backgroundColor: "#25252F" },
  metricRow: { flexDirection: "row", gap: 8 },
  metric: { flex: 1, minHeight: 94, padding: 11, borderRadius: 10, backgroundColor: "#25252F", borderWidth: 1, borderColor: "#343540" },
  metricBlue: { backgroundColor: "#202B38", borderColor: "#34465A" },
  metricLabel: { color: "#9699A5", fontSize: 8, fontWeight: "700", letterSpacing: 0.4 },
  metricValue: { marginTop: 9, color: "#F8FAFC", fontSize: 22, fontWeight: "800" },
  percent: { color: "#A9C9FF", fontSize: 12, fontWeight: "600" },
  metricNote: { marginTop: 3, color: "#898D9A", fontSize: 9 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 26, marginBottom: 11 },
  sectionTitle: { color: "#F8FAFC", fontSize: 17, fontWeight: "750" },
  sectionMeta: { color: "#838794", fontSize: 9, letterSpacing: 0.6 },
  studentRow: { minHeight: 73, flexDirection: "row", alignItems: "center", gap: 10, padding: 11, marginBottom: 8, borderRadius: 10, borderWidth: 1, borderColor: "#353641", backgroundColor: "#22232C" },
  studentSelected: { borderColor: "#5288D9", backgroundColor: "#242D39" },
  avatar: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 19, backgroundColor: "#353747" },
  avatarText: { color: "#DCE7FD", fontSize: 11, fontWeight: "700" },
  studentInfo: { flex: 1 },
  studentName: { color: "#F8FAFC", fontSize: 12, fontWeight: "700" },
  muted: { marginTop: 4, color: "#9699A5", fontSize: 10, lineHeight: 15 },
  progressTrack: { height: 4, overflow: "hidden", marginTop: 8, borderRadius: 4, backgroundColor: "#41424D" },
  progressFill: { height: "100%", borderRadius: 4, backgroundColor: "#58A6E8" },
  studentScore: { color: "#F8FAFC", fontSize: 14, fontWeight: "750" },
  empty: { alignItems: "center", padding: 20, borderRadius: 10, backgroundColor: "#22232C", borderWidth: 1, borderColor: "#343540" },
  emptyTitle: { marginTop: 8, color: "#F8FAFC", fontSize: 13, fontWeight: "700" },
  appointment: { flexDirection: "row", alignItems: "center", gap: 10, padding: 11, marginBottom: 8, borderRadius: 10, backgroundColor: "#22232C", borderWidth: 1, borderColor: "#343540" },
  calendarIcon: { width: 37, height: 37, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "#202B3A" },
  appointmentInfo: { flex: 1 },
  appointmentDate: { marginTop: 4, color: "#A9C9FF", fontSize: 10 },
  appointmentActions: { alignItems: "flex-end", gap: 6 },
  status: { color: "#EAC17E", fontSize: 9, textTransform: "capitalize" },
  statusConfirmed: { color: "#8EDBB5" },
  actionText: { color: "#94BFFF", fontSize: 10, fontWeight: "650" },
  report: { marginTop: 12, padding: 14, borderRadius: 12, backgroundColor: "#20212A", borderWidth: 1, borderColor: "#353641" },
  reportHeading: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 15 },
  reportHeadingCopy: { flex: 1 },
  reportTitle: { marginTop: 5, color: "#F8FAFC", fontSize: 19, fontWeight: "750" },
  scoreGrid: { flexDirection: "row", flexWrap: "wrap", borderTopWidth: 1, borderLeftWidth: 1, borderColor: "#383943" },
  scoreCell: { width: "50%", minHeight: 78, justifyContent: "center", padding: 10, borderRightWidth: 1, borderBottomWidth: 1, borderColor: "#383943" },
  scoreValue: { marginTop: 6, color: "#A9C9FF", fontSize: 18, fontWeight: "800" },
  targetValue: { marginTop: 6, color: "#F8FAFC", fontSize: 12, fontWeight: "700" },
  subsectionTitle: { marginTop: 20, marginBottom: 9, color: "#F8FAFC", fontSize: 13, fontWeight: "700" },
  historyRow: { minHeight: 37, flexDirection: "row", alignItems: "center", gap: 8, borderBottomWidth: 1, borderBottomColor: "#353641" },
  historyName: { flex: 1, color: "#D8DAE2", fontSize: 10 },
  historyScore: { color: "#A9C9FF", fontSize: 11, fontWeight: "700" },
  skillRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 9 },
  skillName: { width: 100, color: "#C1C3CD", fontSize: 10, textTransform: "capitalize" },
  skillTrack: { flex: 1, height: 5, overflow: "hidden", borderRadius: 5, backgroundColor: "#3D3F49" },
  skillValue: { width: 32, color: "#A9C9FF", fontSize: 9, textAlign: "right" },
  skillGaps: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  skillGap: { paddingVertical: 6, paddingHorizontal: 8, overflow: "hidden", borderRadius: 5, backgroundColor: "#383127", color: "#F1D6A7", fontSize: 10 },
  textArea: { minHeight: 75, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#41434E", backgroundColor: "#191A21", color: "#F8FAFC", fontSize: 12, textAlignVertical: "top" },
  textInput: { minHeight: 42, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: "#41434E", backgroundColor: "#191A21", color: "#F8FAFC", fontSize: 12 },
  taskDetails: { minHeight: 60, marginTop: 8 },
  primaryButton: { minHeight: 42, alignItems: "center", justifyContent: "center", marginTop: 9, borderRadius: 7, backgroundColor: "#2563EB" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  disabled: { opacity: 0.5 },
  noteCard: { padding: 10, marginTop: 8, borderLeftWidth: 2, borderLeftColor: "#9477BB", backgroundColor: "#282630" },
  noteText: { color: "#D6D3DC", fontSize: 11, lineHeight: 16 },
  noteDate: { marginTop: 6, color: "#9694A0", fontSize: 9 },
  categoryRow: { flexDirection: "row", gap: 6, marginTop: 9 },
  categoryOption: { flex: 1, minHeight: 33, alignItems: "center", justifyContent: "center", borderRadius: 5, borderWidth: 1, borderColor: "#41434E", backgroundColor: "#191A21" },
  categorySelected: { borderColor: "#5288D9", backgroundColor: "#263951" },
  categoryText: { color: "#A1A1AA", fontSize: 9 },
  categoryTextSelected: { color: "#D9E8FF", fontWeight: "700" },
  recommendation: { flexDirection: "row", alignItems: "center", gap: 9, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#383943" },
  recommendationCopy: { flex: 1 },
});

export default CounselorHome;