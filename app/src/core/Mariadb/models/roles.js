module.exports = (sequelize, type) => {

    const RoleUser = sequelize.define('roles', {
        id: {
            type: type.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        role: {
            type: type.STRING(40),
            allowNull: false,
            unique: true
        },
        description: {
            type: type.STRING(40),
            allowNull: true
        },
        is_active: {
            type: type.BOOLEAN,
            allowNull: false
        }


    }, {
        timestamps: false,
        underscored: true
    })



    RoleUser.associate = (models) => {

    }






    return RoleUser

}
