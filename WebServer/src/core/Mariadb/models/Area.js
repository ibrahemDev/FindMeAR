


module.exports = (sequelize, type) => {

    const Area = sequelize.define('area', {
        id: {
            type: type.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            comment: '',
            field: 'id'
        },
        lat: {
            type: type.DOUBLE,
            allowNull: false,
            field: 'lat'
        },
        long: {
            type: type.DOUBLE,
            allowNull: false,
            field: 'long'
        },

        distance: {
            type: type.INTEGER, // per hour
            defaultValue: 100

        },
        every: {
            type: type.INTEGER, // per hour
            allowNull: true

        },
        start_date: {
            type: type.DATE,
            defaultValue: type.NOW,
            field: 'start_date'
        },
        end_date: {
            type: type.DATE,
            defaultValue: type.NOW,
            field: 'createdAt'
        },
        count: {
            type: type.INTEGER,
            allowNull: true,
            defaultValue: null

        }








    }, {
        timestamps: false,
        underscored: true
    })






    Area.associate = (models) => {

    }


    return Area


}
