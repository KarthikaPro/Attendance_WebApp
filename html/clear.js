function clearLoginInputFields() {
    document.getElementById('userName').value = '';
    document.getElementById('userPassword').value = '';
}

document.getElementById('loginForm').addEventListener('load', clearLoginInputFields);