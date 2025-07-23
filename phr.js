const axios = require('axios');

exports.generateGUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = (c === 'x') ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

exports.getSession = () => {
    const headers = {
        'Content-Type': 'application/json',
        'TIMESTAMP': new Date().toISOString(),
        'REQUEST-ID': this.generateGUID(),
        'X-CM-ID': 'sbx'
    };

    const body = {
        "clientId": process.env.ABDM_CLIENT_ID,
        "clientSecret": process.env.ABDM_CLIENT_SECRET,
        "grantType": "client_credentials"
    };

    return new Promise((resolve, reject) => {
        axios.post('https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions', body, { headers })
            .then((response) => {
                // console.log("API Response:", response.data);
                resolve(response.data.accessToken);
            })
            .catch((error) => {
                console.error("API Request Error:", error);
                reject(error);
            });
    });
};

exports.getSuggestion = async (req, res) => {

    try {
        const headers = {
            'Content-Type': 'application/json',
            'TIMESTAMP': new Date().toISOString(),
            'REQUEST-ID': this.generateGUID(),
            'X-CM-ID': 'sbx'
        };

        const body = {
            "clientId": process.env.ABDM_CLIENT_ID,
            "clientSecret": process.env.ABDM_CLIENT_SECRET,
            "grantType": "client_credentials"
        };

        const response = await axios.post('https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions',body, { headers, validateStatus: (status) => true });
        console.log("response", response);
        if (response.status == 202) {
            response.data.code = 202
            res.status(202).json(response.data);
        } else {
            res.status(400).json({
                "code": 400,
                "message": response.data.message
            });
        }
    } catch (error) {
        console.log(error);
        res.send({
            "code": 500,
            "message": "Server not found..."
        });
    }
}

exports.getProfile = async (req, res) => {

    let Xtoken = req.body.token;

    try {
        const token = await this.getSession();
        const headers = {
            'Content-Type': 'application/json',
            'TIMESTAMP': new Date().toISOString(),
            'REQUEST-ID': this.generateGUID(),
            'Authorization': `Bearer ${token}`,
            'x-token': `Bearer ${Xtoken}`
        };
        console.log("headers", headers);

        const response = await axios.get('https://abhasbx.abdm.gov.in/abha/api/v3/profile/account', { headers });
        console.log("response", response);
        if (response.status == 200) {
            response.data.code = 200
            res.status(200).json(response.data);
        } else {
            res.status(400).json({
                "code": 400,
                "message": response.data.message
            });
        }
    } catch (error) {
        console.log(error);
        res.send({
            "code": 500,
            "message": "Server not found..."
        });
    }
}

exports.getService = async (req, res) => {

    try {
        const token = await this.getSession();
        const headers = {
            'Content-Type': 'application/json',
            'TIMESTAMP': new Date().toISOString(),
            'REQUEST-ID': this.generateGUID(),
            'Authorization': `Bearer ${token}`,
            'X-CM-ID': 'sbx'
        };

        const response = await axios.get('https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge-service/serviceId/ujjvilas', { headers, validateStatus: (status) => true });
        console.log("response.data", response);

        if (response.status == 200) {
            response.data.code = 200
            res.status(200).json(response.data);
        } else {
            res.status(400).json({
                "code": 400,
                "message": response.data.message
            });
        }
    } catch (error) {
        console.log(error);
        res.send({
            "code": 500,
            "message": "Server not found..."
        });
    }
}