import Login from '../../screens/auth/login/Login';

export const authRoutes = [
  {
    name: 'Login' as const,
    component: Login,
    disableBack: true,
  },
];
