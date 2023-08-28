export default () => {
    document.addEventListener('DOMContentLoaded', () => {
        const body = document.querySelector("body");
        const scrollbar = window.innerWidth - document.documentElement.clientWidth;
        console.log(window.innerWidth, document.documentElement.clientWidth);
        body.setAttribute("style", `--scrollbar: ${scrollbar}px`);
    })
}