fetch('https://api.xn--5brr03o.top/test/test.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('网络响应不正常: ' + response.statusText);
        }
        return response.json();
    })
    .then(apiData => {

        document.getElementById('adContentText').innerText = apiData.notice;
    })