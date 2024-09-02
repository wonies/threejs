const parseResponse = async (response) => {
  const { status } = response;
  let data;
  if (status !== 204) {
    data = await response.json();
  }

  return {
    status,
    data,
  };
};

/*
request 함수는 http요청을 보내는 일반적인 함수
매개변수
- params : 객체 형태로 다음 속성을 포함함
- method: HTTP메서드(기본값은 get)
- url: 요청을 보낼 URL
- headers :요청 헤더 (기본값은 빈 객체)
- body : 요청 본문(선택적)
*/

const request = async (params) => {
  const { method = 'GET', url, headers = {}, body } = params;
  // method : HTTP method (get, post, put등)
  // url : 요청을 보낼 대상 URL
  // headers : 요청 헤더 정보를 담은 객체
  // body : 요청 본문(Post, put요청 시 주로 사용)
  // 구조 분해 할당이라는 javascript 문법을 사용하고 있음

  // async 키워드는 함수 선언 앞에 붙여 사용함
  // async 함수는 항상 프로미스를 반환함
  // 주요특징:
  // - 비동기 작업을 동기적인 코드처럼 작성할 수 있게 해줌
  // await키워드와 함께 사용하여 프로미스의 결과를 기다릴 수 있음
  // await : async 함수 내에서 사용되는 키워드로 비동기 작업의 완료를 기다리는데 사용 됨
  // await: 프로미스가 완료될 때 까지 함수의 실행을 일시 중지함
  // 프로미스가 해결되면 그 결과값을 반환함
  // await는 반드시 async 함수내에서만 사용가능
  // - Promise를 반환하는 표현식 앞에 await를 붙임
  // 비동기 코드를 동기적으로 보이게 만들어 가독성을 높임
  // 프로미스 체인(.then())을 사용하는 것보다 코드가 간결해짐

  const config = {
    method,
    headers: new window.Headers(headers),
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await window.fetch(url, config);

  return parseResponse(response);
};

const get = async (url, headers) => {
  const response = await request({
    url,
    headers,
    method: 'GET',
  });

  return response.data;
};

const post = async (url, body, headers) => {
  const response = await request({
    url,
    headers,
    method: 'POST',
    body,
  });
  return response.data;
};

const put = async (url, body, headers) => {
  const response = await request({
    url,
    headers,
    method: 'PUT',
    body,
  });
  return response.data;
};

const patch = async (url, body, headers) => {
  const response = await request({
    url,
    headers,
    method: 'PATCH',
    body,
  });
  return response.data;
};

const deleteRequest = async (url, headers) => {
  const response = await request({
    url,
    headers,
    method: 'DELETE',
  });
  return response.data;
};

export default {
  get,
  post,
  put,
  patch,
  delete: deleteRequest,
};
