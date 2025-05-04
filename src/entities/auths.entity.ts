import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Historic } from "./historic.entity";

@Entity()
export class Auth{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nom: string;

    @Column()
    prenom: string;

    @Column()
    email: string;

    @Column()
    password: string;

    //@OneToMany(() => Historic, historic => historic.user)
    //historics: Historic[];
}