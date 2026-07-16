"use client";

import { Modal, Input, Button, DatePicker } from "antd";
import { Formik, Form, Field, type FieldProps, type FormikHelpers } from "formik";
import { toast } from "react-toastify";
import dayjs, { type Dayjs } from "dayjs";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { useCreateMeetingAsModelMutation, useUpdateMeetingAsModelMutation } from "../store/api/meetingsApi";
import { getApiErrorMessage } from "../store/api/apiError";
import type { MeetingModel } from "../models/meeting.model";

type CreateMeetingValues = {
  title: string;
  dateTime: Dayjs | null;
};

function validate(values: CreateMeetingValues) {
  const errors: Partial<Record<keyof CreateMeetingValues, string>> = {};
  if (!values.title.trim()) {
    errors.title = "Meeting title is required.";
  }
  if (!values.dateTime) {
    errors.dateTime = "Meeting date and time is required.";
  }
  return errors;
}

type CreateMeetingModalProps = {
  open: boolean;
  projectId: string;
  // Presence of `meeting` switches the modal into edit mode - prefilling
  // the form and calling updateMeeting instead of createMeeting.
  meeting?: MeetingModel;
  onClose: () => void;
  onSaved: () => void;
};

export default function CreateMeetingModal({
  open,
  projectId,
  meeting,
  onClose,
  onSaved,
}: CreateMeetingModalProps) {
  const [createMeeting] = useCreateMeetingAsModelMutation();
  const [updateMeeting] = useUpdateMeetingAsModelMutation();
  const isEditMode = Boolean(meeting);

  const initialValues: CreateMeetingValues = {
    title: meeting?.title ?? "",
    dateTime: meeting ? dayjs(meeting.meetingDateTime) : null,
  };

  const handleSubmit = async (
    values: CreateMeetingValues,
    { resetForm }: FormikHelpers<CreateMeetingValues>
  ) => {
    const payload = {
      title: values.title,
      meetingDateTime: values.dateTime!.toISOString(),
    };

    try {
      if (meeting) {
        await updateMeeting(meeting.meetingId, projectId, payload);
        toast.success("Meeting updated successfully.");
      } else {
        await createMeeting(projectId, payload);
        toast.success("Meeting created successfully.");
      }
      resetForm();
      onSaved();
    } catch (err) {
      toast.error(getApiErrorMessage(err as FetchBaseQueryError | SerializedError));
    }
  };

  return (
    <Modal
      title={isEditMode ? "Edit meeting" : "New meeting"}
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
          <Form className="create-project-form">
            <label className="modal-label" htmlFor="title">
              Meeting title <span className="required-mark">*</span>
            </label>
            <Field name="title">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  id="title"
                  placeholder="Sprint planning"
                  status={errors.title && touched.title ? "error" : ""}
                />
              )}
            </Field>
            {errors.title && touched.title && (
              <p className="modal-field-error">{errors.title}</p>
            )}

            <label className="modal-label" htmlFor="dateTime">
              Meeting date and time <span className="required-mark">*</span>
            </label>
            <DatePicker
              id="dateTime"
              className="modal-date-picker"
              showTime
              format="MMM D, YYYY h:mm A"
              value={values.dateTime}
              onChange={(value) => setFieldValue("dateTime", value)}
              onBlur={() => setFieldTouched("dateTime", true)}
              status={errors.dateTime && touched.dateTime ? "error" : ""}
            />
            {errors.dateTime && touched.dateTime && (
              <p className="modal-field-error">{errors.dateTime}</p>
            )}

            <div className="modal-actions">
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                {isEditMode ? "Save changes" : "Create meeting"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
