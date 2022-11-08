import { User } from "firebase/auth";
import React, { FC, useEffect, useState } from "react";
import { auth } from "../service/firebase";

export type CurrentUser = User | null;
export type AuthContext = {
	currentUser: CurrentUser;
}

export const AuthContext = React.createContext({} as AuthContext);

// childrenの型定義をしておかないとエラーになる
interface props {
	children: React.ReactNode | React.ReactNode[]
}

export const AuthProvider: FC<props> = ({ children }: props) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	useEffect(() => {
		const unSub = () => {
			auth.onAuthStateChanged((user) => {
				setCurrentUser(user);
			})
		}
		unSub();
		return unSub;
	}, []);

	return (
		<AuthContext.Provider value={{ currentUser }}>
			{children}
		</AuthContext.Provider>
	);

}
