


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
        every: {
            type: type.INTEGER, // per hour
            allowNull: false

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
        }








    }, {
        timestamps: false,
        underscored: true
    })






    Area.associate = (models) => {

    }


    return Area


}
