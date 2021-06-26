import { newID } from "@/utils";
export interface Employee {
	id: string;
	firstName: string;
	lastName: string;
	fullTime: boolean;
	projects: Array<string>;
}

export function addEmployee(id = newID(), firstName = "", lastName = "", fullTime = false, projects = []): Employee {
	return { id, firstName, lastName, fullTime, projects };
}
