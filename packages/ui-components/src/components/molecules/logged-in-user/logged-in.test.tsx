import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Needed for Link component
import { LoggedIn } from './logged-in';
import userEvent from '@testing-library/user-event';

const mockLogout = vi.fn();
const defaultProps = {
  data: {
    firstName: 'John',
    lastName: 'Doe',
    notificationCount: 3
  },
  onLogoutClicked: mockLogout
};
const propsWithImage = {
  ...defaultProps,
  data: {
    ...defaultProps.data,
    profileImage: 'https://example.com/profile.jpg'
  }
};

const user = userEvent.setup();

describe('logged-in.loggedInComponentRendered', () => {
  describe('Given LoggedIn component rendered', () => {
    describe('when rendering page', () => {
      it(`then I expect the user's full name, the Log Out button, and My Community(s) link to be in the document`, () => {
        // Arrange
        render(<LoggedIn {...defaultProps} />, { wrapper: MemoryRouter });

        // Act
        const link = screen.getByRole('link', { name: /My Community\(s\)/ });

        // Assert
        expect(screen.getByText(`${defaultProps.data.firstName} ${defaultProps.data.lastName}`)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Log Out' })).toBeInTheDocument();
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/community/accounts');
      });
    });
  });

  describe('Given the user does not have a profile photo', () => {
    describe('when rendering page', () => {
      it(`then I expect the user's profile photo to be of their initials`, () => {
        // Arrange
        render(<LoggedIn {...defaultProps} />, { wrapper: MemoryRouter });
        const avatarUrl = `https://ui-avatars.com/api/?name=${defaultProps.data.firstName}+${defaultProps.data.lastName}`;

        // Act
        const images = screen.getAllByRole('img');
        const avatarInitialsImg = images.find((img) => img.getAttribute('src') === avatarUrl);

        // Assert
        expect(avatarInitialsImg).toBeInTheDocument();
      });
    });
  });

  describe('Given the user has a profile photo', () => {
    describe('when rendering page', () => {
      it(`then I expect the user's profile photo to be displayed`, () => {
        // Arrange
        render(<LoggedIn {...propsWithImage} />, { wrapper: MemoryRouter });

        //Act
        const images = screen.getAllByRole('img');
        const avatarImg = images.find((img) => img.getAttribute('src') === propsWithImage.data.profileImage);

        // Assert
        expect(avatarImg).toBeInTheDocument();
      });
    });
  });
});

describe('logged-in.logout', () => {
  describe('Given the user is logged in', () => {
    describe('when the user clicks the Log Out button', () => {
      it('then I expect onLogoutClicked to have been called', async () => {
        // Arrange
        render(<LoggedIn {...defaultProps} />, { wrapper: MemoryRouter });

        // Act
        const logoutButton = screen.getByText('Log Out');
        await user.click(logoutButton);

        // Assert
        expect(mockLogout).toHaveBeenCalled();
      });
    });
  });
});
