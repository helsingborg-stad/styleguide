const init = () => {
    let elements: Element[] = [];
  
    const toggleDropdownElements = (dropdowns: Element[] = []) =>
      dropdowns.forEach((e) => e.classList.toggle('is-open'));
  
    const toggleDropdowns = (dropdowns: Element[] = []) => {
      toggleDropdownElements([...elements, ...dropdowns]);
      elements = [...dropdowns];
    };
  
    const dropdowns = [...document.querySelectorAll('.js-dropdown')].map(
      (dropdown) => {
        [...dropdown.querySelectorAll('.js-dropdown-button')].forEach((btn) => {
          btn.addEventListener('click', () => {
            const isOpen = [...(dropdown?.classList ?? [])].includes('is-open');
            toggleDropdowns(!isOpen ? [dropdown] : []);
          });
        });
  
        return dropdown;
      },
    );

    if (dropdowns.length > 0) {
      document.addEventListener(
        'click',
        (e: MouseEvent) => {
          const el = e.target as Element;
  
          if (!el?.closest('.js-dropdown')) {
            toggleDropdowns([]);
          }
        },
        false,
      );
    }
  };
  
  export default (() => {
    addEventListener('DOMContentLoaded', init);
  })();
  