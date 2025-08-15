// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { MemoryRouter } from 'react-router-dom';
// import { describe, expect, it } from 'vitest';
// import { LoggedInUser } from './index';

// describe('index.loggedInUserComponentRendered', () => {
//   describe('Given LoggedInUser component rendered', () => {
//     const user = userEvent.setup()
//     const mockLogin = vi.fn();
//     const mockSignup = vi.fn();
//     const mockLogout = vi.fn();

//     describe('when user is logged out', () => {
//       it('then I expect NotLoggedIn compnent to be rendered', async () => {
//         // Arrange
//         const notLoggedInProps = {
//           data: {
//             isLoggedIn: false
//           },
//           onLoginClicked: mockLogin,
//           onSignupClicked: mockSignup
//         };
//         render(<LoggedInUser {...notLoggedInProps} />);

//         // Act
//         const loginButton = screen.getByRole('button', { name: 'Login' });
//         const signupButton = screen.getByRole('button', { name: 'Sign up' });
//         await user.click(loginButton);
//         await user.click(signupButton);

//         // Assert
//         expect(loginButton).toBeInTheDocument();
//         expect(signupButton).toBeInTheDocument();
//         expect(mockLogin).toHaveBeenCalled();
//         expect(mockSignup).toHaveBeenCalled();
//       });
//     });

//     describe('when user is logged in', () => {
//       it('then I expect LoggedIn compnent to be rendered', async () => {
//         // Arrange
//         const loggedInProps = {
//           data: {
//             isLoggedIn: true,
//             firstName: 'John',
//             lastName: 'Doe',
//             notificationCount: 3,
//             profileImage: 'https://example.com/profile.jpg'
//           },
//           onLogoutClicked: mockLogout
//         };
//         render(<LoggedInUser {...loggedInProps} />, { wrapper: MemoryRouter });
//         const userFullName = `${loggedInProps.data.firstName} ${loggedInProps.data.lastName}`;

//         // Act
//         const logoutButton = screen.getByRole('button', { name: 'Log Out' });
//         await user.click(logoutButton);

//         // Assert
//         expect(screen.getByText(userFullName)).toBeInTheDocument();
//         expect(logoutButton).toBeInTheDocument();
//         expect(mockLogout).toHaveBeenCalled();
//       });
//     });
//   });
// });