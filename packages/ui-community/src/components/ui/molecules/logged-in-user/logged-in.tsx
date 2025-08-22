import { Avatar, Button } from 'antd';
import type { FC, JSX } from 'react';
import { Link } from 'react-router-dom';

export interface LoggedInProps {
  data: {
    profileImage?: string;
    firstName: string;
    lastName: string;
    notificationCount: number;
  };
  onLogoutClicked: () => void;
}

export const LoggedIn: FC<LoggedInProps> = (props) => {
  const initials = (props.data.firstName.charAt(0) + props.data.lastName.charAt(0)).toUpperCase();
  const profileImage: JSX.Element = props.data.profileImage ? <img src={props.data.profileImage} alt={`${props.data.firstName} ${props.data.lastName}`} /> : <img src={`https://ui-avatars.com/api/?name=${props.data.firstName}+${props.data.lastName}`} alt={`${props.data.firstName} ${props.data.lastName}`} />
  return <div className='ml-3'>
    <Avatar src={profileImage} style={{backgroundColor: '#87d068'}}>{initials}</Avatar><span
    className='mr-3'>{' '}{props.data.firstName} {props.data.lastName}{' '}</span>

    <Button onClick={props.onLogoutClicked}>Log Out</Button>
    <span className='mx-3'>
    <Link to="/community/accounts">My Community(s)</Link>
    </span>

  </div>
}
