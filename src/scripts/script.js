import $ from 'jquery';

// Snackbar ->
function toast(time) {
    $('#snackBar').addClass('show');
    setTimeout(function () {
<<<<<<< HEAD
        $("#snackBar").removeClass("show");
    }, 5000);
=======
        $('#snackBar').removeClass('show');
    }, time);
>>>>>>> 8032fc9ef11831938c81d15534ea506b9be9d14c
}

function showResetPasswordModal() {
    $('#resetPasswordModal').modal({
        backdrop: 'static',
        keyboard: false,
    });
    $('#resetPasswordModal').modal('show');
}

function hideResetPasswordModal() {
    $('#resetPasswordModal').modal('hide');
}

export { toast, showResetPasswordModal, hideResetPasswordModal };
