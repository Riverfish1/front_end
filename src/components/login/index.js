$(function() {
    var username = $('username').val;
    var password = $('password').val;
    console.log(username, password)
    $('#btn_submit').click(function() {
        $.get({
            url: '/login/login',
            params: {
                username: username,
                password: password
            },
            success: function(data) {
                console.log(data);
            }
        });
    })
})