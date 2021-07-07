import { readDir } from "@tauri-apps/api/fs";
import { EmployeeAvailability } from "./interfaces/Project";

export function newID(): string {
	return Math.random().toString(36).substr(2, 9);
}

export async function pathExists(dir: string, path: string): Promise<boolean> {
	return (await readDir(dir)).find((element) => element.path === path) !== undefined;
}

export function findEmployeeAvailability(staffAvailability: Array<EmployeeAvailability>, employeeId: string): EmployeeAvailability | undefined {
	return staffAvailability.find((element) => element.employeeId === employeeId);
}
