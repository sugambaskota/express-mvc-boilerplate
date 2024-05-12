import * as fs from "fs-extra";
import * as path from "path";

export const handleError = async (error: any) => {
  const now = new Date();
  const folderPath = path.join(
    __dirname,
    "..",
    "..",
    "logs",
    now.getUTCFullYear().toString(),
    now.toLocaleString("en-US", { month: "2-digit" }),
  );

  // log file path e.g. logs/2022/12/2012-12-22.log
  const filePath = path.join(
    folderPath,
    now.toISOString().slice(0, 10) + ".log",
  );

  await fs.ensureDir(folderPath);

  console.log("Error >>> ", error);

  fs.appendFile(
    filePath,
    now.toISOString() + " >>> " + error.stack + "\n\n",
    {
      encoding: "utf8",
      flag: "a+",
    },
    (err) => {
      if (err) {
        console.log("Error while trying to write to file:\n", err);
      }
    },
  );
};
