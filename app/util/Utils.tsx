

export const createCookie = (name, value) => {
  document.cookie = `${name}=${value}; path=/; domain=${location.hostname}; max-age=604800`
}

export const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');

  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const makeRequest = (state, setState, phone, setLoading) => {
  setLoading(true)
  const payload = {
    "USERID": "research",
    "MSISDN": phone,
    "USERDATA": state.userData,
    "MSGTYPE":  state.msgType
  }
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  };

  fetch("https://edgeapi.mardillu.com/api/ussd", requestOptions)
    .then((response) => {
        return response.json()
    })
    .then(data => {
      console.log(JSON.stringify(data, null, 4))
      setLoading(false)
      setState({
        msg: data.MSG,
        msgType: 0,
        completed: data.MSGTYPE
      })
    })
    .catch(err => {
      setLoading(false)
      console.log(err)
    });
}

export const toSentenceCase = (text) => {
  return text
}


export const DISPLAY_STATE_INITIAL = 0
export const DISPLAY_STATE_USER_INPUT = 1
export const DISPLAY_STATE_NETWORK = 2
