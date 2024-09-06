export default class Component {
  $target;
  $props;
  $state;

  constructor($target, $props) {
    console.log('Constructor');
    this.$target = $target;
    this.$props = $props;

    this.setup();
    this.render();
    this.setEvent();
  }

  setup() {}
  mounted() {}

  template() {
    return '';
  }

  render() {
    this.$target.innerHTML = this.template();
    this.mounted();
  }

  setEvent() {}
  setState(newState) {
    this.$state = { ...this.$state, ...newState };
    this.render();
  }

  goToHome() {}

  addEvent(eventType, selector, callback) {
    this.$target.addEventListener(eventType, (event) => {
      if (!event.target.closest(selector)) return false;
      callback(event);
    });
  }
}
