import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const User = sequelize.define("User", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    passsword: DataTypes.STRING,
        role: {
            type: DataTypes.ENUM,
            values: ["admin", "user"],
            defaultValue: "user",
        },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
emailVerificationToken: DataTypes.STRING,
    type: DataTypes.STRING,
    allowNull:true,
},
});
