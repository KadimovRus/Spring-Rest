let roleList = [];
const headTable = document.getElementsByTagName('thead');

showHeadTable();
getAllUsers();

function showHeadTable() {
    let headText = "<tr>\n" +
        "                            <th scope=\"col\">ID</th>\n" +
        "                            <th scope=\"col\">First Name</th>\n" +
        "                            <th scope=\"col\">Last Name</th>\n" +
        "                            <th scope=\"col\">Age</th>\n" +
        "                            <th scope=\"col\">Email</th>\n" +
        "                            <th scope=\"col\">Role</th>\n" +
        "                            <th scope=\"col\">Edit</th>\n" +
        "                            <th scope=\"col\">Delete</th>\n" +
        "                        </tr>";

    headTable.item(0).innerHTML = headText;
}

function getAllUsers() {
    $.getJSON("http://localhost:8080/admin/allUsers", function(data) {
        let rows ='';
        $.each(data, function(key, user) {
            rows += createRows(user);
        });
        $('#tableAllUsers').append(rows);

        $.ajax( {
            url: '/admin/authorities',
            method: 'GET',
            dataType: 'json',
            success: function (roles) {
                roleList = roles;
            }
        });
    });
}

function createRows(user) {
    let user_data = "<tr id= " + user.id + " > <td> " + user.id + " </td>";
    user_data += '<td>' + user.firstname + '</td>';
    user_data += '<td>' + user.lastname + '</td>';
    user_data += '<td>' + user.age + '</td>';
    user_data += '<td>' + user.email + '</td>';
    user_data += '<td>';
    let roles = user.authorities;
    for (let role of roles) {
        user_data += role.role.replace('ROLE_', '') + ' ';
    }
    user_data += '</td>' +
        '<td>' + '<input id="btnEdit" value="Edit" type="button" ' +
        'class="btn-info btn edit-btn" data-toggle="modal" data-target="#editModal" ' +
        'data-id="' + user.id + '">' + '</td>' +
        '<td>' + '<input id="btnDelete" value="Delete" type="button" class="btn btn-danger del-btn" ' +
        'data-toggle="modal" data-target="#deleteModal" data-id=" ' + user.id + ' ">' + '</td>';
    user_data += '</tr>';

    return user_data;
}

function getUserRolesForEdit() {
    let allRoles = [];
    $.each($("select[name='editRoles'] option:selected"), function() {
        let role = {};
        role.id = $(this).attr('id');
        role.role = $(this).attr('name');
        allRoles.push(role);
    });
    return allRoles;
}

$(document).on('click', '.edit-btn', function() {
    const user_id = $(this).attr('data-id');
    $.ajax( {
        url : '/admin/' + user_id,
        method: 'GET',
        dataType: 'json',
        success: function (user) {
            $('#editId').val(user.id);
            $('#editName').val(user.firstname);
            $('#editLastName').val(user.lastname);
            $('#editAge').val(user.age);
            $('#editEmail').val(user.email);
            $('#editPassword').val(user.password);
            $('#editRole').empty();

            roleList.map(role => {
                let flag = user.authorities.find(item => item.id === role.id) ? 'selected' : '';
                $('#editRole').append('<option id="' + role.id + '" ' + flag + ' name="' + role.role + '">' +
                     role.role.replace('ROLE_', '') + '</option>')
            })
        }
    })
});



$('#editButton').on('click', (e) => {
    e.preventDefault();

    let userEditId = $('#editId').val();

    var editUser = {
        id: $("input[name='id']").val(),
        firstname: $("input[name='firstname']").val(),
        lastname: $("input[name='lastname']").val(),
        age: $("input[name='age']").val(),
        email: $("input[name='email']").val(),
        password: $("input[name='password']").val(),
        roles: getUserRolesForEdit()
    }

    console.log(editUser);

    $.ajax({
        url: '/admin',
        method: 'PUT',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(editUser),
        success: (data) => {
            let newRow = createRows(data);
            console.log("newRow: " + newRow)
            $('#tableAllUsers').find('#' + userEditId).replaceWith(newRow);
            $('#editModal').modal('hide');
            $('#admin-tab').tab('show');
        },
        error: () => {
            console.log("error editUser")
        }
    });
});

$(document).on('click', '.del-btn', function () {

    let user_id = $(this).attr('data-id');

    $.ajax({
        url: '/admin/' + user_id,
        method: 'GET',
        dataType: 'json',
        success: function (user) {
            $('#delId').empty().val(user.id);
            $('#delFirstname').empty().val(user.firstname);
            $('#delLastname').empty().val(user.lastname);
            $('#delAge').empty().val(user.age);
            $('#delEmail').empty().val(user.email);
            $('#delPassword').empty().val(user.password);
            $('#delRole').empty();

            roleList.map(role => {
                let flag = user.authorities.find(item => item.id === role.id) ? 'selected' : '';
                $('#delRole').append('<option id="' + role.id + '" ' + flag + ' name="' + role.role + '" >' +
                    role.role.replace('ROLE_', '') + '</option>')
            })
        }
    });
});

$('#deleteButton').on('click', (e) => {
    e.preventDefault();
    let userId = $('#delId').val();
    $.ajax({
        url: '/admin/' + userId,
        method: 'DELETE',
        success: function () {
            $('#' + userId).remove();
            $('#deleteModal').modal('hide');
            $('#admin-tab').tab('show');
        },
        error: () => {
            console.log("error delete user")
        }
    });
});

function getUserRolesForAdd() {
    var allRoles = [];
    $.each($("select[name='addRoles'] option:selected"), function () {
        var role = {};
        role.id = $(this).attr('id');
        role.role = $(this).attr('name');
        allRoles.push(role);
        console.log("role: " + JSON.stringify(role));
    });
    return allRoles;
}

$('.newUser').on('click', () => {

    $('#name').empty().val('')
    $('#lastname').empty().val('')
    $('#age').empty().val('')
    $('#email').empty().val('')
    $('#password').empty().val('')
    $('#addRole').empty().val('')
    roleList.map(role => {
        $('#addRole').append('<option id="' + role.id + '" name="' + role.role + '">' +
            role.role.replace('ROLE_', '') + '</option>')
    })
})


$("#addNewUserButton").on('click', () => {
    let newUser = {
        firstname: $('#name').val(),
        lastname: $('#lastName').val(),
        age: $('#age').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        roles: getUserRolesForAdd()
    }

    $.ajax({
        url: 'http://localhost:8080/admin',
        method: 'POST',
        dataType: 'json',
        data: JSON.stringify(newUser),
        contentType: 'application/json; charset=utf-8',
        success: function () {
            $('#tableAllUsers').empty();
            getAllUsers();
            $('#admin-tab').tab('show');
        },
        error: function () {
            alert('error addUser')
        }
    });
});