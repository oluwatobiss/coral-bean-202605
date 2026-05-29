import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");
const PREF_FILE = path.join(DATA_DIR, "preferences.json");

export interface UserPreferences {
  gmail_enabled: boolean;
  google_calendar_enabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  gmail_enabled: true,
  google_calendar_enabled: true,
};

export function getPreferences(): UserPreferences {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PREF_FILE)) {
      fs.writeFileSync(PREF_FILE, JSON.stringify(DEFAULT_PREFERENCES, null, 2));
      return DEFAULT_PREFERENCES;
    }
    const data = fs.readFileSync(PREF_FILE, "utf-8");
    return JSON.parse(data) as UserPreferences;
  } catch (error) {
    console.error("Failed to read preferences, returning defaults:", error);
    return DEFAULT_PREFERENCES;
  }
}

export function updatePreference(key: keyof UserPreferences, value: boolean) {
  const prefs = getPreferences();
  prefs[key] = value;
  fs.writeFileSync(PREF_FILE, JSON.stringify(prefs, null, 2));
}
