import { Table, Column, Model, DataType } from 'sequelize-typescript'

@Table({
  tableName: 'packets',
  timestamps: true,
  modelName: 'packet'
})
export default class Packet extends Model {
  @Column({
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  })
  id?: number

  @Column({
    field: 'food_id'
  })
  foodId?: number

  @Column({
    field: 'is_reserved'
  })
  isReserved?: boolean

  @Column({
    field: 'order_id',
    allowNull: true,
    type: DataType.STRING
  })
  orderId?: string | null

  @Column({
    field: 'created_at'
  })
  createdAt?: Date

  @Column({
    field: 'updated_at'
  })
  updatedAt?: Date

}