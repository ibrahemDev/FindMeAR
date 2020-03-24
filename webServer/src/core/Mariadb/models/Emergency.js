


module.exports = (sequelize, type) => {

    const Emergency = sequelize.define('emergency', {
        id: {
            type: type.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            comment: '',
            field: 'id'
        },
        user_id: {
            type: type.BIGINT.UNSIGNED,
            field: 'user_id',
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        employee_id: {
            type: type.BIGINT.UNSIGNED,
            field: 'employee_id',
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        title: {
            type: type.STRING(60),
            allowNull: false,
            field: 'title'
        },
        description: {
            type: type.STRING(500),
            allowNull: true,
            field: 'description'
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
        status: {

            type: type.DECIMAL,
            allowNull: false,
            defaultValue: 1,
            field: 'status'
        },
        status_msg: {
            type: type.STRING(500),
            allowNull: true,
            field: 'status_msg'


        },
        is_static: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_static'
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


    // QSYS.db.models.




    Emergency.associate = (models) => {


        const Users = models.get('Users')
        const Emergency = models.get('Emergency')


        Emergency.belongsTo(Users, { foreignKey: 'user_id', as: 'injured' })
        Emergency.belongsTo(Users, { foreignKey: 'employee_id', as: 'paramedic' })
    }
    // console.log(User.associate)

    return Emergency

    /*
News.sync({force: false}).then(function (err) { if(err) { console.log('An error occur while creating table'); } else{ console.log('Item table created successfully'); } });
*/

}
