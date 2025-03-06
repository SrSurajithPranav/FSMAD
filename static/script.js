document.getElementById('analyzeStatic').addEventListener('click', function() {
    let selectedUser = document.getElementById('staticUserSelect').value;
    if (selectedUser) {
        let form = document.createElement('form');
        form.method = 'POST';
        form.action = '/analyze';
        let input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'username';
        input.value = selectedUser;
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
    } else {
        alert('Please select a username from the dropdown.');
    }
});
