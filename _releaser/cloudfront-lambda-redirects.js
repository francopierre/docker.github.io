'use strict';

exports.handler = (event, context, callback) => {
    //console.log("event", JSON.stringify(event)); //foo
    const request = event.Records[0].cf.request;

    const redirects = JSON.parse(`{{.RedirectsJSON}}`);
    for (let key in redirects) {
        if (key !== request.uri) {
            continue;
        }
        console.log(`redirect: ${request.uri} to ${redirects[key]}`);
        const response = {
            status: '301',
            statusDescription: 'Moved Permanently',
            headers: {
                location: [{
                    key: 'Location',
                    value: redirects[key],
                }],
            },
        }
        callback(null, response);
        return
    }

    const redirectsPrefixes = JSON.parse(`{{.RedirectsPrefixesJSON}}`);
    for (let key in redirectsPrefixes) {
        if (!request.uri.startsWith(key)) {
            continue;
        }
        console.log(`redirect: ${request.uri} to ${redirectsPrefixes[key]}`);
        const response = {
            status: '301',
            statusDescription: 'Moved Permanently',
            headers: {
                location: [{
                    key: 'Location',
                    value: redirectsPrefixes[key],
                }],
            },
        }
        callback(null, response);
        return
    }

    callback(null, request);
};
