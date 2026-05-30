import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function runCoralCommand<T>(query: string): Promise<T> {
  const distro = process.env.WSL_DISTRO || "Ubuntu";
  const user = process.env.WSL_USER || "shazil_parwez";
  const coralBin = process.env.CORAL_BIN || `/home/${user}/.local/bin/coral`;
  const isDebug = process.env.CORAL_DEBUG === "true";

  // Note: we wrap the query in double quotes for the command line.
  // Make sure the query itself doesn't break out of the quotes.
  // Replacing internal double quotes with single quotes if any.
  const safeQuery = query.replace(/"/g, "'");

  const command = `wsl -d ${distro} -u ${user} -- ${coralBin} sql --format json "${safeQuery}"`;

  if (isDebug) {
    console.log("=== Coral Execution Diagnostics ===");
    const diagnosticsCmd = `wsl -d ${distro} -u ${user} -- bash -c 'whoami; echo "$HOME"; echo "$PATH"; which coral || echo not_found; pwd; ls -la "$(dirname ${coralBin})" || true'`;
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
    if (isDebug) {
      console.error("Failed to execute Coral command:", command);
      console.error("Error specifics:", error);
    }
    const errStr = String(error);
    if (!isDebug && !(errStr.includes("ENOENT") || errStr.includes("not found") || errStr.includes("not recognized"))) {
      console.error("Failed to execute Coral command:", command);
      console.error(error);
    }
    throw new Error(`Coral command execution failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
