import { newID } from "@/utils/utils";
export interface Employee {
	id: string;
	firstName: string;
	lastName: string;
	fullTime: boolean;
}

export function newEmployee(id = newID(), firstName = "", lastName = "", fullTime = false): Employee {
	return { id, firstName, lastName, fullTime };
}
