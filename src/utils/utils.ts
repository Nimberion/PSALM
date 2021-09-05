import { readDir } from "@tauri-apps/api/fs";
import hash from "object-hash";

export function newID(): string {
	return Math.random().toString(36).substr(2, 9);
}

export async function pathExists(dir: string, path: string): Promise<boolean> {
	return (await readDir(dir)).find((element) => element.path === path) !== undefined;
}

// eslint-disable-next-line
export function unequal(a: any, b: any): boolean {
	return hash(a, { unorderedArrays: true }) !== hash(b, { unorderedArrays: true });
}

export function formatDate(rawDate: string | Date): string {
	const splittedDate = rawDate.toString().split("-");

	return `${splittedDate[2]}.${splittedDate[1]}.${splittedDate[0]}`;
}
