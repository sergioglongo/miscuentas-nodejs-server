import { createToken } from "../tools/token.js";
import { compareHash, encodeHash } from "../tools/hash.js";
import UsersModel from "../models/user.model.js";
import UnitModel from "../models/unit.model.js";
import AccountModel from "../models/account.model.js";

export const signService = async ({ email, username, password, google_id }) => {
	const selectedUser = await UsersModel
		.findOne(
			email
				? {
					where: { email: email },
					include: [{ model: UnitModel, through: { attributes: ['is_main_unit'] } }],
					nest: true
				}
				: google_id
					? {
						where: { google_id: google_id },
						include: [{ model: UnitModel, through: { attributes: ['is_main_unit'] } }],
						nest: true
					}
					: {
						where: { username: username },
						include: [{ model: UnitModel, through: { attributes: ['is_main_unit'] } }],
						nest: true
					},
		)
		.catch((error) => {
			throw new Error("Error en la consulta");
		});

	// console.log(selectedUser)
	if (!selectedUser) {
		throw new Error("Usuario no existe");
	}
	if (!google_id) {
		if (password && selectedUser.password) {
			const compare_password = await compareHash(
				password,
				selectedUser.password,
			);

			if (!compare_password) {
				throw new Error("Datos incorrectos");
			}

			if (selectedUser && compare_password) {
				const units = selectedUser.units;
				const unitsData = units.map(unit => ({
					id: unit.id,
					name: unit.name,
					description: unit.description,
					photo: unit.photo,
					is_active: unit.is_active,
					is_main_unit: unit.user_unit.is_main_unit
				}));
				const unitMain = unitsData.find((unit) => unit.is_main_unit === true);
				const isInitializedUnit = await AccountModel.findOne({
					where: {
						unitId: unitMain.id
					}
				})
				isInitializedUnit?.dataValues ? unitMain.initialized = true : unitMain.initialized = false;
				if (units.length > 0) {
					const userData = {
						id: selectedUser.id,
						firstname: selectedUser.firstname,
						lastname: selectedUser.lastname,
						email: selectedUser.email,
						photo: selectedUser.photo,
						permissions: selectedUser.permissions,
						type: selectedUser.type,
						is_active: selectedUser.is_active,
						is_premium: selectedUser.is_premium,
						last_login_date: selectedUser.last_login_date,
						register_date: selectedUser.register_date
					};
					const userWithToken = {
						user: userData,
						units: unitsData,
						main_unit: unitMain ? {
							id: unitMain.id,
							name: unitMain.name,
							description: unitMain.description,
							photo: unitMain.photo,
							is_active: unitMain.is_active,
							initialized: unitMain.initialized
						} : null,
						accessToken: createToken(selectedUser, "user")
					};
					return userWithToken;
				}
			}
		}
	}

	if (google_id) {
		return {
			id: selectedUser.id,
			firstname: selectedUser.firstname,
			lastname: selectedUser.lastname,
			email: selectedUser.email,
			permissions: selectedUser.permissions,
			last_login_date: selectedUser.last_login_date,
			register_date: selectedUser.register_date,
			google_id: selectedUser.google_id,
			google_access_token: selectedUser.google_access_token,
			google_refresh_token: selectedUser.google_refresh_token,
			google_token_expires: selectedUser.google_token_expires,
			accessToken: createToken(selectedUser, "user"),
			is_active: selectedUser.is_active,
			is_premium: selectedUser.is_premium,
			type: selectedUser.type,
		};
	}
	throw new Error("Datos incorrectos");
}

export const userCreateEditService = async ({
	id,
	email,
	firstname,
	lastname,
	password,
	photo,
	google_id,
	google_access_token,
	google_refresh_token,
	google_token_expires,
	type,
	permissions,
	is_active,
	is_premium
}) => {
	let user = new UsersModel();

	let hashed_password = null;
	if (id) {
		user = await UsersModel.findByPk(id);
		user.firstname = firstname?.trim() ?? user.firstname;
		user.lastname = lastname?.trim() ?? user.lastname;
		user.photo = photo ?? user.photo;
		user.email = email?.trim() ?? user.email;
		user.google_id = google_id ?? user.google_id;
		user.google_access_token = google_access_token ?? user.google_access_token;
		user.google_refresh_token = google_refresh_token ?? user.google_refresh_token;
		user.google_token_expires = google_token_expires ?? user.google_token_expires;
		user.permissions = permissions ?? user.permissions;
		user.is_active = is_active ?? user.is_active;
		user.is_premium = is_premium ?? user.is_premium;
		user.type = type || user.type;

	} else {
		if (password) {
			hashed_password = await encodeHash(password);
			if (typeof hashed_password !== "string") {
				throw hashed_password;
			}
		}

		user.firstname = firstname?.trim();
		user.lastname = lastname?.trim();
		user.email = email?.trim();
		user.password = hashed_password;
		user.photo = photo ?? null;
		user.google_id = google_id ?? null;
		user.google_access_token = google_access_token ?? null;
		user.google_refresh_token = google_refresh_token ?? null;
		user.google_token_expires = google_token_expires ?? null;
		user.register_date = new Date();
		user.last_login_date = new Date();
		user.type = type || "user";
		user.permissions = { test: true };
		user.is_active = true;
		user.is_premium = false;
	}

	let user_saved = await user.save()
		.catch((error) => {
			console.log(error);
			throw error;
		});

	if (!user_saved) {
		throw new Error(user_saved);
	}

	const accessToken = createToken(user_saved, "user");
	const { password: pass, ...userWithoutPassword } = user_saved?.dataValues;
	const userWithToken = { ...userWithoutPassword, accessToken };

	return userWithToken;
}
