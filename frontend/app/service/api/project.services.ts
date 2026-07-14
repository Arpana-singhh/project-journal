import apiClient from "./apiClient";
import apiRoutes from "@/config/apiRoutes";
import {
  ProjectModel,
  type CreateProjectApiResponse,
  type GetAllProjectsApiResponse,
  type CreateProjectPayload,
} from "../../models/project.model";

export class ProjectService {

  static async createProject(projectName: string, projectKey: string, description?: string): Promise<ProjectModel> {
    const payload: CreateProjectPayload = { projectName, projectKey, description };
    const response = await apiClient.post<CreateProjectApiResponse>(apiRoutes.projects.create, payload);
    return ProjectModel.fromApi(response.data.project);
  }

  static async getAllProjects(): Promise<ProjectModel[]> {
    const response = await apiClient.get<GetAllProjectsApiResponse>(apiRoutes.projects.list);
    return ProjectModel.fromApiList(response.data.projects);
  }
}
