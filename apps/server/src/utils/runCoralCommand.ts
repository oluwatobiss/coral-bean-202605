import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function runCoralCommand<T>(query: string): Promise<T> {
  const distro = process.env.WSL_DISTRO || "Ubuntu";
  
  // Note: we wrap the query in double quotes for the command line.
  // Make sure the query itself doesn't break out of the quotes.
  // Replacing internal double quotes with single quotes if any.
  const safeQuery = query.replace(/"/g, "'");
  
  const command = `wsl -d ${distro} -e coral sql --format json "${safeQuery}"`;

  try {
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && stderr.trim().length > 0) {
      console.warn("Coral CLI Warning/Error Output:", stderr);
    }

    if (!stdout || stdout.trim() === "") {
      throw new Error("Coral CLI returned empty output");
    }

    const data = JSON.parse(stdout.trim());
    return data as T;
  } catch (error) {
    console.error("Failed to execute Coral command:", command);
    console.error(error);
    throw new Error("Coral command execution failed");
  }
}
