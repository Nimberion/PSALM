import { newID } from "@/utils";
export interface Employee {
	id: string;
	firstName: string;
	lastName: string;
	fullTime: boolean;
	projects: Array<string>;
}

export function newEmployee(id = newID(), firstName = "", lastName = "", fullTime = false, projects: Array<string> = []): Employee {
	return { id, firstName, lastName, fullTime, projects };
}
