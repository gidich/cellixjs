import { LoggedIn, type LoggedInProps } from './logged-in';
import { NotLoggedIn } from './not-logged-in';

export interface LoggedInUserProps {
  data: {
    isLoggedIn: boolean;
    firstName?: string;
    lastName?: string;
    notificationCount?: number;
    profileImage?: string | undefined;
  };
  onLoginClicked?: () => void;
  onSignupClicked?: () => void;
  onLogoutClicked?: () => void;
}

export const LoggedInUser: React.FC<LoggedInUserProps> = (props) => {
  const content = () => {
    const dummyFunction = () => {
      return;
    };
    if (props.data.isLoggedIn) {
      const loggedInProps: Partial<LoggedInProps> = {
        data: {
          profileImage: props.data.profileImage ?? '',
          firstName: props.data.firstName ?? '',
          lastName: props.data.lastName ?? '',
          notificationCount: props.data.notificationCount ?? 0
        }
      };

      return <LoggedIn data={loggedInProps.data as LoggedInProps['data']} onLogoutClicked={props.onLogoutClicked as () => void}/>
    } else {
      return (
        <NotLoggedIn
          onLoginClicked={props.onLoginClicked ?? dummyFunction}
          onSignupClicked={props.onSignupClicked ?? dummyFunction}
        />
      );
    }
  };

  return <div className={` `}>{content()}</div>
};
