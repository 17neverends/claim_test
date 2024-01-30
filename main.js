var dt = new DataTransfer();
let statusText = document.querySelector(".status");

(function () {
    var statusText = document.querySelector(".status");
    var maxVideoSize = 500 * 1024 * 1024; 
    var maxImageSize = 30 * 1024 * 1024;  
    var maxPdfSize = 20 * 1024 * 1024;   
    function handleFileInputChange(inputFile) {
        inputFile.addEventListener('change', function () {
            var filesList = this.closest('.input-file').nextElementSibling;
            var maxDuration = 120;


            for (var i = 0; i < this.files.length; i++) {
                var file = this.files[i];

            
                    if (this.accept.includes('video') && file.type.includes('video')) {
                        if (file.size <= maxVideoSize) {
                            var video = document.createElement('video');
                            video.src = URL.createObjectURL(file);
    
                            video.addEventListener('loadedmetadata', function () {
                                if (this.duration <= maxDuration) {
                                    if (!isFileAlreadyAdded(file, dt)) {
                                        addFileToList(file, filesList);
                                    } else {
                                        statusText.innerText = 'Файл с именем ' + file.name + ' уже добавлен.';
                                    }
                                } else {
                                    statusText.innerText = 'Длительность видео ' + file.name + ' превышает допустимый объем.';
                                }
                            });
                        } else {
                            statusText.innerText = 'Файл с именем ' + file.name + ' превышает допустимый лимит.';

                        }

                    } else if (this.accept.includes('image') && file.type.includes('image')) {
                        if (file.size <= maxImageSize) {
                            if (!isFileAlreadyAdded(file, dt)) {
                                addFileToList(file, filesList);
                            } else {
                                statusText.innerText = 'Файл с именем ' + file.name + ' уже добавлен.';
                            }} else {
                                statusText.innerText = 'Размер ' + file.name + ' превышает допустимый объем.';

                            }

                        
                    } else if (this.accept.includes('pdf') && getFileExtension(file.name).toLowerCase() === 'pdf') {
                        if (file.size <= maxPdfSize) {
                            if (!isFileAlreadyAdded(file, dt)) {
                                addFileToList(file, filesList);
                            } else {
                                statusText.innerText = 'Файл с именем ' + file.name + ' уже добавлен.';
                            }} else {
                                statusText.innerText = 'Размер ' + file.name + ' превышает допустимый объем.';

                            }}
                
            }

            this.value = '';
        });
    }

    function getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    function addFileToList(file, filesList) {
        var newFileInput = document.createElement('div');
        newFileInput.className = 'input-file-list-item';
        newFileInput.innerHTML = '<span class="input-file-list-name">' + file.name + '</span>' +
            '<a href="#" class="input-file-list-remove">x</a>';
        newFileInput.querySelector('.input-file-list-remove').addEventListener('click', function (event) {
            event.preventDefault();
            removeFilesItem(this);
        });
        filesList.appendChild(newFileInput);
        dt.items.add(file);
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

let confirmButton = document.getElementById("confirm");

confirmButton.addEventListener("click", function (event) {
    event.preventDefault();

    validateForm();
});

function validateForm() {
    var invoice_number = document.getElementById("invoice_number");
    var email = document.getElementById("email");
    var fullname = document.getElementById("fullname");
    var amount = document.getElementById("amount");
    var desc = document.getElementById("desc");

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (invoice_number.value.trim() === ""){
        statusText.innerText = "Пожалуйста, введите номер накладной";
        invoice_number.classList.add("error");
        return false;
    } else {
        invoice_number.classList.remove("error");
    }

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
