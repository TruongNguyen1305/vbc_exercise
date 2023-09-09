import { User } from "./user";
import { Group } from "./group";
import { Product } from "./product";
import { Category } from "./category";
import { Voucher } from "./voucher";
import { Order } from "./order";
import { OrderDetail } from "./orderDetail";

User.belongsToMany(Group, {through: 'UserOfGroup'});
Group.belongsToMany(User, {through: 'UserOfGroup'});

Product.belongsToMany(Category, {through: 'ProductOfCategory'});
Category.belongsToMany(Product, {through: 'ProductOfCategory'});

Voucher.belongsToMany(Product, {through: 'VoucherApplyForProduct', onDelete: 'CASCADE'});
Product.belongsToMany(Voucher, {through: 'VoucherApplyForProduct', onDelete: 'CASCADE'});

Voucher.belongsToMany(User, {through: 'VoucherApplyForUser', onDelete: 'CASCADE'});
User.belongsToMany(Voucher, {through: 'VoucherApplyForUser', onDelete: 'CASCADE'});

Voucher.belongsToMany(Category, {through: 'VoucherApplyForCategory', onDelete: 'CASCADE'});
Category.belongsToMany(Voucher, {through: 'VoucherApplyForCategory', onDelete: 'CASCADE'});

Voucher.belongsToMany(Group, {through: 'VoucherApplyForGroup', onDelete: 'CASCADE'});
Group.belongsToMany(Voucher, {through: 'VoucherApplyForGroup', onDelete: 'CASCADE'});

Voucher.belongsToMany(Order, {through: 'OrderUseVoucher', onDelete: 'CASCADE'});
Order.belongsToMany(Voucher, {through: 'OrderUseVoucher', onDelete: 'CASCADE'});


Product.hasMany(OrderDetail);
OrderDetail.belongsTo(Product);

Order.hasMany(OrderDetail, {
    onDelete: 'CASCADE'
});
OrderDetail.belongsTo(Order);

User.hasMany(Order, {
    onDelete: 'CASCADE'
});
Order.belongsTo(User);



export {
    User,
    Group,
    Product,
    Category,
    Voucher,
    Order,
    OrderDetail
}
