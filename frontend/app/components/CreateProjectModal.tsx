"use client";

import { Modal, Input, Button } from "antd";
import { Formik, Form, Field, type FieldProps } from "formik";

type CreateProjectValues = {
  name: string;
  key: string;
  clientName: string;
  description: string;
};

const initialValues: CreateProjectValues = {
  name: "",
  key: "",
  clientName: "",
  description: "",
};

function validate(values: CreateProjectValues) {
  const errors: Partial<Record<keyof CreateProjectValues, string>> = {};
  if (!values.name.trim()) {
    errors.name = "Project name is required.";
  }
  if (!values.key.trim()) {
    errors.key = "Project key is required.";
  }
  return errors;
}

type CreateProjectModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (values: CreateProjectValues) => void;
};

export default function CreateProjectModal({
  open,
  onClose,
  onCreate,
}: CreateProjectModalProps) {
  return (
    <Modal
      title="Create project"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={(values, { resetForm }) => {
          onCreate(values);
          resetForm();
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="create-project-form">
            <label className="modal-label" htmlFor="name">
              Project name <span className="required-mark">*</span>
            </label>
            <Field name="name">
              {({ field }: FieldProps) => (
                <Input
                  {...field}
                  id="name"
                  placeholder="Acme website revamp"
                  status={errors.name && touched.name ? "error" : ""}
                />
              )}
            </Field>
            {errors.name && touched.name && (
              <p className="modal-field-error">{errors.name}</p>
            )}

            <div className="modal-field-row">
              <div className="modal-field-col">
                <label className="modal-label" htmlFor="key">
                  Project key <span className="required-mark">*</span>
                </label>
                <Field name="key">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      id="key"
                      placeholder="ACME-WEB"
                      status={errors.key && touched.key ? "error" : ""}
                    />
                  )}
                </Field>
                {errors.key && touched.key && (
                  <p className="modal-field-error">{errors.key}</p>
                )}
              </div>

              <div className="modal-field-col">
                <label className="modal-label" htmlFor="clientName">
                  Client name
                </label>
                <Field name="clientName">
                  {({ field }: FieldProps) => (
                    <Input {...field} id="clientName" placeholder="Acme Corp" />
                  )}
                </Field>
              </div>
            </div>

            <label className="modal-label" htmlFor="description">
              Description
            </label>
            <Field name="description">
              {({ field }: FieldProps) => (
                <Input.TextArea
                  {...field}
                  id="description"
                  placeholder="What is this project about?"
                  rows={3}
                />
              )}
            </Field>

            <div className="modal-actions">
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={isSubmitting}>
                Create project
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
