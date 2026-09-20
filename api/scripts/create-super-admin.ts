import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, UserRole, Gender, UserStatus } from "../src/database/entities/User";

const dataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User],
  synchronize: false,
});

async function createSuperAdmin() {
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  const existingUser = await userRepository.findOne({
    where: { phoneNumber: "0247098016" },
  });

  if (existingUser) {
    console.log("A user with this phone number already exists.");
    await dataSource.destroy();
    return;
  }

  const user = userRepository.create({
    firstName: "Digital",
    lastName: "Fred",
    phoneNumber: "0247098016",
    gender: Gender.MALE,
    password: "8016",
    role: UserRole.SUPER_ADMIN,
    status: UserStatus.ACTIVE,
    isActive: true,
    isDeleted: false,
  });

  await userRepository.save(user);

  console.log("SUPER_ADMIN created successfully.");
  console.log(`Phone: ${user.phoneNumber}`);
  console.log(`Role: ${user.role}`);

  await dataSource.destroy();
}

createSuperAdmin().catch(async (error) => {
  console.error("Failed to create SUPER_ADMIN:", error);

  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  process.exit(1);
});