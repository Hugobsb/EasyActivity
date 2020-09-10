const handleStructure = () => {
    const concepts = document.getElementById('concepts').value;

    $.post('/structure', { concepts }, response => {
        document.getElementById('concepts').value = '';

        response.filter((a, b) => response.indexOf(a) === b, 0);

        document.getElementById('concepts').classList.remove('concepts');

        for (let i in response) {
            document.getElementById('concepts').value += response[i];
        }
    });
};