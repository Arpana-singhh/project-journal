// Raw shape of a single meeting object as returned by the Express API
// (see backend/controller/meetingController.js). Nothing outside the
// service layer should ever touch this type directly.
export type RawMeeting = {
  projectId: string;
  title: string;
  meetingDateTime: string;
  createdBy: string;
  notesCount: number;
  createdAt: string;
  meetingId: string;
};

// The project summary returned alongside meetings - same for every
// meeting in a GetMeetings response, so the API sends it once at the
// top level instead of repeating it inside each meeting.
export type RawMeetingProjectSummary = {
  projectName: string;
  projectKey: string;
  description?: string;
};

type MeetingApiResponseBase = {
  success: boolean;
  message: string;
  project: RawMeetingProjectSummary;
};

export type CreateMeetingApiResponse = MeetingApiResponseBase & {
  meeting: RawMeeting;
};

export type UpdateMeetingApiResponse = MeetingApiResponseBase & {
  meeting: RawMeeting;
};

export type GetMeetingsApiResponse = MeetingApiResponseBase & {
  meetings: RawMeeting[];
};

type MeetingPayload = {
  title: string;
  meetingDateTime: string;
};

export type CreateMeetingPayload = MeetingPayload;

export type UpdateMeetingPayload = Partial<MeetingPayload>;

export class MeetingModel {
  meetingId: string;
  projectId: string;
  title: string;
  meetingDateTime: Date;
  createdBy: string;
  notesCount: number;
  createdAt: Date;

  constructor(raw: RawMeeting) {
    this.meetingId = raw.meetingId;
    this.projectId = raw.projectId;
    this.title = raw.title;
    this.meetingDateTime = new Date(raw.meetingDateTime);
    this.createdBy = raw.createdBy;
    this.notesCount = raw.notesCount ?? 0;
    this.createdAt = new Date(raw.createdAt);
  }

  static fromApi(raw: RawMeeting): MeetingModel {
    return new MeetingModel(raw);
  }

  static fromApiList(rawList: RawMeeting[]): MeetingModel[] {
    return (rawList ?? []).map((raw) => MeetingModel.fromApi(raw));
  }

  // Shape used by the meeting list row UI (project detail page).
  toListItem() {
    return {
      id: this.meetingId,
      title: this.title,
      date: this.meetingDateTime.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      notesCount: this.notesCount,
    };
  }
}

// Wraps the project summary the API sends once alongside meetings (see
// GetMeetingsApiResponse/CreateMeetingApiResponse) together with the
// converted MeetingModel(s), so `project` isn't duplicated onto every
// single meeting instance.
export class MeetingProjectModel {
  project: {
    projectName: string;
    projectKey: string;
    description: string;
  };
  meetings: MeetingModel[];

  constructor(project: RawMeetingProjectSummary, rawMeetings: RawMeeting[]) {
    this.project = {
      projectName: project.projectName,
      projectKey: project.projectKey,
      description: project.description ?? "",
    };
    this.meetings = MeetingModel.fromApiList(rawMeetings);
  }

  // Use for GetMeetingsApiResponse - project + a list of meetings.
  static fromApiList(
    project: RawMeetingProjectSummary,
    rawMeetings: RawMeeting[]
  ): MeetingProjectModel {
    return new MeetingProjectModel(project, rawMeetings);
  }

  // Use for CreateMeetingApiResponse/UpdateMeetingApiResponse - project + a
  // single meeting; access the converted meeting via `.meetings[0]`.
  static fromApi(project: RawMeetingProjectSummary, rawMeeting: RawMeeting): MeetingProjectModel {
    return new MeetingProjectModel(project, [rawMeeting]);
  }
}
