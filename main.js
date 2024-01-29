var dt = new DataTransfer();

(function () {
    function handleFileInputChange(inputFile) {
        inputFile.addEventListener('change', function () {
            var filesList = this.closest('.input-file').nextElementSibling;

            for (var i = 0; i < this.files.length; i++) {
                if (!isFileAlreadyAdded(this.files[i], dt)) {
                    var newFileInput = document.createElement('div');
                    newFileInput.className = 'input-file-list-item';
                    newFileInput.innerHTML = '<span class="input-file-list-name">' + this.files[i].name + '</span>' +
                        '<a href="#" class="input-file-list-remove">x</a>';
                    newFileInput.querySelector('.input-file-list-remove').addEventListener('click', function (event) {
                        event.preventDefault();
                        removeFilesItem(this);
                    });
                    filesList.appendChild(newFileInput);
                    dt.items.add(this.files[i]);
                }
            }

            this.value = '';
        });
    }

    function removeFilesItem(target) {
        var name = target.previousElementSibling.textContent;
        var inputFile = target.closest('.input-file-row').querySelector('input[type=file]');

        target.closest('.input-file-list-item').remove();

        for (var i = 0; i < dt.items.length; i++) {
            if (name === dt.items[i].getAsFile().name) {
                dt.items.remove(i);
            }
        }

        inputFile.files = dt.files;
    }

    function isFileAlreadyAdded(file, dataTransfer) {
        for (var i = 0; i < dataTransfer.items.length; i++) {
            if (file.name === dataTransfer.items[i].getAsFile().name) {
                return true;
            }
        }
        return false;
    }

    var inputFileElements = document.querySelectorAll('.input-file input[type=file]');
    inputFileElements.forEach(handleFileInputChange);
})();

document.getElementById("invoice_number").value = "1270701";

let statusText = document.querySelector(".status");
let confirmButton = document.getElementById("confirm");

confirmButton.addEventListener("click", function (event) {
    event.preventDefault();

    validateForm();
});

function validateForm() {
    var email = document.getElementById("email");
    var fullname = document.getElementById("fullname");
    var amount = document.getElementById("amount");
    var desc = document.getElementById("desc");

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        statusText.innerText = "Пожалуйста, введите корректный адрес электронной почты";
        email.classList.add("error");
        return false;
    } else {
        email.classList.remove("error");
    }

    if (fullname.value.trim() === "") {
        statusText.innerText = "Пожалуйста, введите ФИО";
        fullname.classList.add("error");
        return false;
    } else {
        fullname.classList.remove("error");
    }

    if (isNaN(amount.value) || amount.value.trim() === "") {
        statusText.innerText = "Пожалуйста, введите корректное числовое значение для суммы";
        amount.classList.add("error");
        return false;
    } else {
        amount.classList.remove("error");
    }

    if (desc.value.trim() === "") {
        statusText.innerText = "Пожалуйста, введите описание ситуации";
        desc.classList.add("error");
        return false;
    } else {
        desc.classList.remove("error");
    }

    var formData = new FormData();

    formData.append("email", email.value);
    formData.append("fullname", fullname.value);
    formData.append("amount", amount.value);
    formData.append("desc", desc.value);

    for (var i = 0; i < dt.files.length; i++) {
        formData.append("files", dt.files[i]);
    }

    var apiUrl = "/submit_form";  

    var options = {
        method: "POST",  
        body: formData  
    };
    fetch(apiUrl, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);  
            statusText.innerText = "Данные успешно отправлены!";
        })
        .catch(error => {
            console.error("Error:", error);
            statusText.innerText = "Произошла ошибка при отправке данных.";
        });

    return true;
}