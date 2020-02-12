


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
            field: 'device_id'
        },
        phone_number: {
            type: type.INTEGER,
            allowNull: true,
            unique: true,
            field: 'phone_number'
        },
        full_name: {
            type: type.STRING(60),
            allowNull: false,
            field: 'full_name'
        },
        is_busy: {
            type: type.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            field: 'is_busy'
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


    // QSYS.db.models.




    Users.associate = (models) => {
        // let _Roles = models.get('Roles');
        // let _User = models.get('User');

        // this.models.users.belongsToMany(this.models.roles, { through: "role_user" })


        /* _User.belongsToMany(_Roles, {
            through: "role_user" ,

            //foreignKey : 'role',
            //sourceKey: 'role'
        }) */

        /* _User.hasMany(_Roles, {
            foreignKey : 'id',
            sourceKey: 'role_id',

        }); */
        /* User.hasMany(models.Task, {
            foreignKey : 'id',
            sourceKey: 'taskId'
        }); */
    }
    // console.log(User.associate)

    return Users

    /*
News.sync({force: false}).then(function (err) { if(err) { console.log('An error occur while creating table'); } else{ console.log('Item table created successfully'); } });
*/

}
