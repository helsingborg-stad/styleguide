export default () => {
    const body = document.querySelector("body");
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    console.log(window.innerWidth, document.documentElement.clientWidth);
    console.log(body.getBoundingClientRect());
    body.setAttribute("style", `--scrollbar: ${scrollbar}px`);
}