import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, } from "typeorm";

export enum UserRole {
  NOMINEE = "NOMINEE",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN"
}
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE"
}

export enum UserInterest {
  EXPLORING = "EXPLORING",
  COMMITTED = "COMMITTED",
  HIGHLY_COMMITTED = "HIGHLY_COMMITTED",
  FULLY_COMMITTED = "FULLY_COMMITTED",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  declare id: string;

  @Column({ type: "varchar", length: 55, nullable: false })
  declare firstName: string;

  @Column({ type: "varchar", length: 55, nullable: false })
  declare lastName: string;

  @Column({ type: "varchar", length: 55, nullable: true })
  declare nickName: string;

  @Column({ type: "varchar", length: 15, unique: true })
  declare phoneNumber: string;

  @Column({ type: "enum", enum: Gender })
  declare gender: Gender;

  @Column({ type: "text" })
  declare password: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  declare profileImage: string;

  @Column({ type: "integer", default: 0 })
  declare profileChangeCount: number;

  @Column({ type: "enum", enum: UserRole })
  declare role: UserRole;

  
  @Column({ type: "varchar", length: 255, nullable: true })
  declare category: string;

  @Column({ type: "enum", enum: UserInterest, nullable: true })
  declare interest: UserInterest;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  declare status: UserStatus;

  @Column({ type: "boolean", default: true })
  declare isActive: boolean;

  @Column({ type: "boolean", default: false })
  declare isDeleted: boolean;

  @CreateDateColumn({ type: "timestamptz", })
  declare createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", })
  declare updatedAt: Date;
}
