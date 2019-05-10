/*
    Script for showing selected filenames before upload
 */
const fileIn = document.getElementById('fileinput');
const onChange = event => {

    if(event.target.files && event.target.files[0]) {

        let upload = document.createElement('div');
        let wrapper = document.querySelector('.c-fileinput');

        upload.setAttribute('id', 'fileNameContainer');
        wrapper.appendChild(upload);

        let ufiles = '';
        for(let int=0;  int < event.target.files.length; int++){
            ufiles += event.target.files[int].name+'<br />';
        }
        document.getElementById('fileNameContainer').innerHTML = ufiles;
    }
};

fileIn.onchange = function() {
    onChange(event);
};