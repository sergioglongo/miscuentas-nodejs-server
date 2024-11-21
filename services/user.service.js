import { createToken } from "../tools/token.js";
import { compareHash } from "../tools/hash.js";

export const userSignInByPasswordOrGoogle = async ({ email, username, password, google_id }) => {
	const selectedUser = await _User
		.findOne(
			email
				? {
						where: { email: email },
				  }
				: google_id
				? {
						where: { google_id: google_id },
				  }
				: {
						where: { username: username },
				  },
		)
		.catch((error) => {
			throw error;
		});

	console.log(selectedUser)
	if (!selectedUser) {
		return;
	}
	if (!google_id) {
		if (password && selectedUser.password) {
			const compare_password = await compareHash(
				password,
				selectedUser.password,
			);

			if (!compare_password) {
				throw new Error("Password incorrect");
			}

			if (selectedUser && compare_password) {
				const { password, ...userWithoutPassword } = selectedUser;
				const userWithToken = {
					...userWithoutPassword,
					token: createToken(selectedUser, "user"),
				};
				return userWithToken;
			}
		}
	}

	if (google_id) {
		return {
			id: selectedUser.id,
			username: selectedUser.username,
			email: selectedUser.email,
			permissions: selectedUser.permissions,
			google_id: selectedUser.google_id,
			google_access_token: selectedUser.google_access_token,
			google_refresh_token: selectedUser.google_refresh_token,
			google_token_expires: selectedUser.google_token_expires,
			token: createToken(selectedUser, "user"),
			is_active: selectedUser.is_active,
			type: selectedUser.type,
		};
	}
	throw new Error("Incorrect data");
}