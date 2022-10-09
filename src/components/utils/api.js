const BASE_URL = 'https://hookb.in';

export const sendApplication = (leasingParams) => {
  return fetch(`${BASE_URL}/eK160jgYJ6UlaRPldJ1P`, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(leasingParams),
  }).then((res) => (res.ok ? res.json() : Promise.reject(res)));
};
