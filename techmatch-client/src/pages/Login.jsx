// src/pages/Login.jsx

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/userSlice';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email required'),
    password: Yup.string().required('Password required'),
  });

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={async (values, actions) => {
          try {
            const res = await axios.post('/auth/login', values);
            dispatch(loginSuccess(res.data));
            toast.success('Login successful!');
            navigate('/');
          } catch (error) {
            toast.error('Login failed');
            console.error(error);
          }
          actions.setSubmitting(false);
        }}
      >
        {() => (
          <Form className="space-y-4">
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

            <button type="submit" className="btn-primary w-full">Login</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
