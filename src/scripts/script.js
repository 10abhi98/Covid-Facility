import $ from 'jquery';

// Snackbar ->
function toast() {
    $('#snackBar').addClass('show');
    setTimeout(function () {
        $('#snackBar').removeClass('show');
    }, 4800);
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