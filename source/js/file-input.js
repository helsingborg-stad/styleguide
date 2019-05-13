/*
    Script for showing selected filenames before upload
    Helsingborgs Stad
 */
const fileIn = document.getElementById('fileinput');
const onChange = event => {

    if (event.target.files && event.target.files[0]) {

        let upload = document.createElement('div');
        let wrapper = document.querySelector('.c-fileinput');

        upload.setAttribute('id', 'fileNameContainer');
        wrapper.appendChild(upload);

        let ufiles = '<ul>';
        for (let int = 0; int < event.target.files.length; int++) {
            ufiles += '<li><i class=" c-icon c-icon--cloud-upload "><span class="c-icon__label"> ' + event.target.files[int].name + '</span></i></li>';
        }
        ufiles += '</ul>';
        document.getElementById('fileNameContainer').innerHTML = ufiles;
    }
};

if (fileIn != null) {
    fileIn.onchange = function () {

        onChange(event);
    };
}