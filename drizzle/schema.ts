import { sqliteTable, AnySQLiteColumn, integer, text, uniqueIndex, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const inquiries = sqliteTable("inquiries", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	name: text().notNull(),
	email: text().notNull(),
	interest: text().notNull(),
	message: text(),
	createdAt: integer("created_at"),
	status: text(),
	ageGroup: text("age_group"),
});

export const session = sqliteTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: integer().notNull(),
	token: text().notNull(),
	createdAt: integer().notNull(),
	updatedAt: integer().notNull(),
	ipAddress: text(),
	userAgent: text(),
	userId: text().notNull().references(() => user.id),
},
(table) => [
	uniqueIndex("session_token_unique").on(table.token),
]);

export const user = sqliteTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: integer().notNull(),
	image: text(),
	createdAt: integer().notNull(),
	updatedAt: integer().notNull(),
},
(table) => [
	uniqueIndex("user_email_unique").on(table.email),
]);

