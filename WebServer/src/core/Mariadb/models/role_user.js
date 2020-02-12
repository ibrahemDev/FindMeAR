module.exports = (sequelize, type) => {

    const RoleUser = sequelize.define('role_user', {
        id: {
            type: type.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            field: 'id',
            comment: ''
        },
        role_id: {
            type: type.INTEGER.UNSIGNED,
            allowNull: false,
            field: 'role_id',
            references: { //  n:n
                model: 'roles',
                key: 'id'
            }
        },
        user_id: {
            type: type.BIGINT.UNSIGNED,
            allowNull: false,
            field: 'user_id',
            references: { // n:n
                model: 'users',
                key: 'id'
            }
        }



    }, {
        indexes: [
            {
                unique: true,
                fields: ['role_id', 'user_id']
            }
        ],
        timestamps: false,
        underscored: true
    })


    RoleUser.associate = (models) => {}

    return RoleUser

}
