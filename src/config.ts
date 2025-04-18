
const Config = {
    WETROCLOUD: {
        API_URL: "https://api.wetrocloud.com",
        UPLOAD_URL: "https://file-upload-service-python.vercel.app"
    },
    TEST: {
        WETROCLOUD_SECRET_KEY: process.env.WETROCLOUD_SECRET_KEY!
    }
};



// if (typeof module !== 'undefined') {
//     module.exports = Config;
// }
export default Config;