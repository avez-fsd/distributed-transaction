import { Table, Column, Model } from 'sequelize-typescript'

@Table({
  tableName: 'agents',
  timestamps: true,
  modelName: 'agent'
})
export default class Agent extends Model {
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
    field: 'is_reserved'
  })
  isReserved?: boolean

  @Column({
    field: 'order_id'
  })
  orderId?: string


  @Column({
    field: 'created_at'
  })
  createdAt?: Date

  @Column({
    field: 'updated_at'
  })
  updatedAt?: Date
}