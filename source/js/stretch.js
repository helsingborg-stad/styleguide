export default () => {
    const body = document.querySelector("body");
    const scrollbar = window.innerWidth - body.clientWidth;
    body.setAttribute("style", `--scrollbar: ${scrollbar}px`);
}