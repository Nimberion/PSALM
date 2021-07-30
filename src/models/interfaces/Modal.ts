import { ModalType } from "../enums/ModalType";
import { Employee } from "./Employee";
import { Project, ProjectDay } from "./Project";

export interface Modal {
	show: boolean;
	type: ModalType; // deleteEmployee, deleteProject, deleteProjectDay, route, exit, reload
	content: Employee | Project | ProjectDay | string;
}
