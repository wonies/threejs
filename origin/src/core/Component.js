export default class Component {
  $target; //컴포넌트가 렌더링 될 부모 DOM요소
  $props; // 부모 컴포넌트로부터 전달받은 속성들
  $state; // 컴포넌트의 내부상태

  constructor($target, $props) {
    // 생성자 : 컴포넌트초기화 담당
    console.log('$target: ', $target);
    this.$target = $target;
    this.$props = $props;
    this.setup(); // 컴포넌트의 초기 상태를 설정하는데 사용됨
    // 하위 클래스에서 오버라이드하여 사용함
    this.setEvent();
    // 컴포넌트에 필요한 이벤트 리스너를 설정
    // 하위클래스에서 오버라이드하여 사용함
    this.render();
    // template()메서드의 결과를 사용하여 실제 dom을 갱신함
    // 랜더링 후 mounted()메서드를 호출함
  }

  setup() {
    // this.$state = {
    //   counter: 0,
    // };
  } //컴포넌트 state 설정

  mounted() {} //컴포넌트가 마운트 되었을 때

  template() {
    //UI 구성
    return '';
  }

  render() {
    this.$target.innerHTML = this.template(); //UI 렌더링
    this.mounted();
  }

  setEvent() {} //컴포넌트에서 필요한 이벤트 설정

  setState(newState) {
    // 상태 변경 후 렌더링
    // 컴포넌트의 상태를 업데이트함
    // 스프레드 연산자를 사용하여 기존 상태와 새로운 상태를 병합함
    // 상태 업데이트 후 자동으로 render()를 호출하여 UI갱신
    this.$state = { ...this.$state, ...newState };
    this.render();
  }

  addEvent(eventType, selector, callback) {
    this.$target.addEventListener(eventType, (event) => {
      if (!event.target.closest(selector)) return false;
      callback(event);
    });
  }
}
