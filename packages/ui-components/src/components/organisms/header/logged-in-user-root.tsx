import type { LoggedInUserContainerEndUserFieldsFragment } from "../../../generated.tsx";
import { LoggedInUser, type LoggedInUserProps } from "../../molecules/index.tsx";

export interface LoggedInUserRootProps {
    userData: LoggedInUserContainerEndUserFieldsFragment;
    handleLogout: () => void;
}

export const LoggedInUserRoot: React.FC<LoggedInUserRootProps> = (props) => {
    const userData: LoggedInUserProps = {
      data: {
        isLoggedIn: true,
        firstName: props.userData?.personalInformation?.identityDetails?.restOfName ?? '',
        lastName: props.userData?.personalInformation?.identityDetails?.lastName ?? '',
        notificationCount: 0
      }
    };
    return (
      <div className="text-right text-sky-400  flex-grow">
        <LoggedInUser key={props.userData?.id} data={userData.data} onLogoutClicked={props.handleLogout} />
      </div>
    );
}