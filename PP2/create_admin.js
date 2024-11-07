import prisma from "./utils/prismaclient.js";

import { hashPassword } from "./utils/auth.js";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password";

async function main() {
    const existingAdmin = await prisma.user.findUnique({
        where: { username: ADMIN_USERNAME }
    });

    if (existingAdmin) {
        console.log("Admin already exists.");
        return;
    }

    const user = await prisma.user.create({
        data: { 
            firstName: ADMIN_USERNAME,
            lastName: "-",
            username: ADMIN_USERNAME,
            password: await hashPassword(ADMIN_PASSWORD), 
            email: "-",
            avatar: "-", 
            role: "admin",
        },
        select: {
            username: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true
          },
    });

    console.log("Admin user created.");
}

main();