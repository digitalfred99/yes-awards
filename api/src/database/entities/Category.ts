import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, } from "typeorm";

@Entity({ name: "categories" })
export class Category {
  @PrimaryGeneratedColumn("uuid")
  declare id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  declare name: string;
  
  @Column({ type: "text", nullable: true })
  declare description: string;
  
  @Column({ type: "varchar", length: 255, nullable: false })
  declare createdBy: string;

  @Column({ type: "boolean", default: false })
  declare isDeleted: boolean;

  @CreateDateColumn({ type: "timestamptz", })
  declare createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", })
  declare updatedAt: Date;
}
