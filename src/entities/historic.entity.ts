import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Auth } from "./auths.entity";
import { Docs } from "./file.entity";

@Entity()
export class Historic{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  libelle: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column()
  date: Date;

  @Column()
  id_user: number;

  @Column()
  id_docs: number;

  /* @ManyToOne(() => Auth, user => user.id, { onDelete: 'CASCADE' })
  user: Auth;

  @ManyToOne(() => Docs, doc => doc.id_docs, { onDelete: 'CASCADE' })
  document: Docs; */
}