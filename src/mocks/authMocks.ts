import { graphql, HttpResponse } from 'msw';

const mockUsers = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123', // In real app, this would be hashed
    role: 'customer',
    emailVerified: true,
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'customer',
    emailVerified: true,
  },
];

let currentUser = null;

export const authHandlers = [
  graphql.mutation('Login', ({ variables }) => {
    const { email, password } = variables;
    const user = mockUsers.find(u => u.email === email);

    if (!user || user.password !== password) {
      return HttpResponse.json(
        {
          errors: [{ message: 'Invalid email or password' }],
        },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;
    currentUser = userWithoutPassword;

    return HttpResponse.json({
      data: {
        login: {
          token: 'mock_token_' + user.id,
          user: userWithoutPassword,
        },
      },
    });
  }),

  graphql.mutation('Register', ({ variables }) => {
    const { input } = variables;
    const existingUser = mockUsers.find(u => u.email === input.email);

    if (existingUser) {
      return HttpResponse.json(
        {
          errors: [{ message: 'Email already exists' }],
        },
        { status: 400 }
      );
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      ...input,
      role: 'customer',
      emailVerified: false,
    };

    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    currentUser = userWithoutPassword;

    return HttpResponse.json({
      data: {
        register: {
          token: 'mock_token_' + newUser.id,
          user: userWithoutPassword,
        },
      },
    });
  }),

  graphql.mutation('Logout', () => {
    currentUser = null;
    return HttpResponse.json({
      data: {
        logout: {
          success: true,
          message: 'Logged out successfully',
        },
      },
    });
  }),

  graphql.query('GetCurrentUser', () => {
    if (!currentUser) {
      return HttpResponse.json(
        {
          errors: [{ message: 'Not authenticated' }],
        },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      data: {
        currentUser,
      },
    });
  }),

  graphql.mutation('ForgotPassword', ({ variables }) => {
    const { email } = variables;
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      return HttpResponse.json(
        {
          errors: [{ message: 'No account found with this email' }],
        },
        { status: 404 }
      );
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

  graphql.mutation('ResetPassword', ({ variables }) => {
    const { token, password } = variables;
    const userId = token.split('_')[1];
    const user = mockUsers.find(u => u.id === userId);

    if (!user) {
      return HttpResponse.json(
        {
          errors: [{ message: 'Invalid reset token' }],
        },
        { status: 400 }
      );
    }

    user.password = password;

    return HttpResponse.json({
      data: {
        resetPassword: {
          success: true,
          message: 'Password reset successfully',
        },
      },
    });
  }),
];
