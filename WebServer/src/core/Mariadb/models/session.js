module.exports = (sequelize, type) => {



    const Session = sequelize.define('Session', {
        sid: {
            type: type.STRING(36),
            primaryKey: true
        },
        expires: type.DATE,
        data: type.TEXT,
        user_id: {
            type: type.BIGINT.UNSIGNED,
            field: 'user_id',
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        role_id: {
            type: type.INTEGER.UNSIGNED,
            allowNull: true,
            field: 'roule_id',
            references: {
                model: 'roles',
                key: 'id'
            }
        },
        lastActivity: {
            type: type.DATE,
            allowNull: false,
            field: 'last_activity',
            defaultValue: type.NOW
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

    /* const Session = sequelize.define('session', {
        id: {
            type: type.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            comment: '',
            field: "id",
        },
        secret_key:{
            type: type.STRING(255),
            allowNull: false,
            field: "secret_key",
        },
        lastActivity:{
            type: type.DATE,
            allowNull: false,
            field: "last_activity",
            defaultValue: type.NOW,
        },
        user_id:{
            type: type.BIGINT.UNSIGNED,
            field: "user_id",
            allowNull: false,
            references: {         // User belongsTo roles 1:1
                model: 'users',
                key: 'id',
            }
        },

        createdAt:{
            type:type.DATE,
            defaultValue: type.NOW,
            field: "createdAt",
        },
    },{
        timestamps: false,
        underscored: true,
    }) */


    // QSYS.db.models.




    Session.associate = (models) => {
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

    return Session

    /*
News.sync({force: false}).then(function (err) { if(err) { console.log('An error occur while creating table'); } else{ console.log('Item table created successfully'); } });
*/

}
