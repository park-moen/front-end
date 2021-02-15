import { call, put, delay } from 'redux-saga/effects';
import { startLoading, finishLoading } from '../modules/loading';

//  request : 백엔드 api
export default function createRequestSaga(type, request) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return function* (action) {
    yield put(startLoading(type)); // 로딩 시작, type: 요청 작업 종류
    console.log('hi');
    try {
      const response = yield call(request, action.payload);

      yield put({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      console.log(error);
      yield put({
        type: FAILURE,
        payload: error,
      });
    }
    yield delay(2000);
    yield put(finishLoading(type)); // 로딩 종료, type: 요청 작업 종류
  };
}
