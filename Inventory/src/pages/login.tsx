import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { userLoing, userSignUp } from '../Api/user';
import toast from 'react-hot-toast';


const AuthForm = () => {
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  
    confirmPassword: ''
  });

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e:any) => {
    e.preventDefault();

    console.log(isLogin,'login format')
    if(isLogin){
      try {
        
        const res = await userLoing(formData)
        console.log(res)
        window.location.href='/'
        
      
      } catch (error:any) {
        toast.error(error.response.data.errors[0].message)
        console.log(error);
      }
       
    }else{
      try {
       if(formData.confirmPassword!==formData.password){
        toast.error('passwrod and confirm  is not match')
        return
       } 
        const response = await userSignUp(formData)
        console.log(response)
      } catch (error:any) {
        toast.error(error.response.data.errors[0].message)
        console.log(error.response.data.errors[0].message)
      }
    }
    console.log('Form submitted:', formData);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
     
      confirmPassword: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
        {/* Header */}
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

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Name field - only shown in signup mode */}
          

          {/* Email field */}
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-700 text-white pl-10 pr-4 py-3 w-full rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
                placeholder="Email address"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
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
          </div>

          {/* Confirm Password field - only shown in signup mode */}
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="bg-gray-700 text-white pl-10 pr-4 py-3 w-full rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>

          {/* Toggle between login and signup */}
          <div className="text-center">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-blue-400 hover:text-blue-300 font-medium focus:outline-none"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;