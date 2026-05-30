# Project Handoff: NeverLate (Coral-Native Edition)

This document summarizes the recent debugging and setup steps we took to handle Coral CLI integration within the project.

## 1. Issue Addressed: Noisy Console Errors

### The Problem
When running the local development server (`npm run dev`), the terminal was flooded with `console.error` logs and stack traces. This occurred because the Node backend was attempting to execute `coral sql` commands via `child_process.exec`, but the `coral` CLI tool was not installed or not in the system's `PATH`.

### The Fix
We modified the error handling inside two files:
- `apps/server/src/utils/runCoralCommand.ts`
- `apps/server/src/services/coralService.ts`

**Changes Made:**
We updated the `catch` blocks to detect if the error was caused by the missing executable (checking for `"ENOENT"`, `"not found"`, or `"not recognized"`). If this specific condition is met, the backend now suppresses the verbose `console.error` logging.

**Result:**
The application now gracefully falls back to using mocked demo data (`FALLBACK_EMAILS` and `FALLBACK_EVENTS`) for hackathon UI testing without cluttering the developer's terminal with missing command errors.

## 2. Coral CLI Installation & Setup

We also walked through the steps needed for a team member to install the Coral CLI if they want to query real data sources instead of using the mocked fallbacks.

### Installation Options
- **Windows (Native):** Download the latest release from the [Coral GitHub Releases](https://github.com/withcoral/coral/releases), extract the `.zip` file, and place `coral.exe` in a directory of your choice.
- **Linux/WSL:** Run `curl -fsSL https://withcoral.com/install.sh | sh`
- **macOS:** Run `brew install withcoral/tap/coral`

### Adding to PATH (Windows)
If another team member needs to add the `coral.exe` folder to their Windows PATH, here are the steps:
1. Search for **"Environment Variables"** in the Windows Start Menu and select **"Edit the system environment variables"**.
2. Click the **"Environment Variables..."** button.
3. Under the **User variables** section, select **`Path`** and click **"Edit..."**.
4. Click **"New"** and paste the folder path containing the extracted `coral.exe` file.
5. Click **"OK"** to save.
6. **Important:** Restart any open terminals so they can pick up the updated PATH.

### Verification
You can verify the setup by running:
```bash
coral --version
```
Once this returns successfully, the application's backend will execute actual Coral queries against your connected sources rather than using the fallback demo data.
