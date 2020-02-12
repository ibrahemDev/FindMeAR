


module.exports = (sequelize, type) => {

    const LocationInArea = sequelize.define('location_in_area', {
        id: {
            type: type.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            comment: '',
            field: 'id'
        },
        /* emergency_id: {
            type: type.BIGINT.UNSIGNED,
            //allowNull: true,
            //unique: false, // :/
            references: {
                model: 'emergency',
                key: 'id'
            },
            field: 'emergency_id'
        },
         area_id: {
            type: type.BIGINT.UNSIGNED,
            allowNull: true,
            unique: false, // :/
            references: {
                model: 'area',
                key: 'id'
            }
        }, */

        distance: {
            type: type.DOUBLE, // per cm
            allowNull: false,
            field: 'distance'
        },
        createdAt: {
            type: type.DATE,
            defaultValue: type.NOW,
            field: 'createdAt'
        }







    }, {
        timestamps: false,
        underscored: true
    })






    LocationInArea.associate = (models) => {

        const emergency = models.get('Emergency')
        const area = models.get('Area')
        const LocationInArea = models.get('LocationInArea')




        LocationInArea.belongsTo(area)
        LocationInArea.belongsTo(emergency)
        /* LocationInArea.
        LocationInArea.hasMany(_Roles, {
            foreignKey : 'id',
            sourceKey: 'role_id',

        }); */
    }


    return LocationInArea


}
