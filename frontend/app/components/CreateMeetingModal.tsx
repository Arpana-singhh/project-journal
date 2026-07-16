"use client";

import { Modal, Input, Button, DatePicker } from "antd";
import { Formik, Form, Field, type FieldProps, type FormikHelpers } from "formik";
import type { Dayjs } from "dayjs";

type CreateMeetingValues = {
  title: string;
  dateTime: Dayjs | null;
};

const initialValues: CreateMeetingValues = {
  title: "",
  dateTime: null,
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
  onClose: () => void;
  onCreate: (values: CreateMeetingValues) => void;
};

export default function CreateMeetingModal({
  open,
  onClose,
  onCreate,
}: CreateMeetingModalProps) {
  const handleSubmit = (
    values: CreateMeetingValues,
    { resetForm }: FormikHelpers<CreateMeetingValues>
  ) => {
    onCreate(values);
    resetForm();
  };

  return (
    <Modal title="New meeting" open={open} onCancel={onClose} footer={null} destroyOnHidden>
      <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
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
                Create meeting
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
