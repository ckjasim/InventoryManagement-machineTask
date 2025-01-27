import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { userLoing, userSignUp } from '../Api/user';
import toast from 'react-hot-toast';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Simplified password strength calculation
  const getPasswordStrength = (password:any) => {
    let score = 0;
    const rules = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ];
    
    score = rules.filter(Boolean).length;
    
    const strengthLevels:any = {
      0: { color: 'bg-red-500', label: 'Very Weak' },
      1: { color: 'bg-red-500', label: 'Very Weak' },
      2: { color: 'bg-orange-500', label: 'Weak' },
      3: { color: 'bg-yellow-500', label: 'Fair' },
      4: { color: 'bg-blue-500', label: 'Good' },
      5: { color: 'bg-green-500', label: 'Strong' }
    };

    return {
      score,
      ...strengthLevels[score]
    };
  };

  // Validation schemas
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  const signupSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/\d/, 'Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      if (isLogin) {
        const res = await userLoing(values);
        window.location.href = '/';
      } else {
        await userSignUp(values);
        toast.success('Account created successfully!');
        window.location.href = '/';

        setIsLogin(true);
      }
    } catch (error:any) {
      toast.error(error.response?.data?.errors?.[0]?.message || 'An error occurred');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="mt-2 text-gray-400">
            {isLogin 
              ? 'Sign in to access your account' 
              : 'Register to get started with Inventory Manager'}
          </p>
        </div>

        <Formik
          initialValues={{
            email: '',
            password: '',
            confirmPassword: ''
          }}
          validationSchema={isLogin ? loginSchema : signupSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values }) => (
            <Form className="mt-8 space-y-6">
              <div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Field
                    name="email"
                    type="email"
                    className="bg-gray-700 text-white pl-10 pr-4 py-3 w-full rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
                    placeholder="Email address"
                  />
                </div>
                {errors.email && touched.email && (
                  <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="bg-gray-700 text-white pl-10 pr-12 py-3 w-full rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                )}

                {/* Password strength indicator (only show during signup) */}
                {!isLogin && values.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, index) => {
                        const strength = getPasswordStrength(values.password);
                        return (
                          <div
                            key={index}
                            className={`h-1 flex-1 rounded-full ${
                              index < strength.score ? strength.color : 'bg-gray-600'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <p className="text-sm text-gray-400">
                      {getPasswordStrength(values.password).label}
                    </p>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Field
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      className="bg-gray-700 text-white pl-10 pr-4 py-3 w-full rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
                      placeholder="Confirm Password"
                    />
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-400 hover:text-blue-300 font-medium focus:outline-none"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Sign in'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AuthForm;