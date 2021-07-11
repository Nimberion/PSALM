import { readDir } from "@tauri-apps/api/fs";

export function newID(): string {
	return Math.random().toString(36).substr(2, 9);
}

export async function pathExists(dir: string, path: string): Promise<boolean> {
	return (await readDir(dir)).find((element) => element.path === path) !== undefined;
}
