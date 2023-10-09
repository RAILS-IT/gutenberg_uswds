((Drupal) => {

  /**
   * Expand or Collapse accordions created in Gutenberg.
   *
   * @type {Drupal~behavior}
   *
   * @prop {Drupal~behaviorAttach} attach
   *   Attach expand or collapse accordions functionality.
   */
  Drupal.behaviors.gutenbergExpandCollapseAll = {
    attach(context) {
      const groups = context.querySelectorAll('.operations-group');
      groups.forEach(group => {
        const expand = group.querySelector('.expand-link');
        const collapse = group.querySelector('.collapse-link');
        if (expand) {
          expand.onclick = function(e){
            e.preventDefault();
            const accordionId = this.getAttribute('data-controls');
            const accordion = context.getElementById(accordionId);
            Drupal.toogleAccordions(group, accordion);
          }
        }
        if (collapse) {
          collapse.onclick = function(e){
            e.preventDefault();
            const accordionId = this.getAttribute('data-controls');
            const accordion = context.getElementById(accordionId);
            Drupal.toogleAccordions(group, accordion, false);
          }
        }
      });
    },
  };

  /**
   * Expands or Collapse all items in an accordion.
   * @param {object} group The operations group.
   * @param {object} accordion The accordion.
   * @param {boolean} status If should expand or collapse.
   */
  Drupal.toogleAccordions = function(group, accordion, status = true) {
    group.classList.toggle('collapsed');
    accordion.querySelectorAll('.usa-accordion__button').forEach(element => {
      element.ariaExpanded = status;
    });
    accordion.querySelectorAll('.usa-accordion__content').forEach(element => {
      if (status) {
        element.removeAttribute('hidden');
      }
      else {
        element.setAttribute('hidden', '');
      }
    });
  }

})(Drupal);
