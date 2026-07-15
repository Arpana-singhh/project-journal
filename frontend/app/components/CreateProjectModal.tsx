"use client";

import { Modal, Input, Button } from "antd";
import { Formik, Form, Field, type FieldProps, type FormikHelpers } from "formik";
import { toast } from "react-toastify";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { useCreateProjectAsModelMutation } from "../store/api/projectsApi";
import { getApiErrorMessage } from "../store/api/apiError";

type CreateProjectValues = {
  name: string;
  key: string;
  description: string;
};

const initialValues: CreateProjectValues = {
  name: "",
  key: "",
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
  const [createProject] = useCreateProjectAsModelMutation();

  const handleSubmit = async (
    values: CreateProjectValues,
    { resetForm }: FormikHelpers<CreateProjectValues>
  ) => {
    try {
      const project = await createProject({
        projectName: values.name,
        projectKey: values.key,
        description: values.description,
      });

      toast.success(`Project "${project.projectName}" created successfully.`);
      onCreate(values);
      resetForm();
    } catch (err) {
      toast.error(getApiErrorMessage(err as FetchBaseQueryError | SerializedError));
    }
  };

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
        onSubmit={handleSubmit}
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
