export default () => {
    const body = document.querySelector("body");
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.setAttribute("style", `--scrollbar: ${scrollbar}px`);
}