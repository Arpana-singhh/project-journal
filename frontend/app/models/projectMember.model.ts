// Raw shape of a single project member object as returned by the Express
// API (see backend/controller/inviteController.js -> getProjectMembers).
// Nothing outside the service layer should ever touch this type directly.
export type RawMemberUser = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
};

export type RawProjectMember = {
  projectMemberId: string;
  projectId: string;
  memberId: RawMemberUser;
  role: "owner" | "editor";
  joinedAt: string;
};

export type GetProjectMembersApiResponse = {
  success: boolean;
  message: string;
  members: RawProjectMember[];
};

export class ProjectMemberModel {
  projectMemberId: string;
  projectId: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  role: "owner" | "editor";
  joinedAt: Date;

  constructor(raw: RawProjectMember) {
    this.projectMemberId = raw.projectMemberId;
    this.projectId = raw.projectId;
    this.userId = raw.memberId._id;
    this.name = raw.memberId.name;
    this.email = raw.memberId.email;
    this.avatar = raw.memberId.avatar;
    this.role = raw.role;
    this.joinedAt = new Date(raw.joinedAt);
  }

  static fromApi(raw: RawProjectMember): ProjectMemberModel {
    return new ProjectMemberModel(raw);
  }

  static fromApiList(rawList: RawProjectMember[]): ProjectMemberModel[] {
    return (rawList ?? []).map((raw) => ProjectMemberModel.fromApi(raw));
  }

  // Shape used by the member list row UI (project detail page - Members tab).
  toListItem() {
    return {
      id: this.projectMemberId,
      name: this.name,
      email: this.email,
      role: this.role === "owner" ? ("Owner" as const) : ("Editor" as const),
      initials: this.name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    };
  }
}
