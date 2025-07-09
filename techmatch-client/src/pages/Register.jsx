// src/pages/Register.jsx

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();

  const registerSchema = Yup.object().shape({
    name: Yup.string().required('Name required'),
    email: Yup.string().email('Invalid email').required('Email required'),
    password: Yup.string().min(6, 'Min 6 characters').required('Password required'),
    techStack: Yup.string().required('Tech stack required'),
  });

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

      <Formik
        initialValues={{ name: '', email: '', password: '', techStack: '' }}
        validationSchema={registerSchema}
        onSubmit={async (values, actions) => {
          try {
            await axios.post('/auth/register', values);
            toast.success('Registered successfully!');
            navigate('/login');
          } catch (error) {
            toast.error('Registration failed');
            console.error(error);
          }
          actions.setSubmitting(false);
        }}
      >
        {() => (
          <Form className="space-y-4">
            <div>
              <label>Name</label>
              <Field name="name" className="input" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label>Email</label>
              <Field name="email" className="input" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label>Password</label>
              <Field name="password" type="password" className="input" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label>Tech Stack (comma separated)</label>
              <Field name="techStack" className="input" />
              <ErrorMessage name="techStack" component="div" className="text-red-500 text-sm" />
            </div>

            <button type="submit" className="btn-primary w-full">Register</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
