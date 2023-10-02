export default () => {
    const body = document.querySelector("body");
    if (!body) return;
    const viewportWidth = window.innerWidth - document.documentElement.clientWidth;
    const scrollbar = Math.min(viewportWidth, 15);
    body.setAttribute("style", `--scrollbar: ${scrollbar}px`);
}