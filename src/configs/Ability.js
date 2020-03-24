import { AbilityBuilder } from "@casl/ability";

let roles;
let permissions;
let rolePermissions;
fetch('/getAllRoles')
    .then((res) => res.json())
    .then((json) => {
        // console.log(json)
        roles = json.data
    })
    .catch((err => {
        console.log(err);
    }))
fetch('/getAllPermissions')
    .then((res) => res.json())
    .then((json) => {
        // console.log(json)
        permissions = json.data
    })
    .catch((err => {
        console.log(err);
    }))

fetch('/getAllRolesPermissions')
    .then((res) => res.json())
    .then((json) => {
        // console.log(json)
        rolePermissions = json.data
    })
    .catch((err => {
        console.log(err);
    }))

export default function defineRulesFor(role) {
    const { can, rules } = AbilityBuilder.extract();

    //finding user's role
    let userRoleId, userRolePermissions, userPermissions = []
    if (roles !== undefined && role !== undefined) {
        // console.log('1');

        roles.forEach(Role => {
            // console.log(Role.name);
            // console.log(role);

            if (Role.name === role) {
                userRoleId = Role.id
            }
        })
        // console.log(userRoleId);

        //getting permissions against that role
        if (rolePermissions !== undefined && userRoleId !== undefined) {
            // console.log('2');
            userRolePermissions = rolePermissions.filter(rolePermission => rolePermission.role_id === userRoleId)
        }

        // console.log(userRolePermissions);

        //getting user's permissions
        if (userRolePermissions !== undefined && permissions !== undefined) {
            // console.log('3');

            userRolePermissions.forEach(rolePermission => {
                permissions.forEach(permission => {
                    if (permission.id === rolePermission.permission_id) {
                        userPermissions.push(permission)
                    }
                })
            })
        }
        // console.log(userPermissions);

        // defining rules for user
        if (userPermissions !== [] && userPermissions !== undefined) {
            for (let index = 0; index < userPermissions.length; index++) {
                can(`${userPermissions[index].permission}`, `${userPermissions[index].entity}`)
                // console.log(`${userPermissions[index].permission}`, `${userPermissions[index].entity}`);

            }
        }

    }
    return rules;
}
