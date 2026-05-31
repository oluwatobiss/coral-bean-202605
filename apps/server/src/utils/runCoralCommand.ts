import { exec } from "child_process";
import { promisify } from "util";
import os from "os";

const execAsync = promisify(exec);

export async function runCoralCommand<T>(query: string): Promise<T> {
  // If MOCK_MODE is true, immediately throw an error to force fallback to mock data
  if (process.env.MOCK_MODE === "true") {
    throw new Error("MOCK_MODE enabled - bypassing Coral execution.");
  }

  const isWindows = process.platform === "win32";
  const distro = process.env.WSL_DISTRO || "Ubuntu";
  const user = process.env.WSL_USER || "alex";

  const defaultCoralBin = isWindows
    ? `/home/${user}/.local/bin/coral`
    : `${os.homedir()}/.local/bin/coral`;

  const coralBin = process.env.CORAL_BIN || defaultCoralBin;
  const isDebug = process.env.CORAL_DEBUG === "true";

  // Note: we wrap the query in double quotes for the command line.
  // Make sure the query itself doesn't break out of the quotes.
  // Replacing internal double quotes with single quotes if any.
  const safeQuery = query.replace(/"/g, "'");

  let command: string;
  if (isWindows) {
    command = `wsl -d ${distro} -u ${user} -- ${coralBin} sql --format json "${safeQuery}"`;
  } else {
    command = `${coralBin} sql --format json "${safeQuery}"`;
  }

  if (isDebug) {
    console.log("=== Coral Execution Diagnostics ===");
    let diagnosticsCmd: string;
    if (isWindows) {
      diagnosticsCmd = `wsl -d ${distro} -u ${user} -- bash -c 'whoami; echo "$HOME"; echo "$PATH"; which coral || echo not_found; pwd; ls -la "$(dirname ${coralBin})" || true'`;
    } else {
      diagnosticsCmd = `whoami; echo "$HOME"; echo "$PATH"; which coral || echo not_found; pwd; ls -la "$(dirname ${coralBin})" || true`;
    }
    try {
      const diag = await execAsync(diagnosticsCmd);
      console.log("Diagnostics STDOUT:\n", diag.stdout);
      if (diag.stderr) console.error("Diagnostics STDERR:\n", diag.stderr);
    } catch (err) {
      console.error("Failed to run diagnostics:", err);
    }
    console.log("Executing Coral Command:", command);
  }

  try {
    const { stdout, stderr } = await execAsync(command);

    if (isDebug) {
      console.log("Coral Command STDOUT (first 500 chars):", stdout.substring(0, 500));
      console.log("Coral Command STDERR:", stderr);
    }

    let parsedData = null;
    if (stdout && stdout.trim() !== "") {
      try {
        parsedData = JSON.parse(stdout.trim());
      } catch (e) {
        // ignore JSON parse error here, we will throw below if stderr has error
      }
    }

    if (!parsedData && stderr && stderr.trim().length > 0) {
      console.warn("Coral CLI Warning/Error Output:", stderr);
      if (stderr.toLowerCase().includes("panicked") || stderr.toLowerCase().includes("error")) {
        throw new Error(`Coral CLI Error/Panic: ${stderr.trim()}`);
      }
    }

    if (!stdout || stdout.trim() === "") {
      throw new Error("Coral CLI returned empty output");
    }

    const data = JSON.parse(stdout.trim());
    return data as T;
  } catch (error) {
    const rawErrStr = error instanceof Error ? error.message : String(error);
    const cleanedErrStr = cleanErrorMessage(rawErrStr);

    if (isDebug) {
      console.error("Failed to execute Coral command:", command);
      console.error("Error specifics:", cleanedErrStr);
    }
    const isMissingCli = cleanedErrStr.includes("ENOENT") || cleanedErrStr.includes("not found") || cleanedErrStr.includes("not recognized");
    if (!isDebug && !isMissingCli) {
      console.error(`Failed to execute Coral command: ${cleanedErrStr}`);
    }
    throw new Error(cleanedErrStr);
  }
}

function cleanErrorMessage(msg: string): string {
  // Regex to match the tokio-rt-worker panic trace block
  const tokioPanicRegex = /thread 'tokio-rt-worker'[\s\S]*?backtrace\n?/gi;
  let cleaned = msg.replace(tokioPanicRegex, "");
  // Clean up duplicate/excessive newlines
  cleaned = cleaned.replace(/\n{2,}/g, "\n");
  return cleaned.trim();
}
