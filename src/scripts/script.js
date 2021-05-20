import $ from 'jquery';

// Snackbar ->
function toast(time) {
    $('#snackBar').addClass('show');
    setTimeout(function () {
        $('#snackBar').removeClass('show');
    }, time);
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
