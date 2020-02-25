


module.exports = (sequelize, type) => {

    const Users = sequelize.define('users', {
        id: {
            type: type.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            comment: '',
            field: 'id'
        },
        device_id: {
            type: type.STRING(255),
            allowNull: true,
            unique: true,
            defaultValue: null,
            field: 'device_id'
        },
        phone_number: {
            type: type.INTEGER,
            allowNull: true,
            unique: true,
            defaultValue: null,
            field: 'phone_number'
        },
        full_name: {
            type: type.STRING(60),
            allowNull: true,
            defaultValue: null,
            field: 'full_name'
        },
        is_busy: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_busy'
        },
        lat: {
            type: type.DOUBLE,
            allowNull: true,
            field: 'lat'
        },
        long: {
            type: type.DOUBLE,
            allowNull: true,
            field: 'long'
        },
        last_update: {
            type: type.DATE,
            defaultValue: type.NOW,
            field: 'last_update'
        },
        createdAt: {
            type: type.DATE,
            defaultValue: type.NOW,
            field: 'createdAt'
        },
        deletedAt: {
            type: type.DATE,
            defaultValue: '0000-00-00 00:00:00',
            field: 'deletedAt'
        }

    }, {
        timestamps: false,
        underscored: true
    })







    Users.associate = (models) => {

    }


    return Users



}
