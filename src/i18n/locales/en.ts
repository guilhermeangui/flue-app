export const en = {
  // Common
  appName: "Flue",
  appTagline: "Your AI Language Coach",

  // Tabs
  tabChats: "Chats",
  tabProgress: "Progress",
  tabProfile: "Profile",

  // Auth - Login
  welcomeBack: "Welcome back",
  signInContinue: "Sign in to continue your journey",
  email: "Email",
  password: "Password",
  forgotPassword: "Forgot password?",
  invalidCredentials: "Invalid email or password",
  signingIn: "Signing in...",
  signIn: "Sign In",
  or: "or",
  continueGoogle: "Continue with Google",
  continueApple: "Continue with Apple",
  noAccount: "Don't have an account?",
  signUp: "Sign up",

  // Auth - Signup
  createAccount: "Create your account",
  joinFlue: "Join Flue and start practicing today",
  fullName: "Full Name",
  fullNamePlaceholder: "Your full name",
  confirmPassword: "Confirm Password",
  confirmPasswordPlaceholder: "Confirm your password",
  createPasswordPlaceholder: "Create a password",
  passwordsDontMatch: "Passwords don't match",
  agreeTerms: "I agree to the Terms of Service and Privacy Policy",
  couldNotCreate: "Could not create account. Try a different email.",
  creating: "Creating...",
  createAccountBtn: "Create Account",
  alreadyHaveAccount: "Already have an account?",

  // Auth - Forgot Password
  forgotPasswordTitle: "Forgot password?",
  forgotPasswordDesc: "Enter your email and we'll send you a reset link",
  sendResetLink: "Send Reset Link",
  emailSent: "Email sent!",
  checkInbox: "Check your inbox for a password reset link.",
  backToSignIn: "Back to Sign In",
  rememberPassword: "Remember your password?",

  // Chats list
  noChatsYet: "No chats yet",
  noChatsDesc: "Start a new conversation to practice your language skills!",

  // New chat
  newChat: "New Chat",
  hiCoach: "Hi! I'm your Flue coach.",
  chooseLang: "Choose a language to practice today and we'll get started!",
  greatChoice: "Great choice!",
  sendToStart: "Send me a voice or text message to start practicing.",
  typeMessage: "Type a message...",
  selectLangFirst: "Select a language above to start...",
  startingSession: "Starting your {lang} session...",

  // Chat view
  aiCoach: "AI Language Coach",
  online: "Online",
  upgradePrompt: "You've used all {limit} messages for today",
  upgradeCta: "Upgrade to Pro \u2014 150 msgs/day",
  messagesRemaining: "{remaining}/{limit} messages remaining today",
  typeOrHoldMic: "Type or hold mic...",
  recording: "Recording... {time} / {max}",

  // Chat - Analysis card
  aiCoachAnalysis: "AI Coach \u00B7 Analysis",
  wordsToReview: "Words to review:",
  accuracy: "accuracy",
  issues: "issues",
  details: "Details",
  langMismatchMsg:
    "You spoke in {lang}. This chat is for practicing another language \u2014 try again in the chat language.",

  // Chat - Voice message
  audioUnavailable: "audio unavailable on this device",

  // Profile
  dayStreak: "Day Streak",
  sessions: "Sessions",
  avgScore: "Avg Score",

  // Profile - Language list
  myLanguages: "MY LANGUAGES",
  nativeTarget: "Native target",
  active: "Active",
  cancel: "Cancel",
  addLanguage: "Add Language",

  // Profile - Actions
  settingsSection: "SETTINGS",
  notifications: "Notifications",
  audioQuality: "Audio Quality",
  appLanguage: "App Language",
  accountSection: "ACCOUNT",
  signOut: "Sign Out",

  // Settings
  settings: "Settings",
  generalSection: "GENERAL",
  editProfile: "Edit Profile",
  changePassword: "Change Password",
  deleteAccount: "Delete Account",

  // Progress
  progress: "Progress",
  thisMonth: "This Month",
  dayStreakLabel: "{count} Day Streak",
  keepItUp: "Keep it up!",
  startPracticing: "Start practicing!",
  best: "Best: {count}",
  accuracyTrend: "Accuracy Trend",
  lastSessions: "Last sessions",
  noDataYet: "No data yet",
  avg: "Avg {score}%",
  errorBreakdown: "Error Breakdown",
  pronunciation: "Pronunciation",
  grammar: "Grammar",
  spelling: "Spelling",

  // Language names (for mismatch display)
  langNamePt: "Portuguese",
  langNameEn: "English",
  langNameEs: "Spanish",
  langNameFr: "French",
  langNameIt: "Italian",
  langNameDe: "German",
  langNameJa: "Japanese",
  langNameZh: "Chinese",
  langNameKo: "Korean",
  langNameRu: "Russian",

  // Audio quality values
  qualityLow: "low",
  qualityMedium: "medium",
  qualityHigh: "high",

  // Practice language names (for practice target)
  practiceLangPt: "Portuguese",
  practiceLangEn: "English",
  practiceLangEs: "Spanish",
  practiceLangFr: "French",
} as const;

export type TranslationKeys = keyof typeof en;
export type Translations = Record<TranslationKeys, string>;
