import { DataTypes } from 'sequelize'
import { Table, Column, Model } from 'sequelize-typescript'


export enum  OrderStatus {
    INITIAL= 'INITIAL',
    PENDING= 'PENDING',
    SUCCESS= 'SUCCESS',
    FAILED= 'FAILED'
}

@Table({
  tableName: 'orders',
  timestamps: true,
  modelName: 'order'
})

export default class Order extends Model {
  @Column({
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  })
  id?: number

  @Column({
    field: 'order_id'
  })
  orderId?: string

  @Column({
    field: 'status',
    type: DataTypes.ENUM(
        'INITIAL',
        'PENDING',
        'SUCCESS',
        'FAILED'
      )
  })
  status?: OrderStatus

  @Column({
    field: 'created_at'
  })
  createdAt?: Date

  @Column({
    field: 'updated_at'
  })
  updatedAt?: Date

}