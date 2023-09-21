import fs from "fs";

export async function getFileNamesInFolder(folderPath: any): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (error, files) => {
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    });
  });
}
