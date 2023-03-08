import {getGraphApiAccessToken, graphConfig} from "../utils/authConfig";

const getProfilePhoto = async (userEmail: string) => {
    return await fetch(`${graphConfig.graphPhotoEndpoint}users/${userEmail}/photo/$value`, {
        method: 'Get',
        headers: {Authorization: `Bearer ${await getGraphApiAccessToken()}`}
    }).then(async (o) => {
        const url = window.URL || window.webkitURL;
        return url.createObjectURL(await o.blob());
    });
}

export {
    getProfilePhoto
}