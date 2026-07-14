# Project Journal - Project Requirements Document (PRD)

## Overview

Project Journal is a collaborative project discussion platform where
project owners create projects and invite team members. Every meeting,
each member writes their own notes while viewing notes written by other
members.

The application acts as a daily project diary rather than a task
management tool.

------------------------------------------------------------------------

# Tech Stack

## Frontend

-   Next.js
-   Redux Toolkit
-   Tailwind CSS
-   Axios
-   React Hook Form

## Backend

-   Node.js
-   Express.js
-   MongoDB
-   JWT Authentication

------------------------------------------------------------------------

# User Roles

## Owner

-   Create Project
-   Edit Project
-   Delete Project
-   Generate Invite Link
-   View All Notes
-   Create Meeting
-   Write Own Notes
-   Edit Own Notes
-   Delete Own Notes

## Editor

-   Join Project using Invite Link
-   View Project
-   View Meetings
-   View Notes of Every Member
-   Create Meeting (optional)
-   Write Own Notes
-   Edit Own Notes
-   Delete Own Notes

Restrictions: - Cannot edit/delete others' notes - Cannot invite
members - Cannot delete project

------------------------------------------------------------------------

# Project Flow

1.  Register
2.  Login
3.  Owner creates Project
4.  Project is created
5.  Owner generates Invite Link
6.  Share Invite Link
7.  User accepts invite
8.  User becomes Editor
9.  Owner/Editor creates Meeting
10. Every member writes their own notes
11. Everyone can read all notes
12. Only the author can edit/delete their own notes

------------------------------------------------------------------------

# Modules

## Authentication

-   Register
-   Login
-   Logout
-   JWT Authentication
-   Protected Routes

## Project

Fields: - Project Name - Project Key - Client Name - Description

Owner can: - Create - Edit - Delete

## Member Invitation

Owner generates an invite link. Logged-in users opening the link become
Editors for that project.

## Meetings

Fields: - Meeting Title - Meeting Date & Time (recommended as single
DateTime field) - Created By

## Notes

Each meeting allows every member to write their own notes.

Rules: - Everyone can view notes. - Only the author can edit/delete
their own notes.

## Search

-   Projects
-   Meetings
-   Notes

------------------------------------------------------------------------

# Permission Matrix

  Feature                 Owner   Editor
  ---------------------- ------- --------
  Create Project           ✅       ❌
  Edit Project             ✅       ❌
  Delete Project           ✅       ❌
  Invite Members           ✅       ❌
  Join Project             ❌       ✅
  View Project             ✅       ✅
  Create Meeting           ✅       ✅
  View Meeting             ✅       ✅
  Add Notes                ✅       ✅
  Edit Own Notes           ✅       ✅
  Delete Own Notes         ✅       ✅
  Edit Others' Notes       ❌       ❌
  Delete Others' Notes     ❌       ❌
  View Others' Notes       ✅       ✅

------------------------------------------------------------------------

# Database Collections

## Users

-   \_id
-   name
-   email
-   password
-   avatar
-   createdAt
-   updatedAt

## Projects

-   \_id
-   projectName
-   projectKey
-   description
-   ownerId
-   createdAt
-   updatedAt

## ProjectMembers

-   \_id
-   projectId
-   memberId
-   role
-   joinedAt

## Meetings

-   \_id
-   projectId
-   title
-   meetingDateTime
-   createdBy
-   createdAt

## Notes

-   \_id
-   meetingId
-   projectId
-   authorId
-   content
-   createdAt
-   updatedAt

## InviteLinks

-   \_id
-   projectId
-   token
-   createdBy
-   expiresAt
-   maxMembers (null = unlimited until expiry)
-   memberCount

------------------------------------------------------------------------

# Database Relationship

User → Project → ProjectMembers → Meetings → Notes

------------------------------------------------------------------------

# Redux Toolkit

-   authSlice
-   projectSlice
-   memberSlice
-   meetingSlice
-   noteSlice

------------------------------------------------------------------------

# API Endpoints

## Auth

-   POST /register
-   POST /login
-   GET /profile

## Projects

-   GET /projects
-   POST /projects
-   PUT /projects/:id
-   DELETE /projects/:id

## Members

-   POST /projects/:id/invite
-   POST /invite/:token/accept
-   GET /projects/:id/members

## Meetings

-   GET /projects/:id/meetings
-   POST /projects/:id/meetings
-   PUT /meetings/:id
-   DELETE /meetings/:id

## Notes

-   GET /meetings/:id/notes
-   POST /meetings/:id/notes
-   PUT /notes/:id
-   DELETE /notes/:id

------------------------------------------------------------------------

# Future Enhancements

-   File attachments
-   Rich text editor
-   Reactions
-   Notifications
-   Email invitations
-   Calendar view
-   PDF export
