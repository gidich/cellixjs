import { Button } from 'antd';
import styles from './header.module.css';

export const Header: React.FC = () => {
	const handleLogin = () => {
		// biome-ignore lint:useLiteralKeys
		window.location.href = `${import.meta.env['VITE_AAD_B2C_REDIRECT_URI']}`;
	};

	return (
		<>
			<div className={`${styles['top-bar']} flex gap-2`}>
				<Button type="primary" onClick={handleLogin}>
					Log In v6
				</Button>
			</div>
		</>
	);
};
