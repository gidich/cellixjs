import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NotLoggedIn } from './not-logged-in';
import userEvent from '@testing-library/user-event';

const onLoginClickedMock = vi.fn();
const onSignupClickedMock = vi.fn();
const user = userEvent.setup();
render(<NotLoggedIn onLoginClicked={onLoginClickedMock} onSignupClicked={onSignupClickedMock} />);
const loginButtonText = 'Login';
const signupButtonText = 'Sign up';

describe('not-logged-in.notLoggedInComponentRendered', () => {
  describe('Given NotLoggedIn component rendered', () => {
    // Arrange: setup is done in the render function

    describe('when rendering page', () => {
      // Act
      const loginButton = screen.getByRole('button', { name: loginButtonText });
      const signupButton = screen.getByRole('button', { name: signupButtonText });
      it('then I expect the Login and Sign up buttons to be in the document', () => {
        // Assert
        expect(loginButton).toBeInTheDocument();
        expect(signupButton).toBeInTheDocument();
      });
    });
  });
});

describe('not-logged-in.login', () => {
  describe('Given a logged out user', () => {
    // Arrange: setup is done in the render function

    describe('when user clicks Login button', () => {
      // Act
      user.click(screen.getByText(loginButtonText));
      it('then I expect onLoginClicked to have been called', () => {
        // Assert
        expect(onLoginClickedMock).toHaveBeenCalled();
      });
    });
  });
});

describe('not-logged-in.signUp', () => {
  describe('Given a logged out user', () => {
    // Arrange: setup is done in the render function

    describe('when user clicks Sign up button', async () => {
      // Act
      await user.click(screen.getByText(signupButtonText));
      it('then I expect onSignupClicked to have been called', () => {
        // Assert
        expect(onSignupClickedMock).toHaveBeenCalled();
      });
    });
  });
});
