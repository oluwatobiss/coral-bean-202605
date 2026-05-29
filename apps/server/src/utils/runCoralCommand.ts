import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function runCoralCommand<T>(query: string): Promise<T> {
  // const distro = process.env.WSL_DISTRO || "Ubuntu";

  // Note: we wrap the query in double quotes for the command line.
  // Make sure the query itself doesn't break out of the quotes.
  // Replacing internal double quotes with single quotes if any.
  const safeQuery = query.replace(/"/g, "'");

  const command = `coral sql --format json "${safeQuery}"`;

  try {
    const { stdout, stderr } = await execAsync(command);

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
    console.error("Failed to execute Coral command:", command);
    console.error(error);
    throw new Error(`Coral command execution failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
