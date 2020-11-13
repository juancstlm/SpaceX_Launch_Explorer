import {URLSearchParams} from 'react-native/Libraries/Blob/URL';

const BASE_URL = 'https://api.spacexdata.com/v3/'; //spaceX API

//gets all SpaceX launches
export const getLaunches = (offset = 0) => {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };
  return new Promise((resolve, reject) => {
    const url =
      `${BASE_URL}launches/?` +
      new URLSearchParams({
        limit: 5,
        offset: offset,
      });
    fetch(url, requestOptions)
      .then((response) => {
        const json = response.json();
        resolve(json);
      })
      .catch((error) => console.log('error', error));
  });
};

export const addLaunch = (model) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({status: 200});
    }, 200);
  });
};
