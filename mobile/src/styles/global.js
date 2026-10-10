import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15151B",
    paddingTop: 20,
    paddingStart: 25,
    paddingEnd: 25,
    marginTop: 37,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  //Home
  header: {
    paddingTop: 15,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerText: {
    flex: 1,
  },

  greeting: {
    color: "#71717A",
    fontSize: 15,
    fontWeight: "400",
    marginBottom: 2,
  },

  userName: {
    color: "#F8FAFC",
    fontSize: 22,
    fontWeight: "700",
  },

  profileButton: {
    position: "relative",
    marginLeft: 15,
  },

  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,

    backgroundColor: "#25252F",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#30303A",
  },

  employmentReadinessCard: {
    backgroundColor: "#25252F",
    borderRadius: 16,
    padding: 18,
  },

  line: {
    width: "100%",
    height: 8,
    backgroundColor: "#15151B",
    borderRadius: 10,
    overflow: "hidden",
  },

  percent: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 10,
  },

  quickActionsCard: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },

  cardAction: {
    flex: 1,
    backgroundColor: "#25252F",
    borderRadius: 16,
    padding: 16,
    minHeight: 135,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#2F2F3A",
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#15151B",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#2563EB",
    borderWidth: 2,
  },

  primaryIcon: {
    backgroundColor: "#2563EB",
  },

  cardActionText: {
    color: "#F8FAFC",
    fontWeight: "600",
    fontSize: 14,
    marginTop: 12,
  },

  cardActionSubtext: {
    color: "#71717A",
    fontSize: 11,
    marginTop: 3,
  },

  //Resume
  uploadResumeCard: {
    backgroundColor: "#25252F",
    alignItems: "center",
    paddingVertical: 50,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowColor: "#2563EB",
  },
  uploadIconContainer: {
    paddingVertical: 30,
    paddingHorizontal: 35,
    backgroundColor: "#2563EB",
    borderRadius: 16,
  },

  myResumeCardContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 15,
    rowGap: 15,
  },

  resumeCard: {
    height: 200,
    marBottom: 16,
    overflow: "hidden",
    backgroundColor: "#25252F",
    borderRadius: 16,
  },

  //Resume TargetJobPositon
  industryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },

  industryChip: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    backgroundColor: "#25252F",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3F3F46",
  },

  industryChipSelected: {
    backgroundColor: "#25252F",
    borderColor: "#6366F1",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 20,
  },

  industryText: {
    color: "#A1A1AA",
    fontSize: 13,
    fontWeight: "500",
  },

  industryTextSelected: {
    color: "#F8FAFC",
    fontWeight: "600",
    fontSize: 13,
  },

  //Resume EducationExperience
  workExpContainer: {
    backgroundColor: "#25252F",
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
  },

  //Resume SummaryExtras

  projectContainer: {
    backgroundColor: "#25252F",
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
  },

  //Interview
  interviewCategoryContainer: {
    flexDirection: "row",
    flex: 1,
    gap: 5,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  interviewCategoryChip: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#25252F",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3F3F46",
  },

  interviewCategorySelected: {
    backgroundColor: "#25252F",
    borderColor: "#6366F1",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 20,
  },

  interviewCategoryText: {
    color: "#A1A1AA",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },

  interviewCategoryTextSelected: {
    color: "#F8FAFC",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },

  responseModeChip: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 50,
    backgroundColor: "#25252F",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#3F3F46",
  },
  responseModeSelected: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 50,
    backgroundColor: "#25252F",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#6366F1",
  },

  numberOfQuestionChip: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: "#25252F",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3F3F46",
  },

  numberOfQuestionsSelected: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: "#25252F",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6366F1",
  },

  //Progress
  //Profile
  profileContainer: {
    flex: 1,
    backgroundColor: "#15151B",
    marginTop: 37,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  profileHeader: {
    backgroundColor: "#25252F",
    minHeight: 250,

    borderBottomLeftRadius: 65,
    borderBottomRightRadius: 65,

    paddingHorizontal: 25,
    paddingBottom: 25,

    alignItems: "center",
    justifyContent: "center",
  },

  profileImageContainer: {
    width: 130,
    height: 130,

    backgroundColor: "#2563EB",
    borderRadius: 65,

    alignItems: "center",
    justifyContent: "center",

    elevation: 5,
  },

  profileInfo: {
    alignItems: "center",
    marginTop: 10,
  },

  textName: {
    fontSize: 25,
    fontWeight: "700",
    color: "#F8FAFC",
  },

  textUsername: {
    color: "#71717A",
    fontSize: 15,
    marginTop: 5,
  },

  card: {
    backgroundColor: "#25252F",

    marginTop: 20,
    marginHorizontal: 25,

    borderRadius: 20,

    padding: 10,

    elevation: 5,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",

    marginTop: 8,
    marginBottom: 8,
    marginHorizontal: 10,

    color: "#71717A",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",

    minHeight: 58,

    paddingHorizontal: 10,
    paddingVertical: 12,

    borderBottomWidth: 1,
    borderBottomColor: "#71717A",
  },

  menuText: {
    flex: 1,

    marginLeft: 15,

    fontSize: 14,
    fontWeight: "600",

    color: "#F8FAFC",
  },

  //Other

  button: {
    width: "100%",
    height: 40,

    backgroundColor: "#2563EB",

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 5,

    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  textError: {
    color: "#B91C1C",
    marginTop: 0,
    fontSize: 12,
    fontWeight: "600",
  },

  //Skeloton loading for resume

  skeletonHeader: {
    marginTop: 10,
    marginBottom: 10,
    height: 50,
    backgroundColor: "#15151B",
    marginBottom: 20,
    marginHorizontal: 15,
    borderRadius: 4,
  },

  skeletonLineLarge: {
    height: 14,
    width: "70%",
    backgroundColor: "#15151B",
    borderRadius: 4,
    marginHorizontal: 15,
    marginBottom: 12,
  },

  skeletonLine: {
    height: 9,
    width: "85%",
    backgroundColor: "#15151B",
    borderRadius: 4,
    marginHorizontal: 15,
    marginBottom: 8,
  },

  skeletonBody: {
    marginTop: 15,
  },

  //Password requirements

  passwordRequirements: {
    marginTop: 8,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#1E1E26",
    borderRadius: 10,
  },

  requirementsTitle: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },

  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },

  requirementText: {
    color: "#A1A1AA",
    fontSize: 12,
  },

  requirementMet: {
    color: "#60A5FA",
  },
});
