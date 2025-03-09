import { Table, Column, Model } from 'sequelize-typescript'

@Table({
  tableName: 'food',
  timestamps: true,
  modelName: 'food'
})
export default class Food extends Model {
  @Column({
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  })
  id?: number

  @Column({
    field: 'name'
  })
  name?: string

  @Column({
    field: 'created_at'
  })
  createdAt?: Date

  @Column({
    field: 'updated_at'
  })
  updatedAt?: Date
}