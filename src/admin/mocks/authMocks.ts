import { graphql, HttpResponse } from 'msw';
import { Role } from '../types/auth';

const mockUsers = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@wickandwax.co',
    role: Role.ADMIN,
    password: 'admin123', // In a real app, this would be hashed
  },
  {
    id: '2',
    firstName: 'Support',
    lastName: 'Agent',
    email: 'support@wickandwax.co',
    role: Role.SUPPORT,
    password: 'support123',
  },
  {
    id: '3',
    firstName: 'Content',
    lastName: 'Manager',
    email: 'content@wickandwax.co',
    role: Role.CONTENT_MANAGER,
    password: 'content123',
  },
];

export const authHandlers = [
  // Login
  graphql.mutation('Login', ({ variables }) => {
    const { email, password } = variables;
    const user = mockUsers.find(u => u.email === email);

    if (!user || user.password !== password) {
      return HttpResponse.json({
        errors: [{ message: 'Invalid email or password' }],
      }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = `mock_token_${user.id}`;

    return HttpResponse.json({
      data: {
        login: {
          token,
          user: userWithoutPassword,
        },
      },
    });
  }),

  // Register
  graphql.mutation('Register', ({ variables }) => {
    const { input } = variables;
    const existingUser = mockUsers.find(u => u.email === input.email);

    if (existingUser) {
      return HttpResponse.json({
        errors: [{ message: 'Email already exists' }],
      }, { status: 400 });
    }

    const newUser = {
      id: `user_${Date.now()}`,
      ...input,
      role: Role.USER,
    };

    mockUsers.push(newUser);
    const token = `mock_token_${newUser.id}`;

    const { password: _, ...userWithoutPassword } = newUser;

    return HttpResponse.json({
      data: {
        register: {
          token,
          user: userWithoutPassword,
        },
      },
    });
  }),

  // Forgot Password
  graphql.mutation('ForgotPassword', ({ variables }) => {
    const { email } = variables;
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      return HttpResponse.json({
        errors: [{ message: 'User not found' }],
      }, { status: 404 });
    }

    return HttpResponse.json({
      data: {
        forgotPassword: {
          success: true,
          message: 'Password reset email sent',
        },
      },
    });
  }),

  // Reset Password
  graphql.mutation('ResetPassword', ({ variables }) => {
    const { token, password } = variables;
    const userId = token.split('_')[2]; // mock_token_userId
    const userIndex = mockUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return HttpResponse.json({
        errors: [{ message: 'Invalid token' }],
      }, { status: 400 });
    }

    mockUsers[userIndex].password = password;

    return HttpResponse.json({
      data: {
        resetPassword: {
          success: true,
          message: 'Password reset successfully',
        },
      },
    });
  }),

  // Verify Email
  graphql.mutation('VerifyEmail', ({ variables }) => {
    const { token } = variables;
    const userId = token.split('_')[2]; // mock_token_userId
    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      return HttpResponse.json({
        errors: [{ message: 'Invalid token' }],
      }, { status: 400 });
    }

    return HttpResponse.json({
      data: {
        verifyEmail: {
          success: true,
          message: 'Email verified successfully',
        },
      },
    });
  }),

  // Get Current User
  graphql.query('GetCurrentUser', () => {
    // In a real app, we would verify the token from the Authorization header
    const user = mockUsers[0]; // For mock purposes, always return the admin user
    const { password: _, ...userWithoutPassword } = user;

    return HttpResponse.json({
      data: {
        currentUser: userWithoutPassword,
      },
    });
  }),
];
