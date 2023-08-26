import os from "node:os";
import path from "node:path";

export const app_folder = path.join(os.homedir(), "LxCrypt");
export const private_key_path = path.join(app_folder, "private_key.lxcf");
export const public_key_path = path.join(app_folder, "public_key.lxcf");

export const hashfile_path = path.join(app_folder, "hashfile.lxcf");
