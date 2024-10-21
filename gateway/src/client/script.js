const registerForm = document.getElementById("form1");
const imagePreview = document.getElementById('imagePreview');
const imageElement = imagePreview.querySelector('.image-preview__image');
const defaultText = imagePreview.querySelector('.image-preview__default-text');
const fileLabel = document.querySelector('.custom-file-upload');
const fileInput = document.getElementById('fileInput');

// Rasm yuklash funksiyasi
fileInput.addEventListener('change', function() {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.addEventListener('load', function() {
            imageElement.setAttribute('src', this.result);
            imageElement.style.display = 'block';
            defaultText.style.display = 'none';

            // Tugmani matnini o'zgartirish
            fileLabel.textContent = 'Edit Picture';
        });

        reader.readAsDataURL(file);
    } else {
        imageElement.setAttribute('src', '');
        imageElement.style.display = 'none';
        defaultText.style.display = 'block';

        // Tugmani matnini qaytarish
        fileLabel.textContent = 'Choose Profile Picture';
    }
});

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // To'g'ri 'id' ni ishlatish
    const nameValue = document.getElementById('name').value; // 'name' inputidan qiymat olish
    const phoneValue = document.getElementById('phone').value; // 'phone' inputidan qiymat olish

    localStorage.setItem('name', nameValue);
    localStorage.setItem('phone', phoneValue);

    const imageSrc = imageElement.getAttribute('src');
    localStorage.setItem('profileImage', imageSrc);
    window.location.href = 'home.html'; 
});
