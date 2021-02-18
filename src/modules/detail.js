import { createAction, handleActions } from 'redux-actions';
import createRequestSaga from '../lib/createRequestSaga';
import * as API from '../lib/api/detail';
import { takeLatest } from 'redux-saga/effects';
import produce from 'immer';
// Action Type
const SEARCH_TO_DETAIL = 'detail/SEARCH_TO_DETAIL';
const DATE_CHANGE_DETAIL = 'detail/DATE_CHANGE_DETAIL';
const GUEST_CHANGE_DETAIL = 'detail/GUEST_CHANGE_DETAIL';
const ROOM_ID_DETAIL = 'detail/ROOM_ID_DETAIL';
const REQUEST_DETAIL = 'detail/REQUEST_DETAIL';
const REQUEST_DETAIL_SUCCESS = 'detail/REQUEST_DETAIL_SUCCESS';
const REQUEST_DETAIL_FAILURE = 'detail/REQUEST_DETAIL_FAILURE';
const CLEAR_GUEST_DETAIL = 'detail/CLEAR_GUEST_DETAIL';
const CLEAR_CHECKDATE_DETAIL = 'detail/CLEAR_CHECKDATE_DETAIL';
const GET_TOTAL_PRICE = 'detail/GET_TOTAL_PRICE';
const GET_CANCELLABLE_DATE = 'detail/GET_CANCELLABLE_DATE';
const GET_ROOM_AVERAGE_SCORE = 'detail/GET_ROOM_AVERAGE_SCORE';
const GET_ROOM_AVERAGE_SCORE_SUCCESS = 'detail/GET_ROOM_AVERAGE_SCORE_SUCCESS';
// Action Creator
export const searchToDetail = createAction(
  SEARCH_TO_DETAIL,
  (startDate, endDate, numOfAdult, numOfKid, numOfInfant) => ({
    startDate,
    endDate,
    numOfAdult,
    numOfKid,
    numOfInfant,
  }),
);
export const dateChangeDetail = createAction(
  DATE_CHANGE_DETAIL,
  (input, date) => ({ input, date }),
);
export const guestChangeDetail = createAction(
  GUEST_CHANGE_DETAIL,
  (input, guest) => ({ input, guest }),
);
export const requestDetail = createAction(REQUEST_DETAIL, (id) => id);
export const clearGuestDetail = createAction(CLEAR_GUEST_DETAIL);
export const clearCheckDateDtail = createAction(CLEAR_CHECKDATE_DETAIL);
export const getTotalPrice = createAction(
  // total 숙박비용
  GET_TOTAL_PRICE,
  (totalCost) => totalCost,
);
export const getCancellableDate = createAction(
  GET_CANCELLABLE_DATE,
  (month, day) => ({ month, day }),
); // 예약취소 가능한 날짜
export const getRoomAverageScore = createAction(
  GET_ROOM_AVERAGE_SCORE,
  (roomId) => roomId,
);

// saga
const requestDetailSaga = createRequestSaga(
  REQUEST_DETAIL,
  API.detailInformation,
);
const requestCommentSaga = createRequestSaga(
  GET_ROOM_AVERAGE_SCORE,
  API.requestComments,
);
export function* detailSaga() {
  yield takeLatest(REQUEST_DETAIL, requestDetailSaga);
  yield takeLatest(GET_ROOM_AVERAGE_SCORE, requestCommentSaga);
}
// initial state
const initialStates = {
  startDate: '',
  endDate: '',
  numOfAdult: 0,
  numOfKid: 0,
  numOfInfant: 0,
  infoRes: {
    id: '',
    name: '',
    hostName: '',
    hostImgURL: '',
    roomType: '',
    roomCost: 0,
    cleaningCost: 0,
    tax: 0,
    peopleLimit: 0,
    description: '',
    checkOutTime: '13:00:00',
    checkInTime: '15:00:00',
    isSmoking: false,
    isParking: false,
    bedRoomNum: 0,
    bedNum: 0,
    bathRoomNum: 0,
    grade: 0,
    commentCount: 0,
    locationDetail: {
      country: null,
      city: '',
      borough: '',
      neighborhood: '',
      detailAddress: null,
      latitude: 0,
      longitude: 0,
    },
    commentList: [],
    roomImgUrlList: [],
    roomAverageScore: {
      cleanliness: null,
      accuracy: null,
      communication: null,
      locationRate: null,
      checkIn: null,
      priceSatisfaction: null,
    },
  },
  totalCost: 0,
  CancellableDate: {},
  detailError: null,
};
// reducer
const detail = handleActions(
  {
    [SEARCH_TO_DETAIL]: (
      state,
      { payload: { startDate, endDate, numOfAdult, numOfKid, numOfInfant } },
    ) => ({
      ...state,
      startDate,
      endDate,
      numOfAdult,
      numOfKid,
      numOfInfant,
    }),
    [DATE_CHANGE_DETAIL]: (state, { payload: { input, date } }) => ({
      ...state,
      [input]: date,
    }),
    [GUEST_CHANGE_DETAIL]: (state, { payload: { input, guest } }) => ({
      ...state,
      [input]: guest,
    }),
    [ROOM_ID_DETAIL]: (state, { payload: id }) => ({ ...state, rommId: id }),
    [CLEAR_GUEST_DETAIL]: (state, _) => ({
      ...state,
      numOfAdult: 0,
      numOfKid: 0,
      numOfInfant: 0,
    }),
    [CLEAR_CHECKDATE_DETAIL]: (state, _) => ({
      ...state,
      startDate: '',
      endDate: '',
    }),
    [REQUEST_DETAIL_SUCCESS]: (state, { payload: infoRes }) => {
      sessionStorage.setItem('detailRes', JSON.stringify(infoRes));
      return {
        ...state,
        infoRes,
      };
    },
    [REQUEST_DETAIL_FAILURE]: (state, { payload: error }) => ({
      ...state,
      detailError: error,
    }),
    [GET_TOTAL_PRICE]: (state, { payload: totalCost }) => ({
      ...state,
      totalCost,
    }),
    [GET_CANCELLABLE_DATE]: (state, { payload: { month, day } }) => ({
      ...state,
      cancellableDate: { month, day },
    }),
    [GET_ROOM_AVERAGE_SCORE_SUCCESS]: (
      state,
      {
        payload: {
          cleanliness,
          accuracy,
          communication,
          locationRate,
          checkIn,
          priceSatisfaction,
        },
      },
    ) =>
      produce(state, (draft) => {
        draft.infoRes.roomAverageScore = {
          cleanliness,
          accuracy,
          communication,
          locationRate,
          checkIn,
          priceSatisfaction,
        };
      }),
  },
  initialStates,
);
export default detail;
