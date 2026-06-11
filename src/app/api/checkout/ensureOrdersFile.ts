import * as fs from 'fs/promises';
import path from 'path';
import { ordersFilePath } from './ordersFilePath';

export async function ensureOrdersFile() {
  await fs.mkdir(path.dirname(ordersFilePath), {
    recursive: true
  });

  try {
    await fs.access(ordersFilePath);
  } catch {
    await fs.writeFile(ordersFilePath, JSON.stringify([], null, 2), 'utf8');
  }
}
