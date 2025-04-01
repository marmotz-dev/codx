#!/usr/bin/env node

import { CodxCli } from '@/cli/CodxCli';

/**
 * Main entry point
 */
async function main(): Promise<void> {
  CodxCli.run(process);
}

// Run the program
main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
