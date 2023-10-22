import os from "node:os";
import path from "node:path";

export const app_folder = path.join(os.homedir(), ".lxcrypt");

export const rsa_key_size = 4096;
export const rsa_key_hash = "SHA-512";

export const rsa_key_format = "RSA-OAEP";

export const private_key_aes_type = "AES-GCM";

export const private_key_aes_length = 256;
export const private_key_path = path.join(app_folder, "private_key.lxcf");
export const public_key_path = path.join(app_folder, "public_key.lxcf");

export const PublicID_path = path.join(app_folder, "PublicID.lxcf");

export const hashfile_path = path.join(app_folder, "hashfile.lxcf");

export const contact_db_path = path.join(app_folder, "contacts.lxcf");

export const paste_api = "https://dpaste.com/api/v2/";

export const user_agent = "LxCrypt (https://github.com/LioXP/LxCrypt)";

export const paste_prefix = "https://dpaste.com/";
export const raw_paste_suffix = ".txt";
