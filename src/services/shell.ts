import { exec } from 'node:child_process';

export type ShellResult = {
  error: Error | null;
  exitCode: number;
  stdout: string;
  stderr: string;
};

export async function shell(command: string) {
  return new Promise<ShellResult>((resolve) => {
    exec(command, (error, stdout, stderr) => {
      resolve({
        error,
        exitCode: error?.code ?? 0,
        stdout,
        stderr,
      });
    });
  });
}
