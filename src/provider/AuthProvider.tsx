import { User } from "firebase/auth";
import React, { FC, useEffect, useState } from "react";
import { auth } from "../service/firebase";


export const AuthContext = React.createContext({} as {
	currentUser: User | null,
	// setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>
});

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
