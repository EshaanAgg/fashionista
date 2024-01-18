import fs from 'fs';
import path from 'path';

export function getImagesInDirectory(directoryPath) {
  return fs
    .readdirSync(directoryPath)
    .map((file) => path.join(directoryPath, file));
}
