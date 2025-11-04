import { integer, pgTable,  varchar ,jsonb, PgJsonb} from "drizzle-orm/pg-core";
import { json } from "stream/consumers";
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),

});
export const AIThumbnailTable=pgTable('thumbnails',{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    userInput:varchar(),
    thumbnailUrl:varchar(),
    refImage:varchar(),
    userEmail:varchar().references(()=> usersTable.email),
    createdOn:varchar()
});

export const AiContentTable=pgTable('AiContent',{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    userInput:varchar(),
    content: jsonb(),
    thumbnailUrl:varchar(),
    userEmail:varchar().references(()=> usersTable.email),
    createdOn:varchar()
});