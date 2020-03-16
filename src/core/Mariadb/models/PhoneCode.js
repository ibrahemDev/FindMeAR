






module.exports = (sequelize, type) => {

    const PhoneCode = sequelize.define('phone_code', {
        id: {
            type: type.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            comment: '',
            field: 'id'
        },
        user_id: {
            type: type.BIGINT.UNSIGNED,
            allowNull: false,
            field: 'user_id',
            references: { // n:n
                model: 'users',
                key: 'id'
            }
        },
        code: {
            type: type.INTEGER.UNSIGNED,
            allowNull: false
        },
        expires: {
            type: type.DATE,
            allowNull: false
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




    PhoneCode.associate = (models) => {
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

    return PhoneCode

    /*
News.sync({force: false}).then(function (err) { if(err) { console.log('An error occur while creating table'); } else{ console.log('Item table created successfully'); } });
*/

}
