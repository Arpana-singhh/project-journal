// Raw shape of a single project object as returned by the Express API
// (see backend/controller/projectController.js). Nothing outside the
// service layer should ever touch this type directly.
export type RawProject = {
  projectId: string;
  projectName: string;
  projectKey: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  role?: "owner" | "editor";
  memberCount?: number;
};

export type CreateProjectApiResponse = {
  success: boolean;
  message: string;
  project: RawProject;
};

export type GetAllProjectsApiResponse = {
  success: boolean;
  message: string;
  projects: RawProject[];
};

export type GetProjectByIdApiResponse = {
  success: boolean;
  message: string;
  project: RawProject;
};

export type UpdateProjectApiResponse = {
  success: boolean;
  message: string;
  project: RawProject;
};

export type CreateProjectPayload = {
  projectName: string;
  projectKey: string;
  description?: string;
};

export type UpdateProjectPayload = {
  projectName?: string;
  projectKey?: string;
  description?: string;
};

export class ProjectModel {
  projectId: string;
  projectName: string;
  projectKey: string;
  description: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  role: "owner" | "editor";
  memberCount: number;

  constructor(raw: RawProject) {
    this.projectId = raw.projectId;
    this.projectName = raw.projectName;
    this.projectKey = raw.projectKey;
    this.description = raw.description ?? "";
    this.ownerId = raw.ownerId;
    this.createdAt = new Date(raw.createdAt);
    this.updatedAt = new Date(raw.updatedAt);
    this.role = raw.role ?? "editor";
    this.memberCount = raw.memberCount ?? 0;
  }

  static fromApi(raw: RawProject): ProjectModel {
    return new ProjectModel(raw);
  }

  static fromApiList(rawList: RawProject[]): ProjectModel[] {
    return (rawList ?? []).map((raw) => ProjectModel.fromApi(raw));
  }

  // Shape used by list/card style UI (dashboard grid, project list).
  toCard() {
    return {
      id: this.projectId,
      title: this.projectName,
      subtitle: this.projectKey,
      description: this.description,
      updatedAt: this.updatedAt,
      role: this.role,
      memberCount: this.memberCount,
    };
  }

  // Shape used by detail/edit style UI (a plain form-friendly object).
  toObjectUI() {
    return {
      id: this.projectId,
      name: this.projectName,
      key: this.projectKey,
      description: this.description,
      lastUpdated: this.updatedAt.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    };
  }
}
