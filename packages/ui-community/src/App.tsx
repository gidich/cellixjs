

import { Route, Routes } from 'react-router-dom';
import './App.css';
import { Accounts } from './components/layouts/accounts';
import { Root } from './components/layouts/root';
import { AuthLanding } from './components/ui/molecules/auth-landing';
import { RequireAuth } from './components/ui/molecules/require-auth';
import { ApolloConnection } from './components/ui/organisms/apollo-connection';

export default function App() {
	const authSection = (
		<ApolloConnection>
			<RequireAuth forceLogin={true}>
				<AuthLanding />
			</RequireAuth>
		</ApolloConnection>
	);

	const rootSection = (
		<ApolloConnection>
			<Root />
		</ApolloConnection>
	);

	const communitySection = (
		<RequireAuth forceLogin={false}>
			<ApolloConnection>
				<Routes>
					<Route path="/" element={<Accounts />} />
					<Route path="/accounts/*" element={<Accounts />} />
				</Routes>
			</ApolloConnection>
		</RequireAuth>
	);

	return (
		<Routes>
			<Route path="*" element={rootSection} />
            <Route path="/auth-redirect" element={authSection} />
			<Route path="/community/*" element={communitySection} />
		</Routes>
	);
}
