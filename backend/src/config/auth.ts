
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./database";
import { verifyPassword, hashPassword } from "../utils/password";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:3001",
        process.env.FRONTEND_URL || "http://localhost:3000",
    ].filter(Boolean) as string[],
    emailAndPassword: {
        enabled: true,
        // We use our existing custom password verification to simple migration
        password: {
            hash: async (password) => {
                return hashPassword(password);
            },
            verify: async ({ password, hash }) => {
                return verifyPassword(password, hash);
            }
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "CUSTOMER",
            },
        },
        // Map the image field to avatarUrl in our schema
        changeEmail: {
            enabled: true,
        }
    },
    // We can allow "username" login if needed, or just email
});
