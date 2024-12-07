import { User, UserRole } from "@/models/users/entities/user.entity";

export default [
    new User({
        email: "admin@gmail.com",
        firstName: "Admin",
        lastName: "Admin",
        password: "Qwerty123!",
        role: UserRole.ADMIN,
    }),
];
