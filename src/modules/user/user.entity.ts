import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm';
import * as bcrypt from "bcryptjs";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;  // Hashed password

  @Column({ nullable: true })
  wallet_address: string;

  @Column({ type: 'decimal', default: 0 })
  token_balance: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  
// Method to validate password
@BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      console.log("Hashed password during registration:", this.password); // Log for debugging
    }
  }

  async isValidPassword(password: string): Promise<boolean> {
    try {
      console.log("Stored hashed password:", this.password); // Debug log
      console.log("Password to compare:", password); // Debug log
      const isValid = await bcrypt.compare(password, this.password);
      console.log("Comparison result:", isValid); // Debug log
      return isValid;
    } catch (err) {
      console.error("Error in isValidPassword:", err);
      throw new Error("Password validation error");
    }
  }
}