import Component from '../core/Component.js';

export default class mainPage extends Component {
  setup() {
    this.$state = {
      dummyList: [],
    };
  }
  template() {
    return `
    <h1>Login</h1>
    <div data-component="fetch-api"></div>
    `;
  }

  mounted() {
    const fetchDummy = async () => {
      const dummyPosts = await http.get(
        `https://jsonplaceholder.typicode.com/posts`
      );
      this.setState({ dummyList: [...dummyPosts] });
    };
    if (this.$state.dummyList.length === 0) fetchDummy();
    else {
      const $fetchApi = this.$target.querySelector(
        '[data-component="fetch-api"]'
      );
      // new List($fetchApi, this.$state);
      console.log(this.$state);
      console.log('props', this.$props);
    }
  }
}
