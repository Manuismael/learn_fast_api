import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Historic } from "./historic.entity";

@Entity()
export class Docs{
    @PrimaryGeneratedColumn()
    id_docs: number;

    @Column()
    path: string;

    @Column()
    upload_at: Date;

    //@OneToMany(() => Historic, historic => historic.document)
    //historics: Historic[];
}